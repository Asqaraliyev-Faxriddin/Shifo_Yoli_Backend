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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoctorProfileController = void 0;
const common_1 = require("@nestjs/common");
const doctor_profile_service_1 = require("./doctor-profile.service");
const create_doctor_profile_dto_1 = require("./dto/create-doctor-profile.dto");
const swagger_1 = require("@nestjs/swagger");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const Roles_decorator_1 = require("../../common/decorators/Roles.decorator");
const client_1 = require("@prisma/client");
const update_doctor_profile_dto_1 = require("./dto/update-doctor-profile.dto");
let DoctorProfileController = class DoctorProfileController {
    doctorProfileService;
    constructor(doctorProfileService) {
        this.doctorProfileService = doctorProfileService;
    }
    static imageFileFilter = (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
            return cb(new common_1.BadRequestException('Faqat rasm fayllar qabul qilinadi!'), false);
        }
        cb(null, true);
    };
    static videoFileFilter = (req, file, cb) => {
        if (!file.mimetype.startsWith('video/')) {
            return cb(new common_1.BadRequestException('Faqat video fayllar qabul qilinadi!'), false);
        }
        cb(null, true);
    };
    async createProfile(userId, dto, files) {
        const images = (files?.images ?? []).map((f) => f?.filename ? `images/${f.filename}` : '');
        const videos = (files?.videos ?? []).map((f) => f?.filename ? `videos/${f.filename}` : '');
        return this.doctorProfileService.create(userId, dto, images, videos);
    }
    async updateProfile(id, dto, files) {
        const images = (files?.images ?? []).map((f) => f?.filename ? `images/${f.filename}` : '');
        const videos = (files?.videos ?? []).map((f) => f?.filename ? `videos/${f.filename}` : '');
        const docs = (files?.files ?? []).map((f) => f?.filename ? `files/${f.filename}` : '');
        return this.doctorProfileService.update(id, dto, images, videos, docs);
    }
    async createProfileDoctor(req, dto, files) {
        const images = (files?.images ?? []).map((f) => f?.filename ? `images/${f.filename}` : '');
        const videos = (files?.videos ?? []).map((f) => f?.filename ? `videos/${f.filename}` : '');
        return this.doctorProfileService.create(req.user.id, dto, images, videos);
    }
    async updateProfileDoctor(req, dto, files) {
        const images = (files?.images ?? []).map((f) => f?.filename ? `images/${f.filename}` : '');
        const videos = (files?.videos ?? []).map((f) => f?.filename ? `videos/${f.filename}` : '');
        const docs = (files?.files ?? []).map((f) => f?.filename ? `files/${f.filename}` : '');
        return this.doctorProfileService.update(req.user.id, dto, images, videos, docs);
    }
    async addImage(id, file) {
        const dto = { image: file?.filename ? `images/${file.filename}` : "" };
        return this.doctorProfileService.addImage(id, dto);
    }
    async addVideo(id, file) {
        const dto = { video: file?.filename ? `videos/${file.filename}` : "" };
        return this.doctorProfileService.addVideo(id, dto);
    }
    async removeImage(id, dto) {
        return this.doctorProfileService.removeImage(id, dto);
    }
    async removeVideo(id, dto) {
        return this.doctorProfileService.removeVideo(id, dto);
    }
    async DoctorProfiles(query) {
        return this.doctorProfileService.DoctorProfiles(query);
    }
};
exports.DoctorProfileController = DoctorProfileController;
__decorate([
    (0, common_1.Post)('create/:userId'),
    (0, swagger_1.ApiOperation)({ summary: 'Doctor profili yaratish (Admin)' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([
        {
            name: 'images',
            maxCount: 10,
        },
        {
            name: 'videos',
            maxCount: 5,
        },
    ], {
        storage: (0, multer_1.diskStorage)({
            destination: (req, file, cb) => {
                if (file.fieldname === 'images')
                    cb(null, './uploads/images');
                else if (file.fieldname === 'videos')
                    cb(null, './uploads/videos');
            },
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                cb(null, `${file.fieldname}-${uniqueSuffix}${(0, path_1.extname)(file.originalname)}`);
            },
        }),
        fileFilter: (req, file, cb) => {
            if (file.fieldname === 'images') {
                if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
                    return cb(new common_1.UnsupportedMediaTypeException('Faqat rasm fayllar yuklash mumkin'), false);
                }
            }
            if (file.fieldname === 'videos') {
                if (!file.mimetype.match(/\/(mp4|avi|mov|mkv)$/)) {
                    return cb(new common_1.UnsupportedMediaTypeException('Faqat video fayllar yuklash mumkin'), false);
                }
            }
            cb(null, true);
        },
        limits: { fileSize: 150 * 1024 * 1024 },
    })),
    (0, common_1.UseGuards)(jwt_auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    (0, Roles_decorator_1.Roles)(client_1.UserRole.ADMIN, client_1.UserRole.SUPERADMIN),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_doctor_profile_dto_1.CreateDoctorProfileDto, Object]),
    __metadata("design:returntype", Promise)
], DoctorProfileController.prototype, "createProfile", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    (0, Roles_decorator_1.Roles)(client_1.UserRole.SUPERADMIN, client_1.UserRole.ADMIN),
    (0, common_1.Patch)('update/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Doctor profilini yangilash (Admin)' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([
        { name: 'images', maxCount: 10 },
        { name: 'videos', maxCount: 5 },
        { name: 'files', maxCount: 3 },
    ], {
        storage: (0, multer_1.diskStorage)({
            destination: (req, file, cb) => {
                if (file.fieldname === 'images')
                    cb(null, './uploads/images');
                else if (file.fieldname === 'videos')
                    cb(null, './uploads/videos');
                else if (file.fieldname === 'files')
                    cb(null, './uploads/files');
            },
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                cb(null, `${file.fieldname}-${uniqueSuffix}${(0, path_1.extname)(file.originalname)}`);
            },
        }),
        fileFilter: (req, file, cb) => {
            if (file.fieldname === 'images') {
                if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
                    return cb(new common_1.UnsupportedMediaTypeException('Faqat rasm fayllar yuklash mumkin'), false);
                }
            }
            else if (file.fieldname === 'videos') {
                if (!file.mimetype.match(/\/(mp4|avi|mov|mkv)$/)) {
                    return cb(new common_1.UnsupportedMediaTypeException('Faqat video fayllar yuklash mumkin'), false);
                }
            }
            else if (file.fieldname === 'files') {
                if (!file.mimetype.match(/\/(pdf|docx?|txt)$/)) {
                    return cb(new common_1.UnsupportedMediaTypeException('Faqat hujjat fayllar yuklash mumkin (pdf, docx, txt)'), false);
                }
            }
            cb(null, true);
        },
        limits: { fileSize: 150 * 1024 * 1024 },
    })),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_doctor_profile_dto_1.UpdateDoctorProfileDto, Object]),
    __metadata("design:returntype", Promise)
], DoctorProfileController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.Post)('create/doctor'),
    (0, swagger_1.ApiOperation)({ summary: 'Doctor profili yaratish (Admin)' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([
        {
            name: 'images',
            maxCount: 10,
        },
        {
            name: 'videos',
            maxCount: 5,
        },
    ], {
        storage: (0, multer_1.diskStorage)({
            destination: (req, file, cb) => {
                if (file.fieldname === 'images')
                    cb(null, './uploads/images');
                else if (file.fieldname === 'videos')
                    cb(null, './uploads/videos');
            },
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                cb(null, `${file.fieldname}-${uniqueSuffix}${(0, path_1.extname)(file.originalname)}`);
            },
        }),
        fileFilter: (req, file, cb) => {
            if (file.fieldname === 'images') {
                if (!file.mimetype.match(/image\/(jpg|jpeg|png|gif|webp)$/)) {
                    return cb(new common_1.UnsupportedMediaTypeException('Faqat rasm fayllar yuklash mumkin'), false);
                }
            }
            if (file.fieldname === 'videos') {
                if (!file.mimetype.match(/\/(mp4|avi|mov|mkv)$/)) {
                    return cb(new common_1.UnsupportedMediaTypeException('Faqat video fayllar yuklash mumkin'), false);
                }
            }
            cb(null, true);
        },
        limits: { fileSize: 150 * 1024 * 1024 },
    })),
    (0, common_1.UseGuards)(jwt_auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    (0, Roles_decorator_1.Roles)(client_1.UserRole.ADMIN, client_1.UserRole.SUPERADMIN),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_doctor_profile_dto_1.CreateDoctorProfileDto, Object]),
    __metadata("design:returntype", Promise)
], DoctorProfileController.prototype, "createProfileDoctor", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    (0, Roles_decorator_1.Roles)(client_1.UserRole.SUPERADMIN, client_1.UserRole.DOCTOR, client_1.UserRole.ADMIN),
    (0, common_1.Patch)('update/doctor/profile'),
    (0, swagger_1.ApiOperation)({ summary: 'Doctor profilini yangilash (Admin)' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([
        { name: 'images', maxCount: 10 },
        { name: 'videos', maxCount: 5 },
        { name: 'files', maxCount: 3 },
    ], {
        storage: (0, multer_1.diskStorage)({
            destination: (req, file, cb) => {
                if (file.fieldname === 'images')
                    cb(null, './uploads/images');
                else if (file.fieldname === 'videos')
                    cb(null, './uploads/videos');
                else if (file.fieldname === 'files')
                    cb(null, './uploads/files');
            },
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                cb(null, `${file.fieldname}-${uniqueSuffix}${(0, path_1.extname)(file.originalname)}`);
            },
        }),
        fileFilter: (req, file, cb) => {
            if (file.fieldname === 'images') {
                if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
                    return cb(new common_1.UnsupportedMediaTypeException('Faqat rasm fayllar yuklash mumkin'), false);
                }
            }
            else if (file.fieldname === 'videos') {
                if (!file.mimetype.match(/\/(mp4|avi|mov|mkv)$/)) {
                    return cb(new common_1.UnsupportedMediaTypeException('Faqat video fayllar yuklash mumkin'), false);
                }
            }
            else if (file.fieldname === 'files') {
                if (!file.mimetype.match(/\/(pdf|docx?|txt)$/)) {
                    return cb(new common_1.UnsupportedMediaTypeException('Faqat hujjat fayllar yuklash mumkin (pdf, docx, txt)'), false);
                }
            }
            cb(null, true);
        },
        limits: { fileSize: 150 * 1024 * 1024 },
    })),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_doctor_profile_dto_1.UpdateDoctorProfileDto, Object]),
    __metadata("design:returntype", Promise)
], DoctorProfileController.prototype, "updateProfileDoctor", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    (0, Roles_decorator_1.Roles)(client_1.UserRole.DOCTOR, client_1.UserRole.ADMIN, client_1.UserRole.SUPERADMIN),
    (0, common_1.Post)('add-image/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Profilga rasm qo‘shish' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image', {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads/images',
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                cb(null, `${file.fieldname}-${uniqueSuffix}${(0, path_1.extname)(file.originalname)}`);
            },
        }),
        fileFilter: DoctorProfileController.imageFileFilter,
        limits: { fileSize: 10 * 1024 * 1024 },
    })),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], DoctorProfileController.prototype, "addImage", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    (0, Roles_decorator_1.Roles)(client_1.UserRole.DOCTOR, client_1.UserRole.ADMIN, client_1.UserRole.SUPERADMIN),
    (0, common_1.Post)('add-video/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Profilga video qo‘shish' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('video', {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads/videos',
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                cb(null, `${file.fieldname}-${uniqueSuffix}${(0, path_1.extname)(file.originalname)}`);
            },
        }),
        fileFilter: DoctorProfileController.videoFileFilter,
        limits: { fileSize: 100 * 1024 * 1024 },
    })),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], DoctorProfileController.prototype, "addVideo", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    (0, Roles_decorator_1.Roles)(client_1.UserRole.DOCTOR, client_1.UserRole.ADMIN, client_1.UserRole.SUPERADMIN),
    (0, common_1.Delete)('remove-image/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Profil rasmini o‘chirish' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_doctor_profile_dto_1.RemoveImageDto]),
    __metadata("design:returntype", Promise)
], DoctorProfileController.prototype, "removeImage", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    (0, Roles_decorator_1.Roles)(client_1.UserRole.DOCTOR, client_1.UserRole.ADMIN, client_1.UserRole.SUPERADMIN),
    (0, common_1.Delete)('remove-video/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Profil videosini o‘chirish' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_doctor_profile_dto_1.RemoveVideoDto]),
    __metadata("design:returntype", Promise)
], DoctorProfileController.prototype, "removeVideo", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Doctor profillarni qidirish va olish' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Doctor profillar muvaffaqiyatli olindi',
        schema: {
            example: {
                success: true,
                message: 'Doctor profiles muvaffaqiyatli topildi',
                total: 25,
                page: 1,
                limit: 10,
                data: [
                    {
                        id: 'uuid',
                        bio: 'Experienced cardiologist',
                        published: true,
                        createdAt: '2025-10-02T12:00:00.000Z',
                        updatedAt: '2025-10-02T12:00:00.000Z',
                        category: {
                            id: 'uuid',
                            name: 'Cardiology',
                            img: 'category.png',
                        },
                        doctor: {
                            id: 'uuid',
                            email: 'doctor@example.com',
                            firstName: 'Ali',
                            lastName: 'Valiyev',
                            age: 35,
                            phoneNumber: '+998901234567',
                            role: 'DOCTOR',
                            profileImg: 'doctor.png',
                            isActive: true,
                            createdAt: '2025-10-02T12:00:00.000Z',
                            updatedAt: '2025-10-02T12:00:00.000Z',
                        },
                    },
                ],
            },
        },
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_doctor_profile_dto_1.FindDoctorProfilesDto]),
    __metadata("design:returntype", Promise)
], DoctorProfileController.prototype, "DoctorProfiles", null);
exports.DoctorProfileController = DoctorProfileController = __decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiTags)('Doctor Profile'),
    (0, common_1.Controller)('doctor-profile'),
    __metadata("design:paramtypes", [doctor_profile_service_1.DoctorProfileService])
], DoctorProfileController);
//# sourceMappingURL=doctor-profile.controller.js.map