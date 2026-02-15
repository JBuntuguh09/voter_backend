import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOtpDto } from './dto/create-otp.dto';
import { UpdateOtpDto } from './dto/update-otp.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Otp } from './entities/otp.entity';
import { MoreThan, Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { OTPType } from 'src/common/enum/enums.enum';
import * as crypto from 'crypto'
import * as bcrypt from 'bcrypt'
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class OtpService {
  constructor(
        @InjectRepository(Otp)
        private readonly otpRepository:Repository<Otp>,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService){}

  create(createOtpDto: CreateOtpDto) {
    return 'This action adds a new otp';
  }

  findAll() {
    return `This action returns all otp`;
  }

  findOne(id: number) {
    return `This action returns a #${id} otp`;
  }

  update(id: number, updateOtpDto: UpdateOtpDto) {
    return `This action updates a #${id} otp`;
  }

  remove(id: number) {
    return `This action removes a #${id} otp`;
  }

  async generateOtp(user:User, type: OTPType){
            
            if(type === OTPType.OTP){
                const otp = crypto.randomInt(100000, 999999).toString()
                const hashedOtp = await bcrypt.hash(otp, 10) 
                const now = new Date();
                const expiresAt = new Date(now.getTime() + 5 * 60*1000)
    
                //check if exist
                const isExist = await this.otpRepository.findOne({
                    where:{user:{id:user.id}, type}
                })
    
                if (isExist) {
                  //update old otp
                  isExist.token = hashedOtp;
                  isExist.expiresAt = expiresAt;
    
                  await this.otpRepository.save(isExist);
                } else {
                  //create new otp entity
                  const optEntity = this.otpRepository.create({
                    user,
                    token: hashedOtp,
                    type,
                    expiresAt,
                  });
    
                  await this.otpRepository.save(optEntity);
                }
                return otp;
            }else if(type === OTPType.RESET_PASSWORD){
                const reset_link = this.jwtService.sign(
                    {id:user.id,
                      email:user.email   
                    },{
                        secret: this.configService.get<string>("JWT_RESET_SECRET"),
                        expiresIn:'15m'
                    })

                return reset_link    
            }
           

            
        
        }
        
        async validateOtp(userId: number, token:string):Promise<boolean>{
            const validToken = await this.otpRepository.findOne(
                {where: {
                    user:{id:userId},
                    expiresAt: MoreThan(new Date())
                }
            })
            if(!validToken){
                throw new BadRequestException("OTP has expired. Request a new one")
            }

            const  matches = await bcrypt.compare(token, validToken.token)

            if(!matches){
                throw new BadRequestException("Invalid OTP. Please try again.")

            }
            return true;
        }

        async validateResetPassword(token: string){
            try{
                const decode = await this.jwtService.verify(token, {
                    secret: this.configService.get<string>("JWT_RESET_SECRET")
                })

                return decode.id;
            }catch(error:any){
               if(error?.name === 'TokenExpiredError'){
                    throw new BadRequestException("The reset token has expired. Request an new one")
               } 
               throw new BadRequestException('Invalid or malformed reset token');
               
            }
        }

        async deleteByUserId(userId: number){
            try {
                const otps = await this.otpRepository.find({where:{user:{id:userId}}})

                await this.otpRepository.remove(otps)

                return `Successfully deleted all user ${userId}'s OTP`

            } catch (error) {
                
            }
        }
}
