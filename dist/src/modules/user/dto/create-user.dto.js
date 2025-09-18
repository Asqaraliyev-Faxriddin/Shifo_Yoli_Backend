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
exports.UpdateSellerPortfolioDto = exports.UpdateUserDto = exports.CreateBuyerDto = exports.CreateSellerDto = exports.CreateAdminDto = exports.UserType = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
var UserType;
(function (UserType) {
    UserType["BUY"] = "BUY";
    UserType["SELL"] = "SELL";
    UserType["ADMIN"] = "ADMIN";
})(UserType || (exports.UserType = UserType = {}));
class CreateAdminDto {
    firstName;
    lastName;
    email;
    password;
    profileImg;
}
exports.CreateAdminDto = CreateAdminDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Ali' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateAdminDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Valiyev' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateAdminDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'admin@example.com' }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreateAdminDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'strongPassword123' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(6),
    __metadata("design:type", String)
], CreateAdminDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: 'string',
        format: 'binary',
        description: 'Profil rasmi (optional, file sifatida yuboriladi)',
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateAdminDto.prototype, "profileImg", void 0);
class CreateSellerDto {
    firstName;
    lastName;
    email;
    password;
    profileImg;
}
exports.CreateSellerDto = CreateSellerDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Ali' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSellerDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Valiyev' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSellerDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'seller@example.com' }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreateSellerDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'sellerPassword123' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(6),
    __metadata("design:type", Object)
], CreateSellerDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: 'string',
        format: 'binary',
        description: 'Profil rasmi (optional, file sifatida yuboriladi)',
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateSellerDto.prototype, "profileImg", void 0);
class CreateBuyerDto {
    firstName;
    lastName;
    email;
    password;
    profileImg;
}
exports.CreateBuyerDto = CreateBuyerDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Ali' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBuyerDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Valiyev' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBuyerDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'buyer@example.com' }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreateBuyerDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'buyerPassword123' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(6),
    __metadata("design:type", Object)
], CreateBuyerDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: 'string',
        format: 'binary',
        description: 'Profil rasmi (optional, file sifatida yuboriladi)',
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateBuyerDto.prototype, "profileImg", void 0);
class UpdateUserDto {
    userId;
    firstName;
    lastName;
    role;
    email;
    profileImg;
    password;
}
exports.UpdateUserDto = UpdateUserDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'b3b1c2d4-5f6a-7b8c-9d0e-1f2a3b4c5d6e' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Ali' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Valiyev' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: UserType, example: UserType.SELL }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(UserType),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'user@example.com' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: 'string',
        format: 'binary',
        description: 'Profil rasmi (file sifatida upload qilinadi)',
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], UpdateUserDto.prototype, "profileImg", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'reeeeeeeer' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "password", void 0);
class UpdateSellerPortfolioDto {
    userId;
    email;
    profileImg;
}
exports.UpdateSellerPortfolioDto = UpdateSellerPortfolioDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'b3b1c2d4-5f6a-7b8c-9d0e-1f2a3b4c5d6e' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpdateSellerPortfolioDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'seller@example.com' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], UpdateSellerPortfolioDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'https://example.com/seller-portfolio.png' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateSellerPortfolioDto.prototype, "profileImg", void 0);
//# sourceMappingURL=create-user.dto.js.map