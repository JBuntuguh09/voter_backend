import { Injectable, NotFoundException, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { User } from './entities/user.entity';
import { Otp } from 'src/otp/entities/otp.entity';
import { Role } from 'src/role/entities/role.entity';
import { PersonService } from 'src/person/person.service';
import { EmailService } from 'src/email/email.service';
import { OtpService } from 'src/otp/otp.service';
import { ConfigService } from '@nestjs/config';

import {
  GetUsersDto,
  LoginDto,
  RegisterDto,
  UpdateUserRegisterDto,
  UpdateUserDto,
  GetUserQueryDto,
  ResendResetPasswordDTO,
  ResetPasswordDTO,
} from './dto/create-auth.dto';

import { OTPType } from 'src/common/enum/enums.enum';
import { SendEmailDTO } from 'src/email/dto/create-email.dto';
import { RequestOtp } from './dto/create-auth.dto';
import { Person } from 'src/person/entities/person.entity';
import { dot } from 'node:test/reporters';
import { randomInt } from 'crypto';
import { generateSixCharPassword } from 'src/common/utils/Interface';
import { ChannelEnum } from 'src/message/dto/create-message.dto';
import { newUser, ResendMess } from 'src/common/template/messages';

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const NUMBERS = "0123456789";
const ALL = LETTERS + NUMBERS;

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Otp)
    private readonly otpRepository: Repository<Otp>,
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,

    @InjectRepository(Person)
    private readonly personRepo: Repository<Person>,

    private readonly personService: PersonService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
    private readonly otpService: OtpService,
    private readonly configService: ConfigService,
  ) { }

  /** --------------------- VALIDATE USER --------------------- */
  async validateUser(username: string, pass: string) {
    const user = await this.findByUsername(username);
    if (user && user.password && await bcrypt.compare(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  /** --------------------- LOGIN --------------------- */
  async login(loginDto: LoginDto) {
    const user = await this.findByUsername(loginDto.username);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    if (!user.password) throw new UnauthorizedException('Invalid credentials');

    if (user.status !== "Active") {
      throw new UnauthorizedException("This user has been deactivated. Please contact you administrator for further details")
    }

    const isValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isValid) throw new UnauthorizedException('Invalid credentials');


    return {
      access_token: this.generateAccessToken(user),
      user,
    };
  }

  /** --------------------- CREATE USER --------------------- */
  async create(createUserDto: RegisterDto, userz: User): Promise<User> {
    // Check if user with email or username already exists


    try {
      const existing = await this.userRepository.findOne({
        where: [
          { email: createUserDto.email },
          { username: createUserDto.username },
        ],
      });

      if (existing) {
        throw new BadRequestException('Username or email already exists');
      }

      const existingPhone = await this.userRepository.findOne({
        where: [
          { person: {phoneNumber: createUserDto.phoneNumber }},
        ],
      });
      if(existingPhone) {
        throw new BadRequestException("Phone number is being used by another user")
      }

      // Generate a temporary password if none is provided
      if (!createUserDto.password) {
        createUserDto.password = generateSixCharPassword();
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

      // Create associated Person record
      const person = await this.personService.create(createUserDto);

      //const role = await this.roleRepo.findOne ({where: {id: createUserDto.roleId}})

      // Create the User entity
      const user = this.userRepository.create({
        ...createUserDto,
        role: { id: createUserDto.roleId } as Role,
        person: { id: person.id },
        password: hashedPassword,
      });

      const message = newUser(createUserDto.firstName,
        createUserDto.lastName, createUserDto.username, createUserDto.email, createUserDto.password
      )
      // Save user to database
      const savedUser = await this.userRepository.save(user);

      // Prepare welcome email
      const emailDto: SendEmailDTO = {
        recipient: [savedUser.email],
        subject: 'Welcome to Hohoe Smart City. Your Account Details!',
        title: "New Login Details",
        html: message,
        text: `Welcome, ${person.firstName ?? ''} ${person.lastName ?? ''}!`,
        message: message,
        fromUserId: user.id,
        recipientName: createUserDto.firstName + " " + createUserDto.lastName,
        recipientAddress: createUserDto.email,
        channel: ChannelEnum.EMAIL,
        messageType: 'User Account Registration',


      };

      // Send welcome email
      await this.emailService.sendEmail(emailDto, user);

      return savedUser;
    } catch (error: any) {
      // 🔥 Handle Postgres unique constraint
      if (error instanceof QueryFailedError) {
        
        const driverError: any = (error as any).driverError;

        if (driverError?.code === "23505") {
          if (driverError.detail?.includes("email")) {
            throw new BadRequestException("Email already exists");
          }
          if (driverError.detail?.includes("username")) {
            throw new BadRequestException("Username already exists");
          }

          throw new BadRequestException("User already exists");
        }
      }

      throw new BadRequestException("Failed to create new user : "+error);
    }
  }


  /** --------------------- GET ALL USERS --------------------- */
  async getAll(query: GetUsersDto) {
    const { page, limit, assemblyId, departmentId, roleId, search } = query;

    const qb = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.person', 'person')
      .leftJoinAndSelect('user.role', 'role');

    if (assemblyId) qb.andWhere('person.assemblyId = :assemblyId', { assemblyId: Number(assemblyId) });
    if (departmentId) qb.andWhere('user.departmentId = :departmentId', { departmentId: Number(departmentId) });
    if (roleId) qb.andWhere('role.id = :roleId', { roleId: Number(roleId) });
    if (search) {
      qb.andWhere(
        `(
          user.username ILIKE :search
          OR user.email ILIKE :search
          OR person.firstName ILIKE :search
          OR person.lastName ILIKE :search
          OR CONCAT(person.firstName, ' ', person.lastName) ILIKE :search
        )`,
        { search: `%${search}%` },
      );
    }

    qb.orderBy('user.createdDatetime', 'DESC');

    if (!page || !limit) {
      const data = await qb.getMany();
      return { message: 'User list', total: data.length, data };
    }

    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;

    const [data, total] = await qb.skip(skip).take(limitNumber).getManyAndCount();

    return {
      message: 'User list',
      page: pageNumber,
      limit: limitNumber,
      total,
      totalPages: Math.ceil(total / limitNumber),
      data,
    };
  }

  /** --------------------- FIND ONE USER --------------------- */
  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['person', 'person.image', 'role', 'person.organization'],
    });
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);
    return user;
  }

  /** --------------------- FIND BY USERNAME --------------------- */
  async findByUsername(username: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: [
        { email: username },
        { username: username }
      ],
      relations: ['person', 'person.image', 'person.organization', 'role'],
      select: ['id', 'username', 'email', 'password', 'role', 'person',
         "role", "status", "createdBy", "hasLoggedInBefore", "firstLoginDateTime"
      ]
    });

    return user || null;
  }

  /** --------------------- UPDATE USER --------------------- */
  async updateUser(id: number, dto: UpdateUserRegisterDto) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ["role", "person"],
      select: ['id', 'username', 'email', 'password', 'role', 'person', 
        "role", "status", "createdBy", "password", "hasLoggedInBefore", "firstLoginDateTime"
      ]
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    /* =====================================================
       🔐 PASSWORD UPDATE (SAFE & OPTIONAL)
    ===================================================== */

    if (dto.newPassword) {
      if (!dto.currentPassword) {
        throw new BadRequestException(
          "Current password is required to change password"
        );
      }

      if (!user.password) {
        throw new BadRequestException("User has no password set");
      }

      const isValid = await bcrypt.compare(
        dto.currentPassword,
        user.password
      );

      if (!isValid) {
        throw new UnauthorizedException("Current password is incorrect");
      }

      user.password = await bcrypt.hash(dto.newPassword, 10);
      

    if(user.hasLoggedInBefore !== "Yes"){
      user.hasLoggedInBefore = "Yes"
      user.firstLoginDateTime = new Date().toDateString()
    }
    
    }


    /* =====================================================
       UPDATE RELATIONS
    ===================================================== */

    if (dto.roleId) {
      const role = await this.roleRepo.findOneBy({ id: dto.roleId });
      if (!role) throw new NotFoundException("Role not found");
      user.role = role;
    }

    
    if (dto.personId) {
     
  const person = await this.personRepo.findOneBy({ id: dto.personId });
  if (!person) throw new NotFoundException("Person not found");

  Object.assign(person, {
    firstName: dto.firstName ?? person.firstName,
    lastName: dto.lastName ?? person.lastName,
    phoneNumber: dto.phoneNumber ?? person.phoneNumber,
    email: dto.email ?? person.email,
    updatedBy: dto.updatedBy || "System",
    updatedDatetime: new Date(),
  });

await this.personRepo.save(person); // 🔥 THIS IS THE FIX
  

  user.person = person;
}


    /* =====================================================
       UPDATE SCALAR FIELDS
    ===================================================== */

    
    Object.assign(user, {
      username: dto.username ?? user.username,
      email: dto.email ?? user.email,
      status: dto.status ?? user.status,
      updatedBy: dto.updatedBy,
      person: user.person,
      
    });
   

    return await this.userRepository.save(user);
  }


  /** --------------------- REMOVE USER --------------------- */
  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }

  /** --------------------- TOKEN GENERATORS --------------------- */
  private generateAccessToken(user: User): string {
    return this.jwtService.sign(
      { email: user.email, personId: user.person?.id || null, userId: user.id },
      { secret: process.env.API_SECRET, expiresIn: '1d' },
    );
  }

  private generateRefreshToken(user: User): string {
    return this.jwtService.sign(
      { userId: user.id },
      { secret: `refresh0909${process.env.API_SECRET}`, expiresIn: '1d' },
    );
  }

  /** --------------------- PASSWORD RESET & EMAIL --------------------- */
  async forgotPassword(requestOtp: RequestOtp) {
    const user = await this.userRepository.findOne({ where: { email: requestOtp.email } });
    if (!user) throw new NotFoundException("User not found");
    return await this.emailVerification(user, OTPType.RESET_PASSWORD);
  }

  async resetPassword(dto: ResetPasswordDTO): Promise<{ message: string }> {
    const userId = await this.otpService.validateResetPassword(dto.token);

    const user = await this.userRepository.findOne({
      where: { id: userId }
    });

    if (!user) {
      throw new BadRequestException("User not found");
    }

    // Prevent reusing old password
    if (user.password) {
      const same = await bcrypt.compare(dto.password, user.password);
      if (same) {
        throw new BadRequestException("New password must be different from old password");
      }
    }

    user.password = await bcrypt.hash(dto.password, 10);
    user.hasLoggedInBefore = "No";
    user.firstLoginDateTime = new Date().toString();

    await this.userRepository.save(user);

    // Invalidate OTP after use
    await this.otpRepository.delete({
      user: { id: user.id },
      type: OTPType.RESET_PASSWORD
    });

    return { message: "Password reset successfully" };
  }


  async emailVerification(user: User, type: OTPType) {
    const token = await this.otpService.generateOtp(user, type);

    if (type === OTPType.OTP) {
      const emailDto: SendEmailDTO = {
        recipient: [user.email],
        subject: "OTP for verification",
        html: `Welcome! Enter this OTP: <strong>${token}</strong> (expires in 5 mins)`,
        text: "",
        message: ``
      };
      await this.emailService.sendEmail(emailDto, user);
      return { message: "OTP sent", otp: token };
    }

    if (type === OTPType.RESET_PASSWORD) {
      const resetLink = `${this.configService.get('JWT_RESET_SECRET')}?token=${token}`;
      const emailDto: SendEmailDTO = {
        recipient: [user.email],
        subject: "Password reset link",
        html: ResendMess(user?.person?.firstName,
        user?.person.lastName, user.username, user.email, user.password
      ),
        text: "",
        message: `<a href="${resetLink}">Reset Password</a>`
      };
      await this.emailService.sendEmail(emailDto, user);
      return { message: "Reset link sent", otp: resetLink };
    }
  }

  async findByUserId(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new UnauthorizedException('User not found.');
    }

    const { password, ...result } = user;
    return result;
  }

  async getUsers(filter: GetUserQueryDto) {
    const { assemblyId, roleId } = filter;

    const query = this.userRepository
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.person", "person")
      .leftJoinAndSelect("person.assembly", "assembly")
      .leftJoinAndSelect("user.role", "role")
      .where("user.status = :status", { status: "Active" });

    if (assemblyId) {
      query.andWhere("assembly.id = :assemblyId", { assemblyId });
    }

    if (roleId) {
      query.andWhere("role.id = :roleId", { roleId });
    }

    return await query.getMany();
  }

  async resendResetPassword(dto: ResendResetPasswordDTO) {
    const user = await this.userRepository.findOne({
      where: { email: dto.email }
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    // Optional: Clear old OTPs for security
    await this.otpRepository.delete({
      user: { id: user.id },
      type: OTPType.RESET_PASSWORD
    });

    return await this.emailVerification(user, OTPType.RESET_PASSWORD);
  }

  async resendResetPassword2(dto: ResendResetPasswordDTO, userFrom: User) {
    const user = await this.userRepository.findOne({
      where: { email: dto.email }
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    const newPass = generateSixCharPassword()
    const encryptedPass = await bcrypt.hash(newPass, 10);

    const name = userFrom?.person?.firstName+" "+userFrom?.person?.lastName
    
    await this.userRepository.update(user.id, {
      password: encryptedPass,
      lastResetPasswordBy: name,
      lastResetPasswordDate: new Date(),
      lastResetPasswordById: userFrom.id,
      updatedBy: user.username
    })

    
    const sendZDto: SendEmailDTO = {
      recipient: [user.email],
      subject: 'Password Reset - New Temporary Password',
      title: 'Temporary Password',
      html: ResendMess(
        user?.person?.firstName,
        user?.person?.lastName,
        user.username,
        user.email,
        newPass
      ),
      text: `Your new temporary password is: ${newPass}`,
      message: `Temporary password: ${newPass}`,
      fromUserId: user.id,
      recipientName: `${user?.person?.firstName ?? ''} ${user?.person?.lastName ?? ''}`.trim(),
      recipientAddress: user.email,
      channel: ChannelEnum.EMAIL,
      messageType: 'Password Reset',
    };

    await this.emailService.sendEmail(sendZDto, user);

    return {
      message: "Successfully reset password"
    };
  }

  





}
