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
exports.SmsService = void 0;
const common_1 = require("@nestjs/common");
const mailer_service_1 = require("../mailer/mailer.service");
let SmsService = class SmsService {
    mailerService;
    constructor(mailerService) {
        this.mailerService = mailerService;
    }
    async sendSms(subject, to, code) {
        try {
            await this.mailerService.sendEmail(to, subject, code);
            return true;
        }
        catch (error) {
            console.error('Email yuborishda xatolik:', error.message);
            throw new common_1.HttpException('Email Service: ' + (error.message || 'Xatolik yuz berdi'), error.status || common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
exports.SmsService = SmsService;
exports.SmsService = SmsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [mailer_service_1.AppMailerService])
], SmsService);
//# sourceMappingURL=sms.service.js.map