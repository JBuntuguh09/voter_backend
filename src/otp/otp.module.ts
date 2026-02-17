import { Module } from '@nestjs/common';
import { OtpService } from './otp.service';
import { OtpController } from './otp.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Otp } from './entities/otp.entity';
import { User } from 'src/auth/entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { Person } from 'src/person/entities/person.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([Otp, User, Person]),
    PassportModule,
    //configure jwt
    JwtModule.register({})
  ],
  controllers: [OtpController],
  providers: [OtpService],
  exports:[OtpService]
})
export class OtpModule {}
