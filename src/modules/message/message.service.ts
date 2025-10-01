import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class MessageService {
  constructor(private prisma: PrismaService) {}

  // Chat yaratish (agar 2ta user o‘rtasida chat bo‘lmasa)
  async createChat(participantIds: string[]) {
    const chat = await this.prisma.chat.create({
      data: {
        participants: {
          create: participantIds.map((id) => ({ userId: id })),
        },
      },
      include: { participants: { include: { user: true } } },
    });
    return chat;
  }

  // Foydalanuvchining chatlari
  async getChatsForUser(userId: string) {
    return this.prisma.chat.findMany({
      where: { participants: { some: { userId } } },
      include: {
        participants: { include: { user: true } },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1, // faqat oxirgi message
        },
      },
    });
  }

  // Xabar yuborish
  async createMessage(senderId: string, dto: CreateMessageDto) {
    let chatId = dto.chatId;

    if (!chatId && dto.receiverId) {
      // agar chatId bo‘lmasa va receiverId bo‘lsa — yangi chat yaratish
      const newChat = await this.createChat([senderId, dto.receiverId]);
      chatId = newChat.id;
    }

    if (!chatId) throw new NotFoundException('Chat not found');

    const message = await this.prisma.message.create({
      data: {
        chatId,
        senderId,
        message: dto.message,
        type: dto.type ?? 'TEXT',
      },
      include: { sender: true },
    });

    return { chatId, message };
  }

  async getMessages(chatId: string) {
    return this.prisma.message.findMany({
      where: { chatId },
      include: { sender: true },
      orderBy: { createdAt: 'asc' },
    });
  }


  // MessageService ichida
async findChatBetweenUsers(user1: string, user2: string) {
  return this.prisma.chat.findFirst({
    where: {
      participants: {
        every: {
          userId: { in: [user1, user2] },
        },
      },
    },
  });
}

}
