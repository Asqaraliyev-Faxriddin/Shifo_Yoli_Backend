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
exports.CreatePatientDto = exports.CreateDoctorDto = exports.UnblockUserDto = exports.BlockUserDto = exports.UpdateBemorDto = exports.UpdateDoctorDto = exports.UpdateAdminDto = exports.CreateBemorDto = exports.CreateAdminDto = exports.BaseUserDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
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
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], BaseUserDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BaseUserDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BaseUserDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BaseUserDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(170),
    __metadata("design:type", Number)
], BaseUserDto.prototype, "age", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: "string",
        format: "binary",
        required: false,
        description: "Profil rasmi (fayl sifatida yuboriladi)",
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], BaseUserDto.prototype, "profileImg", void 0);
class CreateAdminDto extends BaseUserDto {
}
exports.CreateAdminDto = CreateAdminDto;
class CreateBemorDto extends BaseUserDto {
}
exports.CreateBemorDto = CreateBemorDto;
class UpdateAdminDto {
    firstName;
    lastName;
    password;
    age;
    profileImg;
}
exports.UpdateAdminDto = UpdateAdminDto;
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateAdminDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateAdminDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateAdminDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(120),
    __metadata("design:type", Number)
], UpdateAdminDto.prototype, "age", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: "string",
        format: "binary",
        required: false,
        description: "Profil rasmi (fayl sifatida yuboriladi)",
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], UpdateAdminDto.prototype, "profileImg", void 0);
class UpdateDoctorDto extends UpdateAdminDto {
}
exports.UpdateDoctorDto = UpdateDoctorDto;
class UpdateBemorDto extends UpdateAdminDto {
}
exports.UpdateBemorDto = UpdateBemorDto;
class BlockUserDto {
    userId;
    reason;
}
exports.BlockUserDto = BlockUserDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Block qilinadigan user ID (UUID)" }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], BlockUserDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: "Block sababi" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BlockUserDto.prototype, "reason", void 0);
class UnblockUserDto {
    userId;
}
exports.UnblockUserDto = UnblockUserDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Unblock qilinadigan user ID (UUID)" }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], UnblockUserDto.prototype, "userId", void 0);
class CreateDoctorDto {
    email;
    firstName;
    lastName;
    password;
    age;
    categoryId;
    bio;
    salary;
    images;
    videos;
}
exports.CreateDoctorDto = CreateDoctorDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: "doctor@example.com" }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreateDoctorDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Ali" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateDoctorDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Valiyev" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateDoctorDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "StrongPassword123" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateDoctorDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 35 }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(170),
    __metadata("design:type", Number)
], CreateDoctorDto.prototype, "age", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "category-uuid", description: "Shifokor malakasi ID" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDoctorDto.prototype, "categoryId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "Men 10 yillik kardiologman...",
        description: "Shifokor bio (faqat bitta til, tizim o‘zi translate qiladi)",
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDoctorDto.prototype, "bio", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 2000.0, description: "Maoshi", required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateDoctorDto.prototype, "salary", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: ["img1.jpg", "img2.png"],
        description: "Shifokor suratlari",
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateDoctorDto.prototype, "images", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: ["video1.mp4", "video2.mp4"],
        description: "Shifokor videolari",
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateDoctorDto.prototype, "videos", void 0);
class CreatePatientDto {
    email;
    firstName;
    lastName;
    password;
    age;
}
exports.CreatePatientDto = CreatePatientDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: "patient@example.com" }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Ali" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Valiyev" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "StrongPassword123" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 25 }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(170),
    __metadata("design:type", Number)
], CreatePatientDto.prototype, "age", void 0);
//# sourceMappingURL=create-admin.dto.js.map