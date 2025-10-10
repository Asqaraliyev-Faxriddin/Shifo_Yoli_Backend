import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { SearchPaymentDto } from './dto/create-payment.dto';

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


  async oldPayment(id:string){

    let olduser = await this.prisma.wallet.findFirst({
      where:{
        userId:id
      }
    })

    if(!olduser) {
      throw new BadRequestException("User topilmadi")
    }

    let data = await this.prisma.walletTransaction.findFirst({
      where:{
        walletId:olduser.id
      }
    })

    if(!data){
      throw new BadRequestException("Userda transaction topilmadi")
    }


    return {
      succase:true,
      message:"Oldin to'lov qilgan",
      data
    }
  }
}
