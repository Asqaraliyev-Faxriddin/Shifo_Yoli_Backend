import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CreateContactDto } from './dto/create-contact.dto';
import axios from 'axios';

@Injectable()
export class ContactService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly TELEGRAM_TOKEN =
    '7657358445:AAF-5Cr6f3Jf4AevenqEK4773fIgYxirXms';
  private readonly CHAT_ID = '7516576408';

  async create(createContactDto: CreateContactDto, req: any) {
    const { email, message, phone } = createContactDto;
    const phoneValue = phone ?? '';

    const ip = req.ip || req.connection.remoteAddress || 'unknown_ip';
    const userAgent = req.headers['user-agent'] || 'unknown_agent';
    const unique = `${ip}_${userAgent}`;

    const lastContact = await this.prisma.contact.findUnique({
      where: { unique },
    });

    if (lastContact) { 
      const now = new Date();
      const diffMs = now.getTime() - lastContact.createdAt.getTime();
      const diffMinutes = Math.floor(diffMs / 1000 / 60);

      if (diffMinutes < 10) {
        throw new BadRequestException(
          `❌ Siz faqat har 10 daqiqada 1 ta so‘rov yubora olasiz. Qolgan vaqt: ${
            10 - diffMinutes
          } daqiqa`,
        );
      }

      const updated = await this.prisma.contact.update({
        where: { unique },
        data: {
          email,
          message,
          phone: phoneValue,
          createdAt: new Date(),
        },

        select:{
          email:true,
          phone:true,
          message:true,
          createdAt:true,
          updatedAt:true,
          unique:true,
        }
      });

      await this.sendToTelegram(email, phoneValue, message);

      

      return {
        success: true,
        message: '✅ Sizning murojaatingiz muvaffaqiyatli yuborildi.',
        data:  updated,
      };
    }

    const created = await this.prisma.contact.create({
      data: {
        email,
        message,
        phone: phoneValue,
        unique,
      },

      select:{
        email:true,
        phone:true,
        message:true,
        createdAt:true,
        updatedAt:true,
        unique:true,
      }
    });

    await this.sendToTelegram(email, phoneValue, message);

    return {
      success: true,
      message: '✅ Sizning murojaatingiz muvaffaqiyatli yuborildi.',
      data: created,
    };
  }

  private async sendToTelegram(email: string, phone: string, message: string) {
    const text = `*📩 Yangi murojaat*\n\n*✉️ Email:* ${email}\n*📞 Telefon:* ${phone || '—'}\n*💬 Xabar:*\n${message}`;

    const url = `https://api.telegram.org/bot${this.TELEGRAM_TOKEN}/sendMessage`;

    await axios.post(url, {
      chat_id: this.CHAT_ID,
      text,
      parse_mode: 'Markdown',
    });
  }

}
