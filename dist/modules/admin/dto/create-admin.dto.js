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
exports.UserUnBlokDto = exports.UserBlok = exports.BlokUnDevice = exports.BlockDeviceDto = exports.MassPaymentDto2 = exports.NotificationAll = exports.MassPaymentDto = exports.UserPaymentDto = exports.BroadcastNotificationDto = exports.SendNotificationDto = exports.SearchUserDto = exports.UnblockUserDto = exports.BlockUserDto = exports.DeleteUserDto = exports.UpdateUserDto = exports.CreatePatientDto = exports.CreateDoctorDto = exports.CreateAdminDto = exports.BaseUserDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const client_1 = require("@prisma/client");
class BaseUserDto {
    email;
    firstName;
    lastName;
    password;
    age;
    profileImg;
}
exports.BaseUserDto = BaseUserDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Foydalanuvchi email manzili", example: "user@example.com" }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], BaseUserDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Foydalanuvchi ismi", example: "Ali" }),
    (0, class_validator_1.IsString)(),
    (0, class_transformer_1.Type)(() => String),
    __metadata("design:type", String)
], BaseUserDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Foydalanuvchi familiyasi", example: "Valiyev" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BaseUserDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Parol", example: "StrongPass123" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BaseUserDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Yoshi", example: 25, minimum: 1, maximum: 170 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], BaseUserDto.prototype, "age", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: "string", format: "binary", required: false, description: "Profil rasmi" }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], BaseUserDto.prototype, "profileImg", void 0);
class CreateAdminDto {
    email;
    password;
    lastName;
    firstName;
    age;
    profileImg;
}
exports.CreateAdminDto = CreateAdminDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "@example.com",
        description: "Foydalanuvchining telefon raqami, +998 bilan boshlanishi kerak",
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateAdminDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "superPassword123",
        minLength: 8,
        maxLength: 16,
        description: "Foydalanuvchining paroli, 8-16 ta belgidan iborat bo'lishi kerak",
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(8, 16),
    __metadata("design:type", String)
], CreateAdminDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "Azamjon Faxriddinov",
        minLength: 5,
        maxLength: 50,
        description: "Foydalanuvchining to'liq ismi",
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Length)(5, 50),
    __metadata("design:type", String)
], CreateAdminDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "Azamjon Faxriddinov",
        minLength: 5,
        maxLength: 50,
        description: "Foydalanuvchining to'liq ismi",
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Length)(5, 50),
    __metadata("design:type", String)
], CreateAdminDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], CreateAdminDto.prototype, "age", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: "string", format: "binary", required: false, description: "Profil rasmi" }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateAdminDto.prototype, "profileImg", void 0);
class CreateDoctorDto {
    email;
    password;
    firstName;
    lastName;
    age;
    profileImg;
    categoryId;
    bio;
    dailySalary;
    images;
    videos;
}
exports.CreateDoctorDto = CreateDoctorDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: "doctor@example.com" }),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateDoctorDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "superPassword123", minLength: 8, maxLength: 16 }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(8, 16),
    __metadata("design:type", String)
], CreateDoctorDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Azamjon", minLength: 2, maxLength: 50 }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateDoctorDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Faxriddinov", minLength: 2, maxLength: 50 }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateDoctorDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateDoctorDto.prototype, "age", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: "string", format: "binary", description: "Profil rasmi" }),
    __metadata("design:type", String)
], CreateDoctorDto.prototype, "profileImg", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Kategoriya ID", example: "uuid-category" }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateDoctorDto.prototype, "categoryId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Doktor biografiyasi" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDoctorDto.prototype, "bio", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Kunlik maosh", example: 100000 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateDoctorDto.prototype, "dailySalary", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [String], description: "Doktor rasmlari URL array" }),
    __metadata("design:type", Object)
], CreateDoctorDto.prototype, "images", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [String], description: "Doktor videolari URL array" }),
    __metadata("design:type", Object)
], CreateDoctorDto.prototype, "videos", void 0);
class CreatePatientDto {
    email;
    password;
    lastName;
    firstName;
    age;
    profileImg;
}
exports.CreatePatientDto = CreatePatientDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "@example.com",
        description: "Foydalanuvchining telefon raqami, +998 bilan boshlanishi kerak",
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "superPassword123",
        minLength: 8,
        maxLength: 16,
        description: "Foydalanuvchining paroli, 8-16 ta belgidan iborat bo'lishi kerak",
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(8, 16),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "Azamjon Faxriddinov",
        minLength: 5,
        maxLength: 50,
        description: "Foydalanuvchining to'liq ismi",
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Length)(5, 50),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "Azamjon Faxriddinov",
        minLength: 5,
        maxLength: 50,
        description: "Foydalanuvchining to'liq ismi",
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Length)(5, 50),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], CreatePatientDto.prototype, "age", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: "string", format: "binary", required: false, description: "Profil rasmi" }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreatePatientDto.prototype, "profileImg", void 0);
class UpdateUserDto {
    email;
    password;
    lastName;
    firstName;
    age;
    profileImg;
    phoneNumber;
    day;
    month;
}
exports.UpdateUserDto = UpdateUserDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: "@example.com",
        description: "Foydalanuvchining telefon raqami, +998 bilan boshlanishi kerak",
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: "superPassword123",
        minLength: 8,
        maxLength: 16,
        description: "Foydalanuvchining paroli, 8-16 ta belgidan iborat bo'lishi kerak",
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Length)(8, 16),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: "Azamjon Faxriddinov",
        minLength: 5,
        maxLength: 50,
        description: "Foydalanuvchining to'liq ismi",
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(5, 50),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: "Azamjon Faxriddinov",
        minLength: 5,
        maxLength: 50,
        description: "Foydalanuvchining to'liq ismi",
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Length)(5, 50),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateUserDto.prototype, "age", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: "string", format: "binary", required: false, description: "Profil rasmi" }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], UpdateUserDto.prototype, "profileImg", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "phoneNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateUserDto.prototype, "day", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateUserDto.prototype, "month", void 0);
class DeleteUserDto {
    userId;
}
exports.DeleteUserDto = DeleteUserDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: "O‘chiriladigan user ID" }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], DeleteUserDto.prototype, "userId", void 0);
class BlockUserDto {
    userId;
    reason;
}
exports.BlockUserDto = BlockUserDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Block qilinadigan user ID" }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], BlockUserDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: "Block sababi", example: "Qoidabuzarlik" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BlockUserDto.prototype, "reason", void 0);
class UnblockUserDto {
    userId;
}
exports.UnblockUserDto = UnblockUserDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Unblock qilinadigan user ID" }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], UnblockUserDto.prototype, "userId", void 0);
class SearchUserDto {
    firstName;
    lastName;
    email;
    ageFrom;
    ageTo;
    categoryId;
    limit = 10;
    page = 1;
}
exports.SearchUserDto = SearchUserDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: "Ism bo‘yicha qidirish", example: "Ali" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SearchUserDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: "Familiya bo‘yicha qidirish", example: "Valiyev" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SearchUserDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: "Email bo‘yicha qidirish", example: "user@example.com" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SearchUserDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: "Minimal yosh filteri", example: 18 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], SearchUserDto.prototype, "ageFrom", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: "Maksimal yosh filteri", example: 65 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], SearchUserDto.prototype, "ageTo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: "Kategoriya ID bo‘yicha qidirish (faqat doktorlar uchun)", example: "uuid-category" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], SearchUserDto.prototype, "categoryId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: "Limit", example: 10, default: 10 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], SearchUserDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: "Sahifa raqami", example: 1, default: 1 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], SearchUserDto.prototype, "page", void 0);
class SendNotificationDto {
    userId;
    message;
    title;
}
exports.SendNotificationDto = SendNotificationDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: "uuid-user" }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], SendNotificationDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Xabar matni" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SendNotificationDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Xabar matni" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SendNotificationDto.prototype, "title", void 0);
class BroadcastNotificationDto {
    message;
    title;
}
exports.BroadcastNotificationDto = BroadcastNotificationDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Umumiy xabar matni" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BroadcastNotificationDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Umumiy xabar sarlavhasi" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BroadcastNotificationDto.prototype, "title", void 0);
class UserPaymentDto {
    userId;
    amount;
}
exports.UserPaymentDto = UserPaymentDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: "User ID", example: "uuid-user" }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], UserPaymentDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Miqdor", example: 10000 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UserPaymentDto.prototype, "amount", void 0);
class MassPaymentDto {
    role;
    amount;
    message;
    title;
}
exports.MassPaymentDto = MassPaymentDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ["BEMOR", "DOCTOR", "ADMIN"], example: "DOCTOR" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsEnum)(client_1.UserRole),
    __metadata("design:type", String)
], MassPaymentDto.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 50000 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], MassPaymentDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Umumiy xabar matni" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], MassPaymentDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Umumiy xabar sarlavhasi" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], MassPaymentDto.prototype, "title", void 0);
class NotificationAll {
    role;
    message;
    title;
}
exports.NotificationAll = NotificationAll;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ["BEMOR", "DOCTOR", "ADMIN"], example: "DOCTOR" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsEnum)(client_1.UserRole),
    __metadata("design:type", String)
], NotificationAll.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Umumiy xabar matni" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], NotificationAll.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Umumiy xabar sarlavhasi" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], NotificationAll.prototype, "title", void 0);
class MassPaymentDto2 {
    role;
    amount;
    message;
    title;
}
exports.MassPaymentDto2 = MassPaymentDto2;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ["BEMOR", "DOCTOR", "ADMIN"], example: "DOCTOR" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsEnum)(client_1.UserRole),
    __metadata("design:type", String)
], MassPaymentDto2.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: -50000, description: "Foydalanuvchi hisobidan ayriladigan pul (manfiy son)" }),
    (0, class_validator_1.IsNumber)({}, { message: "Amount faqat son bo'lishi kerak" }),
    (0, class_validator_1.Min)(-Infinity, { message: "Amount manfiy bo'lishi kerak" }),
    (0, class_transformer_1.Transform)(({ value }) => Number(value)),
    __metadata("design:type", Number)
], MassPaymentDto2.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Umumiy xabar matni" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], MassPaymentDto2.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Umumiy xabar sarlavhasi" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], MassPaymentDto2.prototype, "title", void 0);
class BlockDeviceDto {
    deviceId;
    reason;
}
exports.BlockDeviceDto = BlockDeviceDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Device ID", example: "uuid-device" }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], BlockDeviceDto.prototype, "deviceId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: "Block sababi", example: "Qoidabuzarlik" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BlockDeviceDto.prototype, "reason", void 0);
class BlokUnDevice {
    deviceId;
}
exports.BlokUnDevice = BlokUnDevice;
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Device ID", example: "uuid-device" }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], BlokUnDevice.prototype, "deviceId", void 0);
class UserBlok {
    userId;
    reason;
}
exports.UserBlok = UserBlok;
__decorate([
    (0, swagger_1.ApiProperty)({ description: "User ID", example: "uuid-user" }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], UserBlok.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: "Block sababi", example: "Qoidabuzarlik" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UserBlok.prototype, "reason", void 0);
class UserUnBlokDto {
    userId;
}
exports.UserUnBlokDto = UserUnBlokDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: "User ID", example: "uuid-user" }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], UserUnBlokDto.prototype, "userId", void 0);
//# sourceMappingURL=create-admin.dto.js.map