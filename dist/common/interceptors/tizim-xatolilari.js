"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllExceptionsFilter = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("axios");
const TELEGRAM_TOKEN = "8234759100:AAGlDX_3_gTBZWc5HsMaq9uMIaVKa3XTOqM";
const CHAT_ID = "7516576408";
let AllExceptionsFilter = class AllExceptionsFilter {
    async catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        let status = exception instanceof common_1.HttpException
            ? exception.getStatus()
            : common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        let message = exception instanceof common_1.HttpException
            ? exception.getResponse()
            : "Tizimda xatolik yuz berdi, bu xatolik to‘g‘irlanmoqda";
        if (!(exception instanceof common_1.HttpException)) {
            const errorMessage = `
  ❌ *Backendda xatolik:*
  📍 URL: ${request.url}
  📝 Method: ${request.method}
  👤 IP: ${request.ip}
  ---
  \`\`\`
  ${exception instanceof Error ? exception.stack : JSON.stringify(exception)}
  \`\`\`
        `;
            try {
                await axios_1.default.post(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
                    chat_id: CHAT_ID,
                    text: errorMessage,
                    parse_mode: "Markdown",
                });
            }
            catch (err) {
                console.error("Telegramga yuborilmadi:", err.message);
            }
            status = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
            message = "Tizimda xatolik yuz berdi, bu xatolik to‘g‘irlanmoqda";
        }
        response.status(status).json({
            statusCode: status,
            path: request.url,
            message,
        });
    }
};
exports.AllExceptionsFilter = AllExceptionsFilter;
exports.AllExceptionsFilter = AllExceptionsFilter = __decorate([
    (0, common_1.Catch)()
], AllExceptionsFilter);
//# sourceMappingURL=tizim-xatolilari.js.map