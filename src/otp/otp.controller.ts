// otp.controller.ts

import { Body, Controller, Post, Delete, Param } from '@nestjs/common';
import { OtpService } from './otp.service';
import { OTPType } from 'src/common/enum/enums.enum';

@Controller('otp')
export class OtpController {
  constructor(private readonly otpService: OtpService) {}

  /* Example: generate OTP */
  @Post('generate')
  async generateOtp(
    @Body() body: { user: any; type: OTPType },
  ) {
    return this.otpService.generateOtp(body.user, body.type);
  }

  /* Example: validate OTP */
  @Post('validate')
  async validateOtp(
    @Body() body: { personId: number; token: string },
  ) {
    const valid = await this.otpService.validateOtp(
      body.personId,
      body.token,
    );

    return { valid };
  }

  /* Delete user OTPs */
  @Delete(':userId')
  async deleteOtp(@Param('userId') userId: number) {
    return this.otpService.deleteByUserId(userId);
  }
}
