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
exports.DoctorProfileDto = exports.RemoveImageDto = exports.AddImageDto = exports.RemoveVideoDto = exports.AddVideoDto = exports.UpdateDoctorProfileDto = exports.CreateDoctorProfileDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class CreateDoctorProfileDto {
    bio;
    dailySalary;
    free;
    categoryId;
    images;
    videos;
    futures;
}
exports.CreateDoctorProfileDto = CreateDoctorProfileDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Doktorning bio (uz)',
        example: 'Men 10 yillik tajribaga ega shifokorman.',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDoctorProfileDto.prototype, "bio", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Kunlik maosh (faqat bitta salary)',
        example: 150000,
    }),
    (0, class_validator_1.ValidateIf)((o) => o.free === false || o.free === undefined),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateDoctorProfileDto.prototype, "dailySalary", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Doctor bepulmi?',
        example: false,
        default: false,
    }),
    (0, class_validator_1.ValidateIf)((o) => o.dailySalary === undefined),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateDoctorProfileDto.prototype, "free", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'DoctorCategory ID (kategoriya)',
        example: '7b6e3f0c-7c56-4e59-9c2c-123456789abc',
    }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateDoctorProfileDto.prototype, "categoryId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Rasmlar (multipart/form-data file array)',
        type: 'array',
        items: { type: 'string', format: 'binary' },
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateDoctorProfileDto.prototype, "images", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Videolar (multipart/form-data file array)',
        type: 'array',
        items: { type: 'string', format: 'binary' },
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateDoctorProfileDto.prototype, "videos", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: "Shifokorning kelajakdagi imkoniyatlari yoki qo‘shimcha malakalari",
        example: ['Nevrologiya bo‘yicha kurs', 'Yuqori toifadagi sertifikat'],
        isArray: true,
        type: String,
    }),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' ? value.split(',').map(v => v.trim()) : value),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateDoctorProfileDto.prototype, "futures", void 0);
class UpdateDoctorProfileDto {
    bio;
    dailySalary;
    free;
    categoryId;
    images;
    videos;
    files;
    futures;
}
exports.UpdateDoctorProfileDto = UpdateDoctorProfileDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Doktorning bio (uz)',
        example: 'Men 10 yillik tajribaga ega shifokorman.',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateDoctorProfileDto.prototype, "bio", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Kunlik maosh (faqat bitta salary)',
        example: 150000,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateIf)((o) => o.free === false || o.free === undefined),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateDoctorProfileDto.prototype, "dailySalary", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Doctor bepulmi?',
        example: false,
        default: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateIf)((o) => o.dailySalary === undefined),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateDoctorProfileDto.prototype, "free", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'DoctorCategory ID (kategoriya)',
        example: '7b6e3f0c-7c56-4e59-9c2c-123456789abc',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateIf)((o) => o.categoryId !== ''),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(36, 36),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], UpdateDoctorProfileDto.prototype, "categoryId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Rasmlar (multipart/form-data file array)',
        type: 'array',
        items: { type: 'string', format: 'binary' },
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], UpdateDoctorProfileDto.prototype, "images", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Videolar (multipart/form-data file array)',
        type: 'array',
        items: { type: 'string', format: 'binary' },
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], UpdateDoctorProfileDto.prototype, "videos", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filelar (multipart/form-data file array)',
        type: 'array',
        items: { type: 'string', format: 'binary' },
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], UpdateDoctorProfileDto.prototype, "files", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: "Shifokorning kelajakdagi imkoniyatlari yoki qo‘shimcha malakalari",
        example: ['Nevrologiya bo‘yicha kurs', 'Yuqori toifadagi sertifikat'],
        isArray: true,
        type: String,
    }),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' ? value.split(',').map(v => v.trim()) : value),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], UpdateDoctorProfileDto.prototype, "futures", void 0);
class AddVideoDto {
    video;
}
exports.AddVideoDto = AddVideoDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Yangi qo‘shiladigan video fayl nomi yoki URL',
        example: 'video3.mp4',
    }),
    __metadata("design:type", Object)
], AddVideoDto.prototype, "video", void 0);
class RemoveVideoDto {
    video;
}
exports.RemoveVideoDto = RemoveVideoDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'O‘chiriladigan video fayl nomi yoki URL',
        example: 'video1.mp4',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RemoveVideoDto.prototype, "video", void 0);
class AddImageDto {
    image;
}
exports.AddImageDto = AddImageDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Yangi qo‘shiladigan rasm fayl nomi yoki URL',
        example: 'image3.png',
    }),
    __metadata("design:type", Object)
], AddImageDto.prototype, "image", void 0);
class RemoveImageDto {
    image;
}
exports.RemoveImageDto = RemoveImageDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'O‘chiriladigan rasm fayl nomi yoki URL',
        example: 'image1.png',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RemoveImageDto.prototype, "image", void 0);
class DoctorProfileDto {
    name;
    limit;
    offset;
    doctorId;
    firstName;
    lastName;
}
exports.DoctorProfileDto = DoctorProfileDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: "Kategoriya nomi bo'yicha filter" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Length)(3, 50),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], DoctorProfileDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: "Sahifa bo'yicha limit", example: 10 }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], DoctorProfileDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: "Sahifa bo'yicha offset", example: 0 }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], DoctorProfileDto.prototype, "offset", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: "Shifokor ID bo'yicha filter" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], DoctorProfileDto.prototype, "doctorId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], DoctorProfileDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], DoctorProfileDto.prototype, "lastName", void 0);
//# sourceMappingURL=create-doctor-profile.dto.js.map