import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EmailService } from './email.service';
import { CreateEmailDto, SendEmailDTO } from './dto/create-email.dto';
import { UpdateEmailDto } from './dto/update-email.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorators';
import { User } from 'src/auth/entities/user.entity';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post()
  async sendEmail(@Body() emailData: SendEmailDTO, @CurrentUser() user: User) {
    return this.emailService.sendEmail(emailData, user);
  }
}
