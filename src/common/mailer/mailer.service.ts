import { Injectable } from '@nestjs/common';
import { MailerService as MailerServices } from '@nestjs-modules/mailer';

@Injectable()
export class AppMailerService {
  constructor(private mailerService: MailerServices) {}

  async sendEmail(email: string, subject: string, code: number) {
    await this.mailerService.sendMail({
      to: email,
      subject,
      template: 'index',
      context: {
        subject,
        code,
        year: new Date().getFullYear(),
      },
    });         
  }

  async sendNotificationEmail(
    to: string, 
    subject: string,  
    message: string,  
    date: Date = new Date(),
  ) {
    if (!to || !to.includes("@")) {
      console.warn('Email qabul qiluvchi aniqlanmadi, yuborilmadi.');
      return;
    }
  
    console.log("emailer", to);
  
    await this.mailerService.sendMail({
      to,
      subject,
      template: 'top', // top.hbs
      context: {
        subject,
        message,
        // Sana + vaqt (soat:minut:sekund)
        date: date.toLocaleString('uz-UZ', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }),
        year: new Date().getFullYear(),
      },
    });
  }
  


  
  async adminsms(to: string , subject: string,  message: string, date: Date = new Date(),) {
    await this.mailerService.sendMail({
      to,
      subject,
      template: 'sms', // top.hbs
      context: {
        subject,
        message,
        date: date.toLocaleDateString(),
        year: new Date().getFullYear(),
      },
    });
  }

}



  
  

