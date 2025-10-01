
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { JwtAccesToken } from '../config/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService:JwtService,private prismaService:PrismaService){}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest()
    
    let token =this.TokenValidation(request)
    console.log(token);
    
    if(!token) throw new UnauthorizedException()
    
        try { 
            let user = await this.jwtService.verifyAsync(token,JwtAccesToken)
            console.log(user);
            
            if(!user) throw new UnauthorizedException()
            let olduser =await this.prismaService.user.findFirst({where:{id:user.id}})
            if(!olduser) throw new NotFoundException("user not found")
            console.log(user);

            let oldblock = await this.prismaService.blockedUsers.findFirst({where:{userId:user.id}})
            if(oldblock) throw new UnauthorizedException("user blocked")
            
            request.user = user
            return true

        } catch (error) {

          if(error.message = "user blocked") throw new UnauthorizedException("Siz bloklangansiz blokdan chiqish uchun @Asqaraliyev_Faxriddin bilan bog'laning")
            throw new UnauthorizedException()
        }

  } 

  TokenValidation(request:Request){
    let [type,token] = request.headers.authorization?.split(" ") || []
    
    return type == "Bearer" ?token :undefined
  }
}
