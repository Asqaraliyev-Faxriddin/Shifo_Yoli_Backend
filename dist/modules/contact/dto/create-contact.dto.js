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
exports.CreateContactDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateContactDto {
    email;
    phone;
    message;
}
exports.CreateContactDto = CreateContactDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'user@example.com',
        description: 'Foydalanuvchi email manzili',
    }),
    (0, class_validator_1.IsEmail)({}, { message: 'Email noto‘g‘ri kiritilgan' }),
    __metadata("design:type", String)
], CreateContactDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: '+998901234567',
        description: 'Foydalanuvchi telefon raqami',
    }),
    (0, class_validator_1.IsPhoneNumber)('UZ', { message: 'Telefon raqam noto‘g‘ri' }),
    __metadata("design:type", String)
], CreateContactDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Salom, menga shifokor kerak.',
        description: 'Xabar matni',
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Xabar bo‘sh bo‘lishi mumkin emas' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(5, 1000, { message: 'Xabar uzunligi 5–1000 belgi orasida bo‘lishi kerak' }),
    __metadata("design:type", String)
], CreateContactDto.prototype, "message", void 0);
//# sourceMappingURL=create-contact.dto.js.map