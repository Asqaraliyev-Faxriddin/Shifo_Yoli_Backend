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
exports.UploadController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const Roles_decorator_1 = require("../../common/decorators/Roles.decorator");
const swagger_1 = require("@nestjs/swagger");
const fs_1 = require("fs");
let UploadController = class UploadController {
    uploadDir = (0, path_1.join)(process.cwd(), 'uploads', 'chat');
    constructor() {
        fs_1.promises.mkdir(this.uploadDir, { recursive: true }).catch(err => {
            console.error('Upload papkasini yaratishda xatolik:', err);
        });
    }
    async uploadFile(file) {
        if (!file) {
            throw new common_1.HttpException('Fayl yuklanmadi', common_1.HttpStatus.BAD_REQUEST);
        }
        const url = `https://faxriddin.bobur-dev.uz/uploads/chat/${file.filename}`;
        return { filename: file.filename, url };
    }
    async removeFile(filename) {
        const filePath = (0, path_1.join)(this.uploadDir, filename);
        try {
            await fs_1.promises.access(filePath);
            await fs_1.promises.unlink(filePath);
            return { message: 'Fayl muvaffaqiyatli o‘chirildi' };
        }
        catch (err) {
            throw new common_1.HttpException('Fayl topilmadi', common_1.HttpStatus.NOT_FOUND);
        }
    }
};
exports.UploadController = UploadController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Fayl upload qilish' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Fayl muvaffaqiyatli yuklandi' }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.diskStorage)({
            destination: (req, file, cb) => {
                cb(null, (0, path_1.join)(process.cwd(), 'uploads', 'chat'));
            },
            filename: (req, file, cb) => {
                const randomName = Date.now() + '-' + Math.round(Math.random() * 1e9);
                const fileExt = (0, path_1.extname)(file.originalname);
                cb(null, `${randomName}${fileExt}`);
            },
        }),
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "uploadFile", null);
__decorate([
    (0, common_1.Delete)(':filename'),
    (0, swagger_1.ApiOperation)({ summary: 'Faylni o‘chirish' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Fayl muvaffaqiyatli o‘chirildi' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Fayl topilmadi' }),
    __param(0, (0, common_1.Param)('filename')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "removeFile", null);
exports.UploadController = UploadController = __decorate([
    (0, swagger_1.ApiTags)('Upload'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    (0, Roles_decorator_1.Roles)('ADMIN', 'SUPERADMIN'),
    (0, common_1.Controller)('upload'),
    __metadata("design:paramtypes", [])
], UploadController);
//# sourceMappingURL=upload.controller.js.map