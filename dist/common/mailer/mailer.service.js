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
exports.AppMailerService = void 0;
const common_1 = require("@nestjs/common");
const mailer_1 = require("@nestjs-modules/mailer");
let AppMailerService = class AppMailerService {
    mailerService;
    constructor(mailerService) {
        this.mailerService = mailerService;
    }
    async sendEmail(email, subject, code) {
        if (!(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) {
            return;
        }
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
    async sendNotificationEmail(to, subject, message, date = new Date()) {
        if (!(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to))) {
            return;
        }
        console.log("emailer", to);
        await this.mailerService.sendMail({
            to,
            subject,
            template: 'top',
            context: {
                subject,
                message,
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
    async adminsms(to, subject, message, date = new Date()) {
        if (!(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to))) {
            return;
        }
        await this.mailerService.sendMail({
            to,
            subject,
            template: 'sms',
            context: {
                subject,
                message,
                date: date.toLocaleDateString(),
                year: new Date().getFullYear(),
            },
        });
    }
};
exports.AppMailerService = AppMailerService;
exports.AppMailerService = AppMailerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [mailer_1.MailerService])
], AppMailerService);
//# sourceMappingURL=mailer.service.js.map