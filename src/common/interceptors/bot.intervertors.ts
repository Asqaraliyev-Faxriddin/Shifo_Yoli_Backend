import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { tap } from 'rxjs/operators';
import axios from 'axios';
import { JwtService } from '@nestjs/jwt';

const TELEGRAM_TOKEN = '8499804816:AAH-Q9aRE5jGlVrHGyyJZUrfw720UBf2yNM';
const CHAT_ID = '7516576408';

@Injectable()
export class TelegramInterceptor implements NestInterceptor {
  private readonly logger = new Logger('Telegram');

  constructor(private readonly jwtService: JwtService) {}

  async intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest();
    const { method, url, ip, body, query, headers } = request;

    // Token borligini tekshirish
    const authHeader = headers['authorization'];
    let userData: any = null;

    if (authHeader) {
      const token = authHeader.split(' ')[1] || authHeader;
      try {
        userData = await this.jwtService.verifyAsync(token); // Tokenni tekshirish
      } catch (err) {
        this.logger.warn('Token noto‘g‘ri yoki muddati o‘tgan');
      }
    }

    // Telegramga jo‘natiladigan xabar matni
    const message = `
📩 *Yangi so'rov kelib tushdi!*

🧾 **Body:**
\`${JSON.stringify(body, null, 2)}\`

🔍 **Query:**
\`${JSON.stringify(query, null, 2)}\`

🧭 **Method:** ${method}
🌐 **URL:** ${url}
💻 **IP:** ${ip}

👤 **User:**
${userData ? JSON.stringify(userData, null, 2) : 'Nomaʼlum foydalanuvchi'}

🔑 **Token:** ${authHeader || 'Token yo‘q'}
    `;

    try {
      await axios.post(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
        chat_id: CHAT_ID,
        text: message,
        parse_mode: 'Markdown',
      });
      this.logger.log('Telegramga xabar yuborildi');
    } catch (err) {
      this.logger.error('Telegramga yuborishda xato:', err.message);
    }

    return next.handle().pipe(
      tap(() => this.logger.log(`So‘rov yakunlandi: ${url}`)),
    );
  }
}
