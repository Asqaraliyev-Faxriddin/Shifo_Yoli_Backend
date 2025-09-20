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
exports.IChekOtp = exports.VerifyOtpDto = exports.VerificationOtpDto = exports.SendOtpDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const verification_1 = require("../../../common/types/verification");
class SendOtpDto {
    type;
    email;
}
exports.SendOtpDto = SendOtpDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: verification_1.EverificationTypes, description: 'Tasdiqlash turi: REGISTER, LOGIN, PASSWORD_RESET va h.k.' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(verification_1.EverificationTypes),
    __metadata("design:type", String)
], SendOtpDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '@example.com', description: 'Foydalanuvchining telefon raqami' }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], SendOtpDto.prototype, "email", void 0);
class VerificationOtpDto {
    code;
}
exports.VerificationOtpDto = VerificationOtpDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '123456', description: 'SMS orqali yuborilgan tasdiqlash kodi' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], VerificationOtpDto.prototype, "code", void 0);
class VerifyOtpDto {
    type;
    email;
    otp;
}
exports.VerifyOtpDto = VerifyOtpDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'REGISTER', description: 'Tasdiqlash turi' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], VerifyOtpDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '@example.com', description: 'Telefon raqami' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], VerifyOtpDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '123456', description: 'Tasdiqlash kodi' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], VerifyOtpDto.prototype, "otp", void 0);
class IChekOtp {
    type;
    email;
    otp;
}
exports.IChekOtp = IChekOtp;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'REGISTER', description: 'Tasdiqlash turi' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], IChekOtp.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '@example.com', description: 'Telefon raqami (E.164 formatda)' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], IChekOtp.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '123456', description: 'Yuborilgan OTP kodi' }),
    __metadata("design:type", String)
], IChekOtp.prototype, "otp", void 0);
//# sourceMappingURL=verification.dto.js.map