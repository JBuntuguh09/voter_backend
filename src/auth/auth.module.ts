import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Person } from 'src/person/entities/person.entity';
import { Organization } from 'src/organization/entities/organization.entity';
import { Otp } from 'src/otp/entities/otp.entity';
import { Role } from 'src/role/entities/role.entity';
import { Message } from 'src/message/entities/message.entity';
import { Candidate } from 'src/candidates/entities/candidate.entity';
import { PassportModule } from '@nestjs/passport';
import { PersonModule } from 'src/person/person.module';
import { OtpModule } from 'src/otp/otp.module';
import { EmailModule } from 'src/email/email.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/common/strategies/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Person, Organization, Otp, Role, Message, Candidate]),
    PassportModule,
    PersonModule,
    OtpModule,
    EmailModule,

    //configure jwt
    JwtModule.register({})
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports:[AuthService]
})
export class AuthModule {}
