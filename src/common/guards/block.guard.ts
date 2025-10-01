
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { JwtAccesToken } from '../config/jwt';
import { randomUUID } from 'crypto';
import { DeviceType } from '@prisma/client';

@Injectable()
export class BlockGuard implements CanActivate {
  
    constructor(private jwtService:JwtService,private prisma:PrismaService){}
  
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
          
          if (existingDevice) {
            return existingDevice
          }

          return true
    
      }
    
     
  
  
    async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest()
    
    
    
        try { 
            
            if(request.url == "/auth/login" || request.url == "/auth/register" ){

               let data = await this.BlockDevice(request)

               if(data && data != true){

                let olduser = await this.prisma.blockedUsers.findFirst({
                    where: {
                        OR: [
                          { deviceId: data.deviceId },
                          { userId: data.userId },
                        ],
                      },
                })


                if(olduser) throw new UnauthorizedException("Siz yoki qurilmanziz bloklangansiz blokdan chiqish uchun @Asqaraliyev_Faxriddin bilan bog'laning")
                    
                    return true

                }

               return true

            
            }            
            return true

        } catch (error) {

            throw new UnauthorizedException("Siz yoki qurilmangiz bloklangansiz blokdan chiqish uchun @Asqaraliyev_Faxriddin bilan bog'laning")
        }

  } 


}
