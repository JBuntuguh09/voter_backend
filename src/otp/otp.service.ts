import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Otp } from './entities/otp.entity';
import { MoreThan, Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { OTPType } from 'src/common/enum/enums.enum';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import { User } from 'src/auth/entities/user.entity';
import { Person } from 'src/person/entities/person.entity';

@Injectable()
export class OtpService {
  constructor(
    @InjectRepository(Otp)
    private readonly otpRepository: Repository<Otp>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /* ================= GENERATE OTP ================= */
  async generateOtp(person: Person, type: OTPType): Promise<string> {
    if (type === OTPType.OTP) {
      const otp = crypto.randomInt(100000, 999999).toString();
      const hashedOtp = await bcrypt.hash(otp, 10);

      const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

      const existing = await this.otpRepository.findOne({
        where: { person: { id: person.id }, type },
      });
      if (existing && existing.expiresAt > new Date()) {
        throw new BadRequestException(
          'An OTP has already been sent. Please wait before requesting a new one.',
        );
      }
      if(existing?.repeats && existing.repeats >= 2) {
        throw new BadRequestException(
          'You have exceeded the maximum number of OTP requests. Please contact admin or electoral commission for manual sign up.',
        );
      }

      if (existing) {
        existing.token = hashedOtp;
        existing.expiresAt = expiresAt;
        existing.repeats = (existing.repeats ?? 0) + 1;
        await this.otpRepository.save(existing);
      } else {
        await this.otpRepository.save(
          this.otpRepository.create({
            person,
            token: hashedOtp,
            type,
            expiresAt,
          }),
        );
      }

      return otp;
    }

    if (type === OTPType.RESET_PASSWORD) {
      return this.jwtService.sign(
        { id: person.id, email: person.email },
        {
          secret: this.configService.get<string>('JWT_RESET_SECRET'),
          expiresIn: '15m',
        },
      );
    }

    throw new BadRequestException('Invalid OTP type');
  }

  /* ================= VALIDATE OTP ================= */
  async validateOtp(
    personId: number,
    token: string,
    type: OTPType = OTPType.OTP,
  ): Promise<boolean> {
    const validToken = await this.otpRepository.findOne({
      where: {
        person: { id: personId },
        type,
        expiresAt: MoreThan(new Date()),
      },
    });

    if (!validToken) {
      throw new BadRequestException(
        'OTP has expired. Request a new one.',
      );
    }

    const matches = await bcrypt.compare(token, validToken.token);

    if (!matches) {
      throw new BadRequestException('Invalid OTP. Please try again.');
    }

    return true;
  }

  /* ================= RESET TOKEN ================= */
  async validateResetPassword(token: string): Promise<number> {
    try {
      const decoded = await this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_RESET_SECRET'),
      });

      return decoded.id;
    } catch (error: any) {
      if (error?.name === 'TokenExpiredError') {
        throw new BadRequestException(
          'Reset token expired. Request a new one.',
        );
      }

      throw new BadRequestException('Invalid reset token.');
    }
  }

  /* ================= DELETE OTP ================= */
  async deleteByUserId(userId: number): Promise<string> {
    await this.otpRepository.delete({
      person: { id: userId },
    });

    return `Successfully deleted OTP(s) for user ${userId}`;
  }
}
