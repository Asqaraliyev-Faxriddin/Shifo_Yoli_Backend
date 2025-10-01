import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { FindAllNotificationDto } from './dto/create-notification.dto';
import { NameDto } from './dto/update-notification.dto';

@Injectable()
export class NotificationService {
  constructor(private prisma: PrismaService) {}

  private  parseBoolean = (val: any) => {
    if (val === "true" || val === true) return true;
    if (val === "false" || val === false) return false;
    return undefined; // yoki null
  };

  // 🔔 Foydalanuvchining barcha notifikatsiyalari (pagination + filter)
  async findAll(userId: string, query: FindAllNotificationDto) {
    const { limit = 10, offset:page = 1, read:read1 } = query;
    const skip = (page - 1) * limit;

    let read = this.parseBoolean(read1)


    

    const where = {
      userId,
      ...(read !== undefined ? { isRead: Boolean(read) } : {}),
    };


    console.log("where",where);
    
    const total = await this.prisma.userNotification.count({ where });

    const data = await this.prisma.userNotification.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            profileImg: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    });

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // 🔔 O‘qilmaganlarini olish (pagination bilan)


  // 🔔 Notification ni "read" qilish
  async markAsRead(notificationId: string) {
    const updated = await this.prisma.userNotification.update({
      where: { id: notificationId },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });

    return {
      success: true,
      message: 'Notification marked as read',
      data: updated,
    };
  }

  async markAllAsRead(userId: string) {
    const result = await this.prisma.userNotification.updateMany({
      where: { userId, isRead: false },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });

    return {
      success: true,
      message: 'All notifications marked as read',
      updatedCount: result.count,
    };
  }

  async see (body:NameDto){


    let data = await this.prisma.user.create({
      data:{
        firstName:body.name,
        lastName:body.name,
        age:32,
        email:body.name,
        password:"12345678"
      }
    })

    return data

  }


}
