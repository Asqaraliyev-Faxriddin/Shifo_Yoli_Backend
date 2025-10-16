import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { Search22PaymentDto, SearchPaymentDto } from './dto/create-payment.dto';
import { PaymentDocktorBemorDto, PaymentDocktorChanegeDto } from './dto/update-payment.dto';
import { Prisma } from '@prisma/client';
import { differenceInDays } from 'date-fns';
import axios from 'axios';

@Injectable()
export class PaymentService {

  private readonly logger = new Logger("PaymentService");
  private readonly TELEGRAM_TOKEN = '7603237952:AAFwBv61YCKO1egUh-vAaFzxwJYVotV91GI';
  private readonly CHAT_ID = '7516576408';

  constructor(private prisma: PrismaService) {}

  async searchPayments(dto: SearchPaymentDto) {
    const { firstName, email, limit, offset, startDate, endDate } = dto;
  
    const where: any = {};
  
    // Foydalanuvchi bo‘yicha qidiruv
    if (firstName || email) {
      where.wallet = {
        user: {
          ...(firstName && { firstName: { contains: firstName, mode: 'insensitive' } }),
          ...(email && { email: { contains: email, mode: 'insensitive' } }),
        },
      };
    }
  
    // Sana bo‘yicha qidiruv
    if (startDate && endDate) {
      where.createdAt = {
        gte: new Date(startDate),
        lte: new Date(new Date(endDate).setHours(23, 59, 59, 999)), // kun oxirigacha olish
      };
    } else if (startDate) {
      where.createdAt = { gte: new Date(startDate) };
    } else if (endDate) {
      where.createdAt = {
        lte: new Date(new Date(endDate).setHours(23, 59, 59, 999)),
      };
    }
  
    const [data, total] = await Promise.all([
      this.prisma.walletTransaction.findMany({
        where,
        include: {
          wallet: {
            include: {
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true,
                  role: true,
                  wallet: true,
                  phoneNumber: true,
                  createdAt: true,
                  updatedAt: true,
                },
              },
            },
          },
        },
        skip: offset,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.walletTransaction.count({ where }),
    ]);
  
    return {
      total,
      count: data.length,
      data,
    };
  }
  


  async oldPayment(dto: Search22PaymentDto, userId: string) {
    const { startDate, endDate, limit, offset } = dto;
  
    // 1️⃣ Foydalanuvchi hamyonini topish
    const wallet = await this.prisma.wallet.findFirst({
      where: { userId },
    });
  
    if (!wallet) {
      throw new BadRequestException("Foydalanuvchi topilmadi");
    }
  
    // 2️⃣ Qidiruv sharti
    const where: any = { walletId: wallet.id };
  
    // Sana bo‘yicha filter
    if (startDate && endDate) {
      where.createdAt = {
        gte: new Date(startDate),
        lte: new Date(new Date(endDate).setHours(23, 59, 59, 999)),
      };
    } else if (startDate) {
      where.createdAt = { gte: new Date(startDate) };
    } else if (endDate) {
      where.createdAt = {
        lte: new Date(new Date(endDate).setHours(23, 59, 59, 999)),
      };
    }
  
    // 3️⃣ Transactionlarni olish
    const [transactions, total] = await Promise.all([
      this.prisma.walletTransaction.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          wallet: {
            include: {
              user: true,
            }, 
          },  
        },
      }),
      this.prisma.walletTransaction.count({ where }),
    ]);
  
    if (!transactions || transactions.length === 0) {
      throw new BadRequestException("Bu foydalanuvchida transaction topilmadi");
    }
  
    // 4️⃣ Natija
    return {
      success: true,
      message: "Oldin to‘lov qilgan",
      total,
      count: transactions.length,
      data: transactions,
    };
  }



  async PaymentDocktor(userId: string, payload: PaymentDocktorBemorDto) {
    // 1️⃣ Foydalanuvchini topish
    const oldUser = await this.prisma.user.findUnique({
      where: { id: userId },
    });
  
    if (!oldUser) {
      throw new BadRequestException("Bunday foydalanuvchi mavjud emas");
    }
  
    // 2️⃣ Foydalanuvchining hamyonini olish yoki yaratish
    let wallet = await this.prisma.wallet.findUnique({
      where: { userId },
    });
  
    if (!wallet) {
      wallet = await this.prisma.wallet.create({
        data: {
          userId,
          balance: new Prisma.Decimal(0),
        },
      });
    }
  
    // 3️⃣ Doktorni topish
    const doctorProfile = await this.prisma.doctorProfile.findUnique({
      where: { doctorId: payload.doctorId },
      include: {
        doctor: true,
        salary: true,
      },
    });
  
    if (!doctorProfile) {
      throw new BadRequestException("Bunday doktor mavjud emas");
    }
  
    const oldSalary = doctorProfile.salary[0];
    if (!oldSalary || oldSalary.daily === null) {
      throw new BadRequestException("Doktor maoshini aniqlab bo‘lmadi");
    }
  
    // 4️⃣ To‘lanadigan summani hisoblash
    const amount = oldSalary.daily.toNumber() * payload.countday;
  
    // 5️⃣ Balans yetarli ekanligini tekshirish
    if (oldUser.role !== "SUPERADMIN" && wallet.balance.toNumber() < amount) {
      throw new BadRequestException(
        `Sizning hisobingizda ${payload.countday} kun uchun mablag‘ yetarli emas`
      );
    }
  
    // 6️⃣ Hisobdan pul yechish (agar SUPERADMIN bo‘lmasa)
    if (oldUser.role !== "SUPERADMIN") {
      await this.prisma.wallet.update({
        where: { id: wallet.id },
        data: {
          balance: wallet.balance.minus(amount),
          transactions: {
            create: {
              type: "DEBIT",
              amount: amount,
              source: "USER_PAYMENT",
              meta: { doctorId: payload.doctorId, days: payload.countday },
            },
          },
        },
      });
    }
  
    // 7️⃣ DailyDoctorAccess yozuvi yaratish
    await this.prisma.dailyDoctorAccess.create({
      data: {
        patientId: userId,
        doctorId: payload.doctorId,
        date: new Date(),
        price: amount,
        dayCountPay: payload.countday,
      },
    });
  
    // 8️⃣ Doktorga mablag‘ tushirish
    const doctorWallet = await this.prisma.wallet.findUnique({
      where: { userId: payload.doctorId },
    });
  
    await this.prisma.walletTransaction.create({
      data: {
        walletId: wallet.id,
        type: "DEBIT",
        amount: amount,
        source: "USER_PAYMENT",
        meta: { doctorId: payload.doctorId, days: payload.countday },
      },
    });


    if (doctorWallet) {
      await this.prisma.wallet.update({
        where: { id: doctorWallet.id },
        data: {
          balance: doctorWallet.balance.plus(amount),
          transactions: {
            create: {
              type: "CREDIT",
              amount: amount,
              source: "USER_PAYMENT",
              meta: { fromUserId: userId },
            },
          },
        },
      });
    }
  
    return {
      message: "Muvaffaqiyatli to‘lov amalga oshirildi",
      amount,
    };
  }
  

  async ChangeDocktorPay(userId:string,payload:PaymentDocktorChanegeDto){


    let olduser = await this.prisma.user.findFirst({

      where:{
        id:userId
      }
    })

    if(!olduser){
      throw new BadRequestException("Bunday foydalanuvchi mavjud emas")
    }

    let oldDocktor = await this.prisma.doctorProfile.findFirst({
      where:{
        doctorId:payload.doctorId
      },
  
    })

    if(!oldDocktor){
      throw new BadRequestException("Bunday doktor mavjud emas")
    }

    let daily = await this.prisma.dailyDoctorAccess.findFirst({
      where:{
        patientId:userId,
        doctorId:oldDocktor.doctorId
      }
    })


    if(!daily && olduser.role === "BEMOR"){
      throw new BadRequestException("Siz bu doktor bilan suhbatlashish uchun to'lov qiling")
    }
   

    return {
      message:"Siz to'lov qilgansiz",
    }

  }




  async cleanExpiredAccesses() {
    const now = new Date();

    // 1️⃣ Barcha DailyDoctorAccess yozuvlarini olish
    const accesses = await this.prisma.dailyDoctorAccess.findMany({
      include: {
        patient: true,
        doctor: true,
      },
    });

    const expired: string[] = [];

    for (const access of accesses) {
      const daysPassed = differenceInDays(now, new Date(access.createdAt));

      // 2️⃣ Agar (daysPassed >= dayCountPay) bo‘lsa → muddati tugagan
      if (daysPassed >= access.dayCountPay) {
        expired.push(
          `🧾 ${access.patient.firstName} ${access.patient.lastName} → ${access.doctor.firstName} ${access.doctor.lastName} (Tugadi: ${daysPassed} kun)`
        );

        // 3️⃣ Bazadan o‘chirish
        await this.prisma.dailyDoctorAccess.delete({
          where: { id: access.id },
        });
      }
    }

    // 4️⃣ Agar biror narsa o‘chirilgan bo‘lsa, Telegramga yuborish
    if (expired.length > 0) {
      const message = `🕒 Tugagan kirishlar:\n\n${expired.join('\n')}`;
      await this.sendTelegramMessage(message);
    }

    this.logger.log(`✅ ${expired.length} ta kirish o‘chirildi`);
  }


  async sinovTekshiruv(){

    await this.sendTelegramMessage("Tekshiruv muffaqiyatli ishlamoqda...")
  }

  private async sendTelegramMessage(text: string) {
    try {
      const url = `https://api.telegram.org/bot${this.TELEGRAM_TOKEN}/sendMessage`;
      await axios.post(url, {
        chat_id: this.CHAT_ID,
        text,
        parse_mode: 'HTML',
      });
    } catch (error) {
      this.logger.error('Telegramga yuborishda xatolik', error.message);
    }
  }


}

