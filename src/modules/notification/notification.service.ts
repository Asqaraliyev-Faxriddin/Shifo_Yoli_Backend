import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { FindAllNotificationDto } from './dto/create-notification.dto';
import { CreateNotificationSuperDto, NameDto } from './dto/update-notification.dto';

@Injectable()
export class NotificationService {
  constructor(private prisma: PrismaService) {}

  private  parseBoolean = (val: any) => {
    if (val === "true" || val === true) return true;
    if (val === "false" || val === false) return false;
    return undefined; 
  };

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


  private async  DoctorBySuperadmin(message:string){


    let oldsuperadmin = await this.prisma.user.findMany({
      where:{
        role:"SUPERADMIN"
      }
    })

    if(oldsuperadmin.length === 0){
      
      return []

    }


    for ( let i of oldsuperadmin){
      await this.prisma.userNotification.create({
        data:{
          userId:i.id,
          message:message
        }
      })


    }

    return {
      message:"Qabul qilindi"
    }



  }


  async create(createContactDto: CreateNotificationSuperDto, req: any) {
    const { message:tr,email } = createContactDto;

    let message = "Xabar: " +  tr + "\n" + "Email: " + email

    const ip = req.ip || req.connection.remoteAddress || 'unknown_ip';
    const userAgent = req.headers['user-agent'] || 'unknown_agent';
    const unique = `${ip}_${userAgent}`;

    const lastContact = await this.prisma.contact.findUnique({
      where: { unique },
    });

    if (lastContact) { 
      const now = new Date();
      const diffMs = now.getTime() - lastContact.createdAt.getTime();
      const diffMinutes = Math.floor(diffMs / 1000 / 60);

      if (diffMinutes < 10) {
        throw new BadRequestException(
          `❌ Siz faqat har 10 daqiqada 1 ta so‘rov yubora olasiz. Qolgan vaqt: ${
            10 - diffMinutes
          } daqiqa`,
        );
      }

      const updated = await this.prisma.contact.update({
        where: { unique },
        data: {
          email:"",
          message,
          phone: "",
          createdAt: new Date(),
        },

        select:{
          email:true,
          phone:true,
          message:true,
          createdAt:true,
          updatedAt:true,
          unique:true,
        }
      });

      await this.DoctorBySuperadmin(message);

      

      return {
        success: true,
        message: '✅ Sizning murojaatingiz muvaffaqiyatli yuborildi.',
        data:  updated,
      };
    }

    const created = await this.prisma.contact.create({
      data: {
        email:"",
        message,
        phone: "",
        unique,
      },

      select:{
        email:true,
        phone:true,
        message:true,
        createdAt:true,
        updatedAt:true,
        unique:true,
      }
    });

    await this.DoctorBySuperadmin(message);

    return {
      success: true,
      message: '✅ Sizning murojaatingiz muvaffaqiyatli yuborildi.',
      data: created,
    };
  }


}
