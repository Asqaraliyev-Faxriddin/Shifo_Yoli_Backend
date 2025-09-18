import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma.service'; 
import * as bcrypt from "bcrypt"
import { UserRole } from '@prisma/client';

@Injectable()
export class SeaderService implements OnModuleInit {

    private loger = new Logger("Seader")

    constructor(private prisma:PrismaService){}


    async onModuleInit() {
                 
        await this.CreateSuperadmin()
    }

    async CreateSuperadmin() {
      let password = await bcrypt.hash("11201111",10)
        await this.prisma.user.createMany({
          data: [
            {
              firstName: 'Faxriddin',
              lastName:"Asqaraliyev",
              age:15,
              email: 'asqaraliyevfaxriddin2011@gmail.com',
              role: UserRole.ADMIN,
              password
            },


            {
              firstName: 'Biror',
              lastName:"Kim",
              age:25,

              email: 'asqaraliyevfaxriddin2009@gmail.com',
              role: UserRole.DOCTOR,
              password
            },
            

            {
              firstName: 'Men',
              lastName:"Sen",
              age:24,
              email: 'asqaraliyevfaxriddin44@gmail.com',
              role: UserRole.SUPERADMIN,
              password
            },

            {
              firstName: 'Men',
              lastName:"Sen",
              age:24,
              email: 'asqaraliyevfaxriddin9876@gmail.com',
              role: UserRole.BEMOR,
              password
            },
            
      
           
          ],
          skipDuplicates: true,
        });
       
        this.loger.log("Admin ,Sotuvchi va Xaridor yaratildi.")
      }
}
