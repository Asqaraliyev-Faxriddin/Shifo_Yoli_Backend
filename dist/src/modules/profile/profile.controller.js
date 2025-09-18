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
exports.ProfileController = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("axios");
const FormData = require("form-data");
const platform_express_1 = require("@nestjs/platform-express");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const swagger_1 = require("@nestjs/swagger");
const profile_dto_1 = require("./dto/profile.dto");
const profile_service_1 = require("./profile.service");
const prisma_service_1 = require("../../core/prisma/prisma.service");
let ProfileController = class ProfileController {
    profileService;
    prisma;
    constructor(profileService, prisma) {
        this.profileService = profileService;
        this.prisma = prisma;
    }
    async updateProfile(req, dto, file) {
        const userId = req.user.id;
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new common_1.NotFoundException('Foydalanuvchi topilmadi');
        let uploadedUrl;
        if (file) {
            const form = new FormData();
            form.append('image', file.buffer.toString('base64'));
            const response = await axios_1.default.post(`https://api.imgbb.com/1/upload?key=7b80af0a58ffc5ed794b3d3955d402c0`, form, { headers: form.getHeaders() });
            uploadedUrl = response.data.data.url;
        }
        return this.prisma.user.update({
            where: { id: userId },
            data: {
                ...(dto.firstName && { firstName: dto.firstName }),
                ...(dto.lastName && { lastName: dto.lastName }),
                ...(dto.age && { age: dto.age }),
                ...(uploadedUrl && { profileImg: uploadedUrl }),
            },
        });
    }
    async updatePhone(req, body) {
        let user = req["user"];
        return this.profileService.updatePhone(user.id, body);
    }
    async updatePassword(req, payload) {
        let user = req["user"];
        return this.profileService.updatePassword(user.id, payload);
    }
    async getProfile(req) {
        let user = req["user"];
        return this.profileService.myProfile(user.id);
    }
    async deleteProfile(req) {
        let user = req["user"];
        return this.profileService.deleteProfile(user.id);
    }
};
exports.ProfileController = ProfileController;
__decorate([
    (0, common_1.Patch)('update'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('profileImg')),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                firstName: { type: 'string', example: 'Ali' },
                lastName: { type: 'string', example: 'Valiyev' },
                age: { type: 'number', },
                profileImg: { type: 'string', format: 'binary' },
            },
        },
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, profile_dto_1.UpdateProfileDto, Object]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.Post)("phone/update"),
    (0, swagger_1.ApiOperation)({ summary: "Telefon raqamni yangilash (OTP tekshiruv bilan)" }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Request, profile_dto_1.PhoneUpdateDto]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "updatePhone", null);
__decorate([
    (0, common_1.Put)("password/update"),
    (0, swagger_1.ApiOperation)({ summary: "Parolni yangilash" }),
    (0, swagger_1.ApiBody)({ type: profile_dto_1.UpdatePasswordDto }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Request, profile_dto_1.UpdatePasswordDto]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "updatePassword", null);
__decorate([
    (0, common_1.Get)("my/profile"),
    (0, swagger_1.ApiOperation)({ summary: "Foydalanuvchi profilini olish (self)" }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Request]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Delete)("delete/profile"),
    (0, swagger_1.ApiOperation)({ summary: "Foydalanuvchi profilini olish (self)" }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Request]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "deleteProfile", null);
exports.ProfileController = ProfileController = __decorate([
    (0, swagger_1.ApiTags)('Profile'),
    (0, common_1.Controller)('profile'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.AuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [profile_service_1.ProfileService, prisma_service_1.PrismaService])
], ProfileController);
//# sourceMappingURL=profile.controller.js.map