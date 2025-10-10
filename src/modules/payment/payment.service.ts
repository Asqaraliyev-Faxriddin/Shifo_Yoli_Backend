import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { Search22PaymentDto, SearchPaymentDto } from './dto/create-payment.dto';

@Injectable()
export class PaymentService {
  constructor(private prisma: PrismaService) {}

  async searchPayments(dto: SearchPaymentDto) {
    const { firstName, email, limit, offset } = dto;

    const where: any = {};

    if (firstName || email) {
      where.wallet = {
        user: {
          ...(firstName && { firstName: { contains: firstName, mode: 'insensitive' } }),
          ...(email && { email: { contains: email, mode: 'insensitive' } }),
        },
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
    // Foydalanuvchining hamyonini topish
    const wallet = await this.prisma.wallet.findFirst({
      where: { userId },
    });

    if (!wallet) {
      throw new BadRequestException("User topilmadi");
    }

    // WalletTransaction ni topish (limit va offset bilan)
    const transactions = await this.prisma.walletTransaction.findMany({
      where: { walletId: wallet.id },
      skip: dto.offset,
      take: dto.limit,
      orderBy: { createdAt: 'desc' },
    });

    if (!transactions || transactions.length === 0) {
      throw new BadRequestException("Userda transaction topilmadi");
    }

    return {
      success: true,
      message: "Oldin to'lov qilgan",
      total: transactions.length,
      data: transactions,
    };
  }
}

