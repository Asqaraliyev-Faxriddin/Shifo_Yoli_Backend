import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { Search22PaymentDto, SearchPaymentDto } from './dto/create-payment.dto';

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
  
}

