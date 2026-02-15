import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MessagesService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/current-user.decorators';
import { User } from 'src/auth/entities/user.entity';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
@ApiOperation({ summary: 'Create a new message' })
@ApiResponse({ status: 201, description: 'Message created' })
create(@Body() dto: CreateMessageDto, @CurrentUser() user: User) {
return this.messagesService.create(dto,  user);
}

@Get()
@ApiOperation({ summary: 'Get all messages' })
findAll() {
return this.messagesService.findAll();
}

@Get(':id')
@ApiOperation({ summary: 'Get message by ID' })
findOne(@Param('id') id: string) {
return this.messagesService.findOne(+id);
}

@Patch(':id')
@ApiOperation({ summary: 'Update message' })
update(@Param('id') id: string, @Body() dto: UpdateMessageDto) {
return this.messagesService.update(+id, dto, 'system');
}

@Patch(':id/read')
@ApiOperation({ summary: 'Mark message as read' })
markAsRead(@Param('id') id: string) {
return this.messagesService.markAsRead(+id);
}

@Delete(':id')
@ApiOperation({ summary: 'Delete message' })
remove(@Param('id') id: string) {
return this.messagesService.remove(+id);
}
}
