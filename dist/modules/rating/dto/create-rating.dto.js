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
exports.ReviewResponseDto = exports.UpdateReviewDto = exports.CreateReviewDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateReviewDto {
    doctorId;
    rating;
    comment;
}
exports.CreateReviewDto = CreateReviewDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Shifokorning ID si",
        example: "a3b5c8d2-7e44-4f38-9c77-12b34cd56789",
    }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateReviewDto.prototype, "doctorId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Baholash (1 dan 5 gacha)",
        example: 5,
        minimum: 1,
        maximum: 5,
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(5),
    __metadata("design:type", Number)
], CreateReviewDto.prototype, "rating", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Izoh (ixtiyoriy)",
        example: "Doktor juda e'tiborli va yaxshi maslahat berdi.",
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateReviewDto.prototype, "comment", void 0);
class UpdateReviewDto extends (0, swagger_1.PartialType)(CreateReviewDto) {
}
exports.UpdateReviewDto = UpdateReviewDto;
class ReviewResponseDto {
    id;
    userId;
    doctorId;
    rating;
    comment;
    createdAt;
    updatedAt;
}
exports.ReviewResponseDto = ReviewResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: "f1c2b3a4-5678-90ab-cdef-1234567890ab" }),
    __metadata("design:type", String)
], ReviewResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "u8d7s6a5-4321-90ab-cdef-0987654321ab" }),
    __metadata("design:type", String)
], ReviewResponseDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "d9f8e7c6-1234-56ab-cdef-654321abcdef" }),
    __metadata("design:type", String)
], ReviewResponseDto.prototype, "doctorId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 4 }),
    __metadata("design:type", Number)
], ReviewResponseDto.prototype, "rating", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "Doktor juda yordamchi bo‘ldi",
        nullable: true,
    }),
    __metadata("design:type", String)
], ReviewResponseDto.prototype, "comment", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "2025-09-18T12:34:56.000Z" }),
    __metadata("design:type", Date)
], ReviewResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "2025-09-18T13:45:01.000Z" }),
    __metadata("design:type", Date)
], ReviewResponseDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=create-rating.dto.js.map