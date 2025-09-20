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
exports.VerificationService = void 0;
const common_1 = require("@nestjs/common");
const verification_1 = require("../../common/types/verification");
const sms_service_1 = require("../../common/services/sms.service");
const redis_service_1 = require("../../core/prisma/redis/redis.service");
const prisma_service_1 = require("../../core/prisma/prisma.service");
const times_1 = require("../../core/prisma/utils/times");
const functions_1 = require("../../core/prisma/utils/functions");
const random_1 = require("../../core/prisma/utils/random");
let VerificationService = class VerificationService {
    prismaService;
    smsService;
    redis;
    constructor(prismaService, smsService, redis) {
        this.prismaService = prismaService;
        this.smsService = smsService;
        this.redis = redis;
    }
    getKey(type, email, confirmation) {
        const storesKeys = {
            [verification_1.EverificationTypes.REGISTER]: "reg_",
            [verification_1.EverificationTypes.RESET_PASSWORD]: "respass_",
            [verification_1.EverificationTypes.EDIT_PHONE]: "edph_",
        };
        let key = storesKeys[type];
        if (confirmation) {
            key += "cfm_";
        }
        key += email;
        return key;
    }
    async throwIFUserExist(email) {
        const user = await this.prismaService.user.findUnique({ where: { email } });
        if (user) {
            throw new common_1.HttpException("Email already used", common_1.HttpStatus.BAD_REQUEST);
        }
        return user;
    }
    async throwIFUserNotExist(email) {
        const user = await this.prismaService.user.findUnique({ where: { email } });
        if (!user) {
            throw new common_1.HttpException("User not found", common_1.HttpStatus.NOT_FOUND);
        }
        return user;
    }
    async sendOtp(payload) {
        const { type, email } = payload;
        const key = this.getKey(type, email);
        const session = await this.redis.get(key);
        if (session) {
            throw new common_1.HttpException("Code already sent to user", common_1.HttpStatus.BAD_REQUEST);
        }
        switch (type) {
            case verification_1.EverificationTypes.REGISTER:
                await this.throwIFUserExist(email);
                break;
            case verification_1.EverificationTypes.EDIT_PHONE:
                await this.throwIFUserNotExist(email);
                break;
            case verification_1.EverificationTypes.RESET_PASSWORD:
                await this.throwIFUserNotExist(email);
                break;
        }
        const otp = (0, random_1.generateOtp)();
        await this.redis.set(key, JSON.stringify(otp), (0, times_1.SectoMills)(30));
        await this.smsService.sendSms((0, functions_1.getMessages)(type, otp), email, Number(otp));
        return { message: "Confirmation code Sent" };
    }
    async verifyOtp(payload) {
        const { type, email, otp } = payload;
        const session = await this.redis.get(this.getKey(type, email));
        if (!session) {
            throw new common_1.HttpException("OTP expired!", common_1.HttpStatus.BAD_REQUEST);
        }
        if (otp !== JSON.parse(session)) {
            throw new common_1.HttpException("invalid OTP!", common_1.HttpStatus.BAD_REQUEST);
        }
        await this.redis.del(this.getKey(type, email));
        await this.redis.set(this.getKey(type, email, true), JSON.stringify(otp), (0, times_1.SectoMills)(4000));
        return {
            status: true,
            message: "Verified"
        };
    }
    async checkConfirmOtp(payload) {
        const { type, email, otp } = payload;
        const session = await this.redis.get(this.getKey(type, email, true));
        if (!session) {
            throw new common_1.HttpException("OTP expired!", common_1.HttpStatus.BAD_REQUEST);
        }
        if (otp !== JSON.parse(session)) {
            throw new common_1.HttpException("invalid OTP!", common_1.HttpStatus.BAD_REQUEST);
        }
        await this.redis.del(this.getKey(type, email, true));
        return true;
    }
};
exports.VerificationService = VerificationService;
exports.VerificationService = VerificationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, sms_service_1.SmsService, redis_service_1.RedisService])
], VerificationService);
//# sourceMappingURL=verification.service.js.map