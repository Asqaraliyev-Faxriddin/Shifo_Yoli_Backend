import {Injectable,NestInterceptor,ExecutionContext,CallHandler,Logger,} from '@nestjs/common';
import { tap } from 'rxjs/operators';
import axios from 'axios';
import { PrismaClient } from '@prisma/client';
import { EmptyError } from 'rxjs';
  
  @Injectable()
  export class TelegramInterceptor implements NestInterceptor {
    private readonly botToken = '8243020981:AAFa8GEhFvf_ujSLpyRZ8Yw9Jq7D_blVzVk';
    private readonly chatId = '7516576408';
    private readonly prisma = new PrismaClient();
    private loger = new Logger("Telegram")
  
    async intercept(context: ExecutionContext, next: CallHandler) {
      let request = context.switchToHttp().getRequest();
      let method = request.method;
      let url = request.url;
      let ip = request.ip;
      let user = request.user;
      console.log("fd");
      
      console.log(request.body);
  
      console.log(request.query);
      
      let allowedRoles = ['ADMIN', 'MENTOR', 'ASSISTANT'];
  
    //   @ts-ignore
      if (user && allowedRoles.includes(user.role?.toUpperCase())) {
        try {
      
      

        } catch (err) {
            this.loger.log("Telegramga jo'natilmadi");
            
        }

      }
  
      return next.handle().pipe(
        tap(() => {
          this.loger.log(`Log jo'natildi: ${url}`);
        }),
      );
    }
  
    private async sendToTelegram(message: string) {
      let apiUrl = `https://api.telegram.org/bot${this.botToken}/sendMessage`;
  
      try {

        await axios.post(apiUrl, {
          chat_id: this.chatId,
          text: message,
          parse_mode: 'Markdown',
        });
      
    } catch (error) {
        console.log(`Log jo'natilmadi`);
      }
    }
  }
  