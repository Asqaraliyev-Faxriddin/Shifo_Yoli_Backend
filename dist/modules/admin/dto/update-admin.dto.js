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
exports.UpdateProfileUserAdminDto = exports.SearchUserDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class SearchUserDto {
    firstName;
    lastName;
    email;
    ageFrom;
    ageTo;
    limit = 10;
    page = 1;
}
exports.SearchUserDto = SearchUserDto;
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: "Ism bo‘yicha qidirish", example: "Ali" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SearchUserDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: "Familiya bo‘yicha qidirish", example: "Valiyev" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SearchUserDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ required: false, description: "Email bo‘yicha qidirish", example: "user@example.com" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SearchUserDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ required: false, description: "Yosh bo‘yicha minimal filter", example: 18 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(170),
    __metadata("design:type", Number)
], SearchUserDto.prototype, "ageFrom", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ required: false, description: "Yosh bo‘yicha maksimal filter", example: 65 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(170),
    __metadata("design:type", Number)
], SearchUserDto.prototype, "ageTo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ required: false, description: "Har bir sahifada nechta yozuv bo‘lsin (limit)", example: 10, default: 10 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], SearchUserDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ required: false, description: "Nechinchi sahifa (1 dan boshlanadi)", example: 1, default: 1 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], SearchUserDto.prototype, "page", void 0);
class UpdateProfileUserAdminDto {
    firstName;
    lastName;
    age;
    month;
    day;
    phoneNumber;
    profileImg;
    password;
    email;
}
exports.UpdateProfileUserAdminDto = UpdateProfileUserAdminDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Foydalanuvchining ismi',
        example: 'Ali',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateProfileUserAdminDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Foydalanuvchining familiyasi',
        example: 'Valiyev',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateProfileUserAdminDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Foydalanuvchining roli',
        example: 'BUY',
        enum: ['BUY', 'SELL'],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Length)(1, 330),
    __metadata("design:type", Number)
], UpdateProfileUserAdminDto.prototype, "age", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsNumberString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.Length)(1, 12),
    __metadata("design:type", Number)
], UpdateProfileUserAdminDto.prototype, "month", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], UpdateProfileUserAdminDto.prototype, "day", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.ValidateIf)(o => o.phoneNumber !== '' && o.phoneNumber !== null && o.phoneNumber !== undefined),
    (0, class_validator_1.IsPhoneNumber)("UZ"),
    __metadata("design:type", String)
], UpdateProfileUserAdminDto.prototype, "phoneNumber", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({
        type: 'string',
        format: 'binary',
        description: 'Profil rasmi (faqat Swagger uchun)',
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], UpdateProfileUserAdminDto.prototype, "profileImg", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateProfileUserAdminDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], UpdateProfileUserAdminDto.prototype, "email", void 0);
//# sourceMappingURL=update-admin.dto.js.map