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
exports.UpdatePasswordDto = exports.PhoneUpdateDto = exports.UpdateProfileDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class UpdateProfileDto {
    firstName;
    lastName;
    age;
}
exports.UpdateProfileDto = UpdateProfileDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Foydalanuvchining ismi',
        example: 'Ali',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Foydalanuvchining familiyasi',
        example: 'Valiyev',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Foydalanuvchining roli',
        example: 'BUY',
        enum: ['BUY', 'SELL'],
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateProfileDto.prototype, "age", void 0);
class PhoneUpdateDto {
    otp;
    email;
}
exports.PhoneUpdateDto = PhoneUpdateDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: "123456", description: "SMS orqali yuborilgan OTP kodi" }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PhoneUpdateDto.prototype, "otp", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "@example.com", description: "Yangi telefon raqami" }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], PhoneUpdateDto.prototype, "email", void 0);
class UpdatePasswordDto {
    oldPassword;
    newPassword;
}
exports.UpdatePasswordDto = UpdatePasswordDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdatePasswordDto.prototype, "oldPassword", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdatePasswordDto.prototype, "newPassword", void 0);
//# sourceMappingURL=profile.dto.js.map