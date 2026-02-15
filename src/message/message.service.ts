import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { CreateMessageDto, } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { User } from 'src/auth/entities/user.entity';
import { Organization } from 'src/organization/entities/organization.entity';

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

  
}