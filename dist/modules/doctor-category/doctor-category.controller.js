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
exports.DoctorCategoryController = void 0;
const common_1 = require("@nestjs/common");
const doctor_category_service_1 = require("./doctor-category.service");
const create_doctor_category_dto_1 = require("./dto/create-doctor-category.dto");
const platform_express_1 = require("@nestjs/platform-express");
const axios_1 = require("axios");
const FormData = require("form-data");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const Roles_decorator_1 = require("../../common/decorators/Roles.decorator");
let DoctorCategoryController = class DoctorCategoryController {
    service;
    constructor(service) {
        this.service = service;
    }
    async create(dto, file) {
        let imgUrl;
        if (file) {
            const form = new FormData();
            form.append('image', file.buffer.toString('base64'));
            const response = await axios_1.default.post(`https://api.imgbb.com/1/upload?key=7b80af0a58ffc5ed794b3d3955d402c0`, form, { headers: form.getHeaders() });
            imgUrl = response.data.data.url;
        }
        return this.service.create(dto, imgUrl);
    }
    async findAll(query) {
        return this.service.findAll(query);
    }
    async findOne(id) {
        return this.service.findOne(id);
    }
    async update(id, dto, file) {
        let imgUrl;
        if (file) {
            const form = new FormData();
            form.append('image', file.buffer.toString('base64'));
            const response = await axios_1.default.post(`https://api.imgbb.com/1/upload?key=7b80af0a58ffc5ed794b3d3955d402c0`, form, { headers: form.getHeaders() });
            imgUrl = response.data.data.url;
        }
        return this.service.update(id, dto, imgUrl);
    }
    async remove(id) {
        return this.service.remove(id);
    }
};
exports.DoctorCategoryController = DoctorCategoryController;
__decorate([
    (0, Roles_decorator_1.Roles)('ADMIN', 'SUPERADMIN'),
    (0, common_1.Post)("create"),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('img')),
    (0, swagger_1.ApiOperation)({ summary: 'Yangi kategoriya yaratish (rasm bilan)' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                name: { type: 'string', example: 'Kardiologiya' },
                img: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Kategoriya yaratildi' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_doctor_category_dto_1.CreateCategory, Object]),
    __metadata("design:returntype", Promise)
], DoctorCategoryController.prototype, "create", null);
__decorate([
    (0, common_1.Get)("all"),
    (0, swagger_1.ApiOperation)({ summary: 'Barcha kategoriyalarni olish' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_doctor_category_dto_1.CategoryAllDto]),
    __metadata("design:returntype", Promise)
], DoctorCategoryController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('one/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Bitta kategoriya olish' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DoctorCategoryController.prototype, "findOne", null);
__decorate([
    (0, Roles_decorator_1.Roles)('ADMIN', 'SUPERADMIN'),
    (0, common_1.Patch)(':id'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('img')),
    (0, swagger_1.ApiOperation)({ summary: 'Kategoriya yangilash (rasm bilan)' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                name: { type: 'string', example: 'Nevrologiya' },
                img: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Kategoriya yangilandi' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_doctor_category_dto_1.UpdateCategory, Object]),
    __metadata("design:returntype", Promise)
], DoctorCategoryController.prototype, "update", null);
__decorate([
    (0, Roles_decorator_1.Roles)('ADMIN', 'SUPERADMIN'),
    (0, common_1.Delete)('delete/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Kategoriya o‘chirish' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Kategoriya o‘chirildi' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DoctorCategoryController.prototype, "remove", null);
exports.DoctorCategoryController = DoctorCategoryController = __decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiTags)('Doctor Categories'),
    (0, common_1.Controller)('doctor-category'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [doctor_category_service_1.DoctorCategoryService])
], DoctorCategoryController);
//# sourceMappingURL=doctor-category.controller.js.map