import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CreateMeetingDto, UpdateMeetingDto, SendMessageDto } from './dto/create-meeting.dto';
import * as crypto from 'crypto';

@Injectable()
export class MeetingService {
  constructor(private prisma: PrismaService) {}

  // ✅ Yangi meeting yaratish
  async create(dto: CreateMeetingDto, currentUserId: string) {
    const meeting = await this.prisma.meeting.create({
      data: {
        userId: currentUserId, // token orqali keladi
        doctorId: dto.targetId, // kimga qo‘ng‘iroq qilinmoqda
        scheduledAt: dto.scheduledAt,
        duration: dto.duration,
        meetingLink: `https://google-github/meet/${crypto.randomUUID()}`, // avtomatik link
      },
      include: { user: true, doctor: true },
    });

    return {
      success: true,
      message: 'Uchrashuv muvaffaqiyatli yaratildi',
      data: meeting,
    };
  }

  // ✅ Oddiy user uchun – faqat o‘zining meetinglari
  async findAllForUser(userId: string) {
    const meetings = await this.prisma.meeting.findMany({
      where: { userId },
      include: {
        user: true,
        doctor: true,
        messages: {
          include: { sender: { select: { id: true, firstName: true, lastName: true } } },
        },
      },
    });

    return {
      success: true,
      message: 'Foydalanuvchining uchrashuvlari',
      data: meetings,
    };
  }

  // ✅ Admin/Superadmin uchun – barcha meetinglar
  async findAllForAdmin() {
    const meetings = await this.prisma.meeting.findMany({
      include: {
        user: true,
        doctor: true,
        messages: {
          include: { sender: { select: { id: true, firstName: true, lastName: true } } },
        },
      },
    });

    return {
      success: true,
      message: 'Barcha uchrashuvlar ro‘yxati',
      data: meetings,
    };
  }

  // ✅ Bitta meetingni olish
  async findOne(id: string, currentUserId: string, isSuperAdmin = false) {
    const meeting = await this.prisma.meeting.findUnique({
      where: { id },
      include: { user: true, doctor: true, messages: { include: { sender: true } } },
    });

    if (!meeting) {
      throw new NotFoundException({
        success: false,
        message: 'Uchrashuv topilmadi',
      });
    }

    if (!isSuperAdmin && meeting.userId !== currentUserId) {
      throw new ForbiddenException({
        success: false,
        message: 'Bu uchrashuvga ruxsatingiz yo‘q',
      });
    }

    return {
      success: true,
      message: 'Uchrashuv topildi',
      data: meeting,
    };
  }

  // ✅ Yangilash
  async update(id: string, dto: UpdateMeetingDto, currentUserId: string, isSuperAdmin = false) {
    const meeting = await this.prisma.meeting.findUnique({ where: { id } });
    if (!meeting) {
      throw new NotFoundException({
        success: false,
        message: 'Yangilash uchun uchrashuv topilmadi',
      });
    }

    if (!isSuperAdmin && meeting.userId !== currentUserId) {
      throw new ForbiddenException({
        success: false,
        message: 'Bu uchrashuvni yangilashga ruxsatingiz yo‘q',
      });
    }

    const updated = await this.prisma.meeting.update({
      where: { id },
      data: { ...dto },
      include: { user: true, doctor: true },
    });

    return {
      success: true,
      message: 'Uchrashuv muvaffaqiyatli yangilandi',
      data: updated,
    };
  }

  // ✅ O‘chirish – user faqat o‘zining uchrashuvini, superadmin esa hammani o‘chira oladi
  async remove(id: string, currentUserId: string, isSuperAdmin = false) {
    const meeting = await this.prisma.meeting.findUnique({ where: { id } });
    if (!meeting) {
      throw new NotFoundException({
        success: false,
        message: 'O‘chirish uchun uchrashuv topilmadi',
      });
    }

    if (!isSuperAdmin && meeting.userId !== currentUserId) {
      throw new ForbiddenException({
        success: false,
        message: 'Bu uchrashuvni o‘chirishga ruxsatingiz yo‘q',
      });
    }

    await this.prisma.meeting.delete({ where: { id } });

    return {
      success: true,
      message: 'Uchrashuv muvaffaqiyatli o‘chirildi',
    };
  }

  // ✅ Xabar yuborish
  async sendMessage(dto: SendMessageDto, currentUserId: string) {
    const meeting = await this.prisma.meeting.findUnique({ where: { id: dto.meetingId } });
    if (!meeting) {
      throw new NotFoundException({
        success: false,
        message: 'Xabar yuborish uchun uchrashuv topilmadi',
      });
    }

    const message = await this.prisma.meetingMessage.create({
      data: {
        meetingId: dto.meetingId,
        senderId: currentUserId, // token orqali keladi
        content: dto.content,
        type: dto.type,
      },
      include: { sender: true },
    });

    return {
      success: true,
      message: 'Xabar muvaffaqiyatli yuborildi',
      data: message,
    };
  }
}
