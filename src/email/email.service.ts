import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer'
import { ConfigService } from '@nestjs/config';
// import { Resend } from 'resend';
import sgMail from '@sendgrid/mail';
import { MessagesService } from 'src/message/message.service';
import { User } from 'src/auth/entities/user.entity';
import { SendEmailDTO } from './dto/create-email.dto';

@Injectable()
export class EmailService {
    //private resend: Resend;

    constructor(private readonly configService: ConfigService,
        private readonly messageService: MessagesService,
    ) {

        const apiKey = this.configService.get<string>('SENDGRID_API_KEY');
        if (!apiKey) {
            throw new Error('SENDGRID_API_KEY missing in environment variables');
        }
        // this.resend = new Resend(apiKey); 
        //     sgMail.setApiKey(this.configService.get<string>('SENDGRID_API_KEY') || '');



    }
    emailTransport() {

        const transporter = nodemailer.createTransport({
            host: this.configService.get<string>('MAIL_HOST'),
            port: this.configService.get<string>('MAIL_PORT'),
            secure: false, //this.configService.get<number>('EMAIL_PORT')==587,
            auth: {
                user: this.configService.get<string>('MAIL_USER'),
                pass: this.configService.get<string>('MAIL_PASS'),
            },
            connectionTimeout: 10_000,
            greetingTimeout: 10_000,
            socketTimeout: 10_000,
        })
        return transporter
    }

    async sendEmail(dto: SendEmailDTO, user: User) {
        const { recipient, subject, html } = dto
        const transport = this.emailTransport()

        const options: nodemailer.SendMailOptions = {
            from: this.configService.get<string>('EMAIL_USER'),
            to: recipient,
            subject: subject,
            html: html,
        };
        try {
            await transport.sendMail(options)
            dto.messageStatus = "Successful"
            await this.messageService.create(dto, user)
            return "Successfully sent OTP. Please check your email"
        } catch (error) {
            dto.messageStatus = "Failed"
           // dto.details = error.toString()
            await this.messageService.create(dto, user)
            return "Error sending mail : " + error
        }

    }
}
