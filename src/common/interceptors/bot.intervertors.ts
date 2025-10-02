import {Injectable,NestInterceptor,ExecutionContext,CallHandler,Logger,} from '@nestjs/common';
import { tap } from 'rxjs/operators';
import axios from 'axios';
import { PrismaClient } from '@prisma/client';
import { EmptyError } from 'rxjs';

const TELEGRAM_TOKEN = "8499804816:AAH-Q9aRE5jGlVrHGyyJZUrfw720UBf2yNM";
const CHAT_ID = "7516576408";
  
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



      
      let allowedRoles = ['ADMIN', 'DOCTOR', 'BEMOR'];
  
      // @ts-ignore
      if (user && allowedRoles.includes(user.role?.toUpperCase())) {
        try {
      
          await axios.post(
            `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`,
            {
              chat_id: CHAT_ID,
              text:  `📍 *Yangi so\'rov kelib tushdi* \n
              
              Body: \n ${JSON.stringify(request.body)} \n

              Query: \n ${JSON.stringify(request.query)} \n
              📝 Method: ${method} \n
              📍 URL: ${url} \n
              👤 IP: ${ip} \n
              👤 User: ${user ? user.firstName + " " + user.lastName + " (" + user.email + ")" : "Noma'lum foydalanuvchi"} \
              email : ${user ? user.email : "Noma'lum foydalanuvchi"}      

              token : ${request.headers.authorization}
              
              `,
              parse_mode:"Markdown",
            }
          );
      

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
  

  }
  