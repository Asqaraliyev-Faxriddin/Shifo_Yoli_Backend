import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CreateMeetingDto, UpdateMeetingDto } from './dto/create-meeting.dto';
import * as crypto from 'crypto';

@Injectable()
export class MeetingService {
  constructor(private prisma: PrismaService) {}

  // ✅ Yangi meeting yaratish
  async create(dto: CreateMeetingDto) {
    const meeting = await this.prisma.meeting.create({
      data: {
        userId: dto.userId,
        doctorId: dto.doctorId,
        scheduledAt: dto.scheduledAt,
        duration: dto.duration,
        meetingLink: `https://myapp.com/meet/${crypto.randomUUID()}`, // avtomatik link
      },
      include: {
        user: true,
        doctor: true,
      },
    });

    return {
      success: true,
      message: 'Uchrashuv muvaffaqiyatli yaratildi',
      data: meeting,
    };
  }

  // ✅ Barcha meetinglarni olish
  async findAll() {
    const meetings = await this.prisma.meeting.findMany({
      include: {
        user: true,
        doctor: true,
        messages: {
          include: {
            sender: { select: { id: true, firstName: true, lastName: true } },
          },
        },
      },
    });

    return {
      success: true,
      message: 'Barcha uchrashuvlar ro‘yxati',
      data: meetings,
    };
  }

  async findOne(id: string) {
    const meeting = await this.prisma.meeting.findUnique({
      where: { id },
      include: {
        user: true,
        doctor: true,
        messages: { include: { sender: true } },
      },
    });

    if (!meeting) {
      throw new NotFoundException({
        success: false,
        message: 'Uchrashuv topilmadi',
      });
    }

    return {
      success: true,
      message: 'Uchrashuv topildi',
      data: meeting,
    };
  }

  async update(id: string, dto: UpdateMeetingDto) {
    const exists = await this.prisma.meeting.findUnique({ where: { id } });
    if (!exists) {
      throw new NotFoundException({
        success: false,
        message: 'Yangilanish uchun uchrashuv topilmadi',
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

  async remove(id: string) {
    const exists = await this.prisma.meeting.findUnique({ where: { id } });
    if (!exists) {
      throw new NotFoundException({
        success: false,
        message: 'O‘chirish uchun uchrashuv topilmadi',
      });
    }

    await this.prisma.meeting.delete({ where: { id } });

    return {
      success: true,
      message: 'Uchrashuv muvaffaqiyatli o‘chirildi',
    };
  }

  async sendMessage(meetingId: string, senderId: string, content: string) {
    const meeting = await this.prisma.meeting.findUnique({
      where: { id: meetingId },
    });
    if (!meeting) {
      throw new NotFoundException({
        success: false,
        message: 'Xabar yuborish uchun uchrashuv topilmadi',
      });
    }

    const message = await this.prisma.meetingMessage.create({
      data: { meetingId, senderId, content },
      include: { sender: true },
    });

    return {
      success: true,
      message: 'Xabar muvaffaqiyatli yuborildi',
      data: message,
    };
  }
}
