import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { CreateMessageDto, } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { User } from 'src/auth/entities/user.entity';
import { Organization } from 'src/organization/entities/organization.entity';
import axios from "axios";
import { Person } from 'src/person/entities/person.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepo: Repository<Message>,

    @InjectRepository(Organization)
    private readonly assemblyRepo: Repository<Organization>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) { }

  private readonly baseUrl = "https://sms.arkesel.com/api/v2/sms/send";

  // ⚠️ move to .env
  private readonly apiKey = process.env.ARKESAL_API_KEY;

  async create(dto: CreateMessageDto, user: User) {

    const message = this.messageRepo.create({
      ...dto,
      fromUser: { id: dto.fromUserId },
      organization: { id: dto.assemblyId },
      createdBy: user?.username,
    });


    const savedMessage = await this.messageRepo.save(message);



    return savedMessage;
  }

  async findAll() {
    return this.messageRepo.find({ relations: ['fromUser', 'assembly'], order: { createdDatetime: 'DESC' } });
  }

  async findOne(id: number) {
    const message = await this.messageRepo.findOne({ where: { id }, relations: ['fromUser', 'assembly'] });
    if (!message) throw new NotFoundException('Message not found');
    return message;
  }

  async update(id: number, dto: UpdateMessageDto, updatedBy: string) {
    const message = await this.findOne(id);
    Object.assign(message, dto, { updatedBy });
    return this.messageRepo.save(message);
  }

  async remove(id: number) {
    const message = await this.findOne(id);
    return this.messageRepo.remove(message);
  }

  async markAsRead(id: number) {
    const message = await this.findOne(id);
    message.isRead = true;
    message.readAt = new Date();
    message.messageStatus = 'Read';
    return this.messageRepo.save(message);
  }


  /* ================= SEND SMS ================= */
  async sendSms(
    phone: number | string,
    person: Person,
    message = "Welcome to IMMILAC Aflao. Please enjoy the experience."
  ) {
    try {
      const formattedPhone = this.formatPhone(phone);

      const data = {
        sender: "IMM-AFLAO",
        message,
        recipients: [formattedPhone],
      };
      const baseUrl = `https://sms.arkesel.com/sms/api?action=send-sms&api_key=${this.apiKey}&to=${phone}&from=SenderID&sms=${message}`
      const response = await axios.get(baseUrl,)

      return {
        success: true,
        data: response.data,
        person: person
      };
    } catch (error: any) {
      console.log(error)
      console.error("SMS ERROR:", error?.response?.data || error.message);

      throw new InternalServerErrorException(
        "Failed to send SMS",
      );
    }
  }

  /* ================= SCHEDULE SMS ================= */
  async scheduleSms(
    phone: number | string,
    message: string,
    scheduledDate: string, // "2026-02-20 07:00 AM"
  ) {
    try {
      const data = {
        sender: "Hello world",
        message,
        recipients: [this.formatPhone(phone)],
        scheduled_date: scheduledDate,
      };

      const response = await axios.post(this.baseUrl, data, {
        headers: { "api-key": this.apiKey },
      });

      return response.data;
    } catch (error: any) {
      throw new InternalServerErrorException(
        error?.response?.data || "Failed to schedule SMS",
      );
    }
  }

  /* ================= WEBHOOK SMS ================= */
  async sendSmsWithWebhook(
    phone: number | string,
    message: string,
    callbackUrl: string,
  ) {
    try {
      const data = {
        sender: "Hello world",
        message,
        recipients: [this.formatPhone(phone)],
        callback_url: callbackUrl,
      };

      const response = await axios.post(this.baseUrl, data, {
        headers: { "api-key": this.apiKey },
      });

      return response.data;
    } catch (error: any) {
      throw new InternalServerErrorException(
        error?.response?.data || "Failed to send SMS",
      );
    }
  }

  /* ================= FORMAT PHONE ================= */
  private formatPhone(phone: string | number): string {
    let p = String(phone).trim();

    // convert 055xxxx → 23355xxxx
    if (p.startsWith("0")) {
      p = "233" + p.substring(1);
    }

    return p;
  }


}