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
exports.ContactService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../core/prisma/prisma.service");
const axios_1 = require("axios");
let ContactService = class ContactService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    TELEGRAM_TOKEN = '7657358445:AAF-5Cr6f3Jf4AevenqEK4773fIgYxirXms';
    CHAT_ID = '7516576408';
    async create(createContactDto, req) {
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
                throw new common_1.BadRequestException(`❌ Siz faqat har 10 daqiqada 1 ta so‘rov yubora olasiz. Qolgan vaqt: ${10 - diffMinutes} daqiqa`);
            }
            const updated = await this.prisma.contact.update({
                where: { unique },
                data: {
                    email,
                    message,
                    phone: phoneValue,
                    createdAt: new Date(),
                },
                select: {
                    email: true,
                    phone: true,
                    message: true,
                    createdAt: true,
                    updatedAt: true,
                    unique: true,
                }
            });
            await this.sendToTelegram(email, phoneValue, message);
            return {
                success: true,
                message: '✅ Sizning murojaatingiz muvaffaqiyatli yuborildi.',
                data: updated,
            };
        }
        const created = await this.prisma.contact.create({
            data: {
                email,
                message,
                phone: phoneValue,
                unique,
            },
            select: {
                email: true,
                phone: true,
                message: true,
                createdAt: true,
                updatedAt: true,
                unique: true,
            }
        });
        await this.sendToTelegram(email, phoneValue, message);
        return {
            success: true,
            message: '✅ Sizning murojaatingiz muvaffaqiyatli yuborildi.',
            data: created,
        };
    }
    async sendToTelegram(email, phone, message) {
        const text = `*📩 Yangi murojaat*\n\n*✉️ Email:* ${email}\n*📞 Telefon:* ${phone || '—'}\n*💬 Xabar:*\n${message}`;
        const url = `https://api.telegram.org/bot${this.TELEGRAM_TOKEN}/sendMessage`;
        await axios_1.default.post(url, {
            chat_id: this.CHAT_ID,
            text,
            parse_mode: 'Markdown',
        });
    }
};
exports.ContactService = ContactService;
exports.ContactService = ContactService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ContactService);
//# sourceMappingURL=contact.service.js.map