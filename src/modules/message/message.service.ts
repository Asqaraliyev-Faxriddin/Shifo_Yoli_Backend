// src/messages/message.service.ts
import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import {
  SendMessageDto,
  MessageType,
  CreateChatDto,
  UpdateMessageDto,
  DeleteMessageDto,
  ReadMessageDto,
  GetMessagesDto,
  GetChatsDto,
} from './dto/create-message.dto';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuid } from 'uuid';

@Injectable()
export class MessageService {
  constructor(private prisma: PrismaService) {}

  /**
   * 🔹 Chat yaratish yoki mavjudini olish
   */
  async createChat(senderId: string, dto: CreateChatDto) {
    const { receiverId } = dto;
    if (senderId === receiverId)
      throw new BadRequestException('Siz o‘zingiz bilan chat ocholmaysiz.');

    // Foydalanuvchilarni tekshiramiz
    const [sender, receiver] = await Promise.all([
      this.prisma.user.findUnique({ where: { id: senderId } }),
      this.prisma.user.findUnique({ where: { id: receiverId } }),
    ]);

    if (!sender) throw new NotFoundException('Foydalanuvchi topilmadi.');
    if (!receiver) throw new NotFoundException('Qabul qiluvchi topilmadi.');

    // Bemor → doktor uchun to‘lovni tekshiramiz
    if (sender.role === 'BEMOR' && receiver.role === 'DOCTOR') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const access = await this.prisma.dailyDoctorAccess.findUnique({
        where: {
          patientId_doctorId_date: {
            patientId: senderId,
            doctorId: receiverId,
            date: today,
          },
        },
      });
      if (!access)
        throw new ForbiddenException(
          'Bugun ushbu doktorga to‘lov qilmagansiz. Suhbatni boshlashdan oldin to‘lovni amalga oshiring.',
        );
    }

    // Mavjud chatni tekshiramiz
    const existing = await this.prisma.chat.findFirst({
      where: {
        participants: {
          some: { userId: senderId },
        },
        AND: {
          participants: {
            some: { userId: receiverId },
          },
        },
      },
    });

    if (existing)
      return { message: 'Chat allaqachon mavjud.', chatId: existing.id };

    const newChat = await this.prisma.chat.create({
      data: {
        participants: {
          createMany: {
            data: [
              { userId: senderId },
              { userId: receiverId },
            ],
          },
        },
      },
    });

    return { message: 'Chat yaratildi.', chatId: newChat.id };
  }

  /**
   * 🔹 Faylni saqlash yordamchi funksiyasi
   */
  private async saveFile(file: Express.Multer.File): Promise<string> {
    const uploadDir = path.join(process.cwd(), 'uploads', 'chat');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    const ext = path.extname(file.originalname);
    const fileName = `${uuid()}${ext}`;
    const filePath = path.join(uploadDir, fileName);
    fs.writeFileSync(filePath, file.buffer);

    // URL sifatida saqlanadigan yo‘l
    return `/uploads/chat/${fileName}`;
  }

  /**
   * 🔹 Xabar yuborish
   */
  async sendMessage(senderId: string,dto: SendMessageDto,file?: Express.Multer.File,) {
    const { chatId, receiverId, message, type } = dto;
    let chat;

    // 1️⃣ Chatni aniqlaymiz
    if (chatId) {
      chat = await this.prisma.chat.findUnique({
        where: { id: chatId },
        include: { participants: true },
      });

      if (!chat) throw new NotFoundException('Chat topilmadi.');
      if (!chat.participants.some((p) => p.userId === senderId))
        throw new ForbiddenException('Bu chatda yozish huquqiga ega emassiz.');
    }

    // 2️⃣ Chat bo‘lmasa — yangi yaratiladi
    if (!chat && receiverId) {
      const res = await this.createChat(senderId, { receiverId });
      chat = await this.prisma.chat.findUnique({
        where: { id: res.chatId },
        include: { participants: true },
      });
    }

    if (!chat)
      throw new BadRequestException(
        'Chat aniqlanmadi. chatId yoki receiverId yuboring.',
      );

    // 3️⃣ Foydalanuvchi rollarini aniqlaymiz
    const receiverUserId = chat.participants.find(
      (p) => p.userId !== senderId,
    )?.userId;

    const [sender, receiver] = await Promise.all([
      this.prisma.user.findUnique({ where: { id: senderId } }),
      this.prisma.user.findUnique({ where: { id: receiverUserId } }),
    ]);

    if (!sender || !receiver)
      throw new NotFoundException('Foydalanuvchi topilmadi.');

    // 4️⃣ Agar bemor → doktor bo‘lsa, to‘lovni tekshiramiz
    if (sender.role === 'BEMOR' && receiver.role === 'DOCTOR') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const access = await this.prisma.dailyDoctorAccess.findUnique({
        where: {
          patientId_doctorId_date: {
            patientId: senderId,
            doctorId: receiverUserId,
            date: today,
          },
        },
      });
      if (!access)
        throw new ForbiddenException(
          'Bugungi kun uchun ushbu doktorga to‘lov qilmagansiz.',
        );
    }

    // 5️⃣ Faylni saqlaymiz (agar mavjud bo‘lsa)
    let finalMessage = message;
    let fileUrl: string | null = null;

    if (file && (type === MessageType.FILE || type === MessageType.VIDEO)) {
      fileUrl = await this.saveFile(file);
      finalMessage = fileUrl; // xabar mazmuni sifatida file yo‘li saqlanadi
    }

    // 6️⃣ Xabarni yaratamiz
    const newMsg = await this.prisma.message.create({
      data: {
        chatId: chat.id,
        senderId,
        message: finalMessage,
        type: type ?? MessageType.TEXT,
        ...(fileUrl && { fileUrl }),
      },
    });

    return { message: 'Xabar yuborildi.', data: newMsg };
  }

  /** 🔹 Xabar yangilash */
  async updateMessage(userId: string, dto: UpdateMessageDto) {
    const msg = await this.prisma.message.findUnique({
      where: { id: dto.messageId },
    });
    if (!msg) throw new NotFoundException('Xabar topilmadi.');
    if (msg.senderId !== userId)
      throw new ForbiddenException('Bu xabarni tahrirlash huquqiga ega emassiz.');

    const updated = await this.prisma.message.update({
      where: { id: dto.messageId },
      data: { message: dto.newText },
    });

    return { message: 'Xabar yangilandi.', data: updated };
  }

  /** 🔹 Xabar o‘chirish */
  async deleteMessage(userId: string, dto: DeleteMessageDto) {
    const msg = await this.prisma.message.findUnique({
      where: { id: dto.messageId },
    });
    if (!msg) throw new NotFoundException('Xabar topilmadi.');
    if (msg.senderId !== userId)
      throw new ForbiddenException('Bu xabarni o‘chirish huquqiga ega emassiz.');

    await this.prisma.message.delete({ where: { id: dto.messageId } });
    return { message: 'Xabar o‘chirildi.' };
  }

  async readMessages(userId: string, dto: ReadMessageDto) {
    const chat = await this.prisma.chat.findUnique({
      where: { id: dto.chatId },
      include: { participants: true },
    });

    if (!chat) throw new NotFoundException('Chat topilmadi.');
    if (!chat.participants.some((p) => p.userId === userId))
      throw new ForbiddenException('Siz bu chatda ishtirok etmagansiz.');

    await this.prisma.message.updateMany({
      where: { chatId: dto.chatId, senderId: { not: userId } },
      data: { isRead: true },
    });

    return { message: 'Xabarlar o‘qilgan deb belgilandi.' };
  }

  async getMessages(userId: string, dto: GetMessagesDto) {
    const { chatId, page = 1, limit = 30 } = dto;

    const chat = await this.prisma.chat.findUnique({
      where: { id: chatId },
      include: { participants: true },
    });

    if (!chat) throw new NotFoundException('Chat topilmadi.');
    if (!chat.participants.some((p) => p.userId === userId))
      throw new ForbiddenException('Siz bu chatga kira olmaysiz.');

    const messages = await this.prisma.message.findMany({
      where: { chatId },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      message: 'Xabarlar olindi.',
      total: messages.length,
      data: messages.reverse(),
    };
  }

  async getChats(userId: string, dto: GetChatsDto) {
    const { participantId, page = 1, limit = 20 } = dto;

    const chats = await this.prisma.chat.findMany({
      where: {
        participants: {
          some: { userId },
        },
        ...(participantId && {
          participants: { some: { userId: participantId } },
        }),
      },
      include: {
        participants: { include: { user: true } },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { updatedAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      message: 'Chatlar olindi.',
      total: chats.length,
      data: chats,
    };
  }

}