import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { stat } from 'fs';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Injectable()
export class DeviceService {
  constructor(private prisma:PrismaService){}
  
  
  async findAll(userId:string) {
  
    let data = await this.prisma.device.findMany({include:{user:true,_count:true,blockedUsers:true},where:{userId:userId}})
      
    return data
    }
  

private async BlockDevice( req: Request) {
  
  if (!req) return;                                     
  
  const userAgent = req.headers["user-agent"] || "unknown";
  const ip =  req.ip || (req.headers["x-forwarded-for"] as string) || "unknown";
  
  
  const existingDevice = await this.prisma.device.findFirst({
    where: {
      OR: [
        { address: ip },
            { name: userAgent },
          ],
        },
      });
      
      if (existingDevice?.deviceType == "register") {
        return true
      }

      throw new UnauthorizedException("Siz qolgan qurilmalarni bloklashingiz uchun Ro'yxatdan o'tgan qurilmangizda turib bloklashiz kerak.")

  }






  async remove(deviceId: string,userId:string,req:Request) {

    let olddevice = await this.prisma.device.findFirst({where:{deviceId:deviceId,}})
    if(!olddevice) return "Bu qurilma topilmadi"

    let oldDevice = await this.BlockDevice(req)
    if(oldDevice != true) throw new UnauthorizedException("Siz qolgan qurilmalarni bloklashingiz uchun Ro'yxatdan o'tgan qurilmangizda turib bloklashiz kerak.")

    if(olddevice.userId != userId) throw new UnauthorizedException("Bu qurilmani o'chirishga sizda ruxsat yo'q")

      let data = await this.prisma.blockedUsers.create({
        data:{
          deviceId:olddevice.deviceId
        }
      })

      return data

  }


  async unblock(deviceId: string,userId:string,req:Request) {

    let olddevice = await this.prisma.device.findFirst({where:{deviceId:deviceId,}})
    if(!olddevice) return "Bu qurilma topilmadi"

    let oldDevice = await this.BlockDevice(req)
    if(oldDevice != true) throw new UnauthorizedException("Siz qolgan qurilmalarni blokdan chiqarishingiz uchun Ro'yxatdan o'tgan qurilmangizda turib bloklashiz kerak.")

    if(olddevice.userId != userId) throw new UnauthorizedException("Bu qurilmani blokdan chiqarish uchun sizda ruxsat yo'q")


      let olddevice2 = await this.prisma.blockedUsers.findFirst({
        where:{
          id:olddevice.id
        }
      })

      if(!olddevice2) return "Bu qurilma bloklanmagan"

      let data = await this.prisma.blockedUsers.delete({
        where:{
          id:olddevice.deviceId
        }
      })

    return {
      status:true,
      message:"Qurilma blokdan chiqarildi"
    }

  }
}
