import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { Search22PaymentDto, SearchPaymentDto } from './dto/create-payment.dto';
import { PaymentDocktorBemorDto, PaymentDocktorChanegeDto } from './dto/update-payment.dto';

@Injectable()
export class PaymentService {
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



  async PaymentDocktor(userId:string,payload:PaymentDocktorBemorDto){

    let olduser = await this.prisma.user.findFirst({

      where:{
        id:userId
      }
    })

    if(!olduser){
      throw new BadRequestException("Bunday foydalanuvchi mavjud emas")
    }


    let wallet = await this.prisma.wallet.findFirst({
      where:{
        userId
      }
    })

    if(!wallet){
      wallet = await this.prisma.wallet.create({
        data:{
          userId,
          balance:0
        }
      })
    } 

    let oldDocktor = await this.prisma.doctorProfile.findFirst({
      where:{
        doctorId:payload.doctorId
      },
  
    })

    if(!oldDocktor){
      throw new BadRequestException("Bunday doktor mavjud emas")
    }

    let oldSalary = await this.prisma.doctorSalary.findFirst({
      where:{
        doctorId:oldDocktor.doctorId
      }
    })

    if(!oldSalary){
      throw new BadRequestException("Doktor maoshini aniqlab bo'lmadi")

    }

    let amount: number;

    if (oldSalary.daily !== null) {
        amount = oldSalary.daily.toNumber() * payload.countday;
    } else {
        amount = 0; // null bo'lsa 0, yoki boshqa xatti-harakat
    }


    if(wallet.balance.toNumber() < amount && olduser.role != "SUPERADMIN"){
      throw new BadRequestException(`Sizning hisobingizda ${payload.countday}-kun uchun pul yetarli emas`)
    }

    let tolov = await this.prisma.dailyDoctorAccess.create({
      data:{
        patientId:String(userId),
        doctorId:oldDocktor.doctorId,
        date:new Date(),
        price:amount,
        dayCountPay:payload.countday
      }
    })


    return {
      message:"Muvaffaqiyatli to'lov qilindi",
    }


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





}

