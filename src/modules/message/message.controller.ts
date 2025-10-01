import { Controller, Get, Post, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto,CreateChatDto } from './dto/create-message.dto';
import { Request } from 'express';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';

@Controller('messages')
export class MessageController {
  constructor(private readonly svc: MessageService,private prisma:PrismaService) {}


  @UseGuards(AuthGuard)
  @Get('/chats')
  async getChats(@Req() req) {
    return this.svc.getChatsForUser(req.user.id);
  }

  @Post('/chat')
  async createChat(@Body() dto: CreateChatDto) {
    return this.svc.createChat(dto.participantIds);
  }

  @Get('/chat/:chatId/messages')
  async getMessages(@Param('chatId') chatId: string) {
    return this.svc.getMessages(chatId);
  }

  @UseGuards(AuthGuard)
  @Post('/send')
  async sendMessage(@Req() req, @Body() dto: CreateMessageDto) {
    return this.svc.createMessage(req.user.id, dto);
  }
}
