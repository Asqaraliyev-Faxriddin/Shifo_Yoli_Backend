"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelegramInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
const axios_1 = require("axios");
const client_1 = require("@prisma/client");
const jwt_1 = require("../config/jwt");
const TELEGRAM_TOKEN = "8499804816:AAH-Q9aRE5jGlVrHGyyJZUrfw720UBf2yNM";
const CHAT_ID = "7516576408";
let TelegramInterceptor = class TelegramInterceptor {
    botToken = '8243020981:AAFa8GEhFvf_ujSLpyRZ8Yw9Jq7D_blVzVk';
    chatId = '7516576408';
    prisma = new client_1.PrismaClient();
    loger = new common_1.Logger("Telegram");
    jwtService;
    async intercept(context, next) {
        let request = context.switchToHttp().getRequest();
        let method = request.method;
        let url = request.url;
        let ip = request.ip;
        let user = request.user;
        console.log("fd");
        console.log(request.body);
        console.log(request.query);
        let user2 = await this.jwtService.verifyAsync(request.headers.authorization, jwt_1.JwtAccesToken);
        let olduser = await this.prisma.user.findFirst({ where: { id: user2.id, role: user2.role } });
        let allowedRoles = ['ADMIN', 'DOCTOR', 'BEMOR'];
        if (olduser && allowedRoles.includes(user2.role?.toUpperCase())) {
            try {
                await axios_1.default.post(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
                    chat_id: CHAT_ID,
                    text: `📍 *Yangi so\'rov kelib tushdi* \n
              
              Body: \n ${JSON.stringify(request.body)} \n

              Query: \n ${JSON.stringify(request.query)} \n
              📝 Method: ${method} \n
              📍 URL: ${url} \n
              👤 IP: ${ip} \n
              👤 User: ${user2 ? user2.firstName + " " + user2.lastName + " (" + user2.email + ")" : "Noma'lum foydalanuvchi"} \
              email : ${user2 ? user2.email : "Noma'lum foydalanuvchi"}      

              token : ${request.headers.authorization}
              
              `,
                    parse_mode: "Markdown",
                });
            }
            catch (err) {
                this.loger.log("Telegramga jo'natilmadi");
            }
        }
        return next.handle().pipe((0, operators_1.tap)(() => {
            this.loger.log(`Log jo'natildi: ${url}`);
        }));
    }
};
exports.TelegramInterceptor = TelegramInterceptor;
exports.TelegramInterceptor = TelegramInterceptor = __decorate([
    (0, common_1.Injectable)()
], TelegramInterceptor);
//# sourceMappingURL=bot.intervertors.js.map