import { Global, Module } from '@nestjs/common';
import { MailerModule as NestMalierModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import {HandlebarsAdapter} from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter"
import { AppMailerService } from './mailer.service';
@Global()
@Module({
  imports:[
    NestMalierModule.forRoot({
      transport:{
        service:'gmail',
        auth:{
          user:process.env.EMAIL_USER,
          pass:process.env.EMAIL_PASS
        }
      },

      defaults:{
        from:"Uy Sotiladi<asqaraliyevfaxrididn2011@gmail.com>"
      },

      template:{
        dir:join(process.cwd(),'src','templates'),
        adapter:new HandlebarsAdapter(),
        options:{
          strict:true
        }
      }
    })
  ],
providers:[AppMailerService],
exports:[AppMailerService]

})
export class MailerModule {}
