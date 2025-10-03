import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CreateMessageDto, MessageType } from './dto/create-message.dto';

@Injectable()
export class MessageService {
  constructor(private prisma: PrismaService) {}

  /**
   * --- Chat yaratish ---
   * Agar chat mavjud bo'lmasa, 2 yoki undan ortiq userlar uchun yangi chat yaratadi
   */
  async createChat(participantIds: string[]) {
    const uniqueIds = Array.from(new Set(participantIds));
    console.log('[createChat] Participants:', uniqueIds);

    const chat = await this.prisma.chat.create({
      data: {
        participants: {
          create: uniqueIds.map((id) => ({ userId: id })),
        },
      },
      include: { participants: { include: { user: true } } },
    });

    console.log('[createChat] New chat created:', chat.id);
    return chat;
  }

  /**
   * --- User uchun barcha chatlarni olish ---
   * Oxirgi xabar bilan birga
   */
  async getChatsForUser(userId: string) {
    console.log('[getChatsForUser] Fetching chats for user:', userId);

    const chats = await this.prisma.chat.findMany({
      where: { participants: { some: { userId } } },
      include: {
        participants: { include: { user: true } },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          include: { sender: true },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    console.log(`[getChatsForUser] Found ${chats.length} chats`);
    return chats;
  }

  /**
   * --- Xabar yaratish / yuborish ---
   * Agar chat mavjud bo'lmasa, receiverId orqali yangi chat yaratadi
   */
  async createMessage(senderId: string, dto: CreateMessageDto) {
    console.log('[createMessage] Sender:', senderId, 'DTO:', dto);
    let chatId = dto.chatId;

    // Chat mavjud bo'lmasa, receiverId orqali yangi chat yaratish
    if (!chatId && dto.receiverId) {
      console.log('[createMessage] Checking existing chat between:', senderId, dto.receiverId);
      const existingChat = await this.findChatBetweenUsers(senderId, dto.receiverId);
      if (existingChat) {
        console.log('[createMessage] Existing chat found:', existingChat.id);
        chatId = existingChat.id;
      } else {
        console.log('[createMessage] No chat found. Creating new chat...');
        const newChat = await this.createChat([senderId, dto.receiverId]);
        chatId = newChat.id;
      }
    }

    if (!chatId) {
      console.error('[createMessage] Chat not found!');
      throw new NotFoundException('Chat not found');
    }

    const message = await this.prisma.message.create({
      data: {
        chatId,
        senderId,
        message: dto.message,
        type: dto.type ?? MessageType.TEXT,
      },
      include: { sender: true, chat: true },
    });

    console.log('[createMessage] New message created:', message.id);

    // Chatning oxirgi faolligini yangilash
    await this.prisma.chat.update({
      where: { id: chatId },
      data: { updatedAt: new Date() },
    });

    return { chatId, message };
  }

  /** --- Barcha xabarlarni olish --- */
  async getMessages(chatId: string) {
    console.log('[getMessages] Chat:', chatId);

    const messages = await this.prisma.message.findMany({
      where: { chatId },
      include: { sender: true },
      orderBy: { createdAt: 'asc' },
    });

    console.log(`[getMessages] Found ${messages.length} messages`);
    return messages;
  }

  /** --- Ikki foydalanuvchi orasidagi chatni topish --- */
  async findChatBetweenUsers(user1: string, user2: string) {
    console.log('[findChatBetweenUsers] Checking chat between:', user1, 'and', user2);

    const chat = await this.prisma.chat.findFirst({
      where: {
        AND: [
          { participants: { some: { userId: user1 } } },
          { participants: { some: { userId: user2 } } },
        ],
      },
      include: { participants: true },
    });

    if (chat) {
      console.log('[findChatBetweenUsers] Chat found:', chat.id);
    } else {
      console.log('[findChatBetweenUsers] No chat found');
    }

    return chat;
  }

  /** --- Foydalanuvchini online qilish --- */
  async setUserOnline(userId: string) {
    console.log('[setUserOnline] User online:', userId);

    await this.prisma.user.update({
      where: { id: userId },
      data: { isOnline: true },
    });
  }

  /** --- Foydalanuvchini offline qilish va lastSeen saqlash --- */
  async setUserOffline(userId: string) {
    console.log('[setUserOffline] User offline:', userId);

    await this.prisma.user.update({
      where: { id: userId },
      data: { isOnline: false, lastSeen: new Date() },
    });
  }

  /** --- User statusini olish --- */
  async getUserStatus(userId: string) {
    console.log('[getUserStatus] Fetching status for user:', userId);

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { isOnline: true, lastSeen: true },
    });

    if (!user) {
      console.error('[getUserStatus] User not found:', userId);
      throw new NotFoundException('User not found');
    }

    return user;
  }

  /** --- User uchun xabarni o'qildi deb belgilash --- */
  async markMessagesRead(chatId: string, userId: string) {
    console.log('[markMessagesRead] Marking messages as read in chat:', chatId, 'for user:', userId);

    const result = await this.prisma.message.updateMany({
      where: { chatId, senderId: { not: userId }, isRead: false },
      data: { isRead: true },
    });

    console.log('[markMessagesRead] Updated messages:', result.count);
  }

  /** --- User uchun unread xabarlar soni --- */
  async getUnreadCount(chatId: string, userId: string) {
    console.log('[getUnreadCount] Counting unread messages for user:', userId, 'in chat:', chatId);

    const count = await this.prisma.message.count({
      where: { chatId, senderId: { not: userId }, isRead: false },
    });

    console.log('[getUnreadCount] Unread messages:', count);
    return count;
  }

  /** --- Barcha foydalanuvchilar ro'yxati --- */
  async getAllUsers() {
    console.log('[getAllUsers] Fetching all users');

    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        profileImg: true,
        isOnline: true,
        lastSeen: true,
      },
      orderBy: { firstName: 'asc' },
    });

    console.log('[getAllUsers] Found users:', users.length);
    return users;
  }
}
