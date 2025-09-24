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
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const axios_1 = require("axios");
const FormData = require("form-data");
const admin_service_1 = require("./admin.service");
const create_admin_dto_1 = require("./dto/create-admin.dto");
const update_admin_dto_1 = require("./dto/update-admin.dto");
let AdminController = class AdminController {
    adminService;
    constructor(adminService) {
        this.adminService = adminService;
    }
    imgbbApiKey = "a22840e1237262e2beec1cf469a82155";
    imgbbUploadUrl = "https://api.imgbb.com/1/upload";
    async uploadToImgbb(file) {
        if (!file)
            return "";
        const formData = new FormData();
        formData.append("image", file.buffer.toString("base64"));
        const response = await axios_1.default.post(this.imgbbUploadUrl, formData, {
            headers: formData.getHeaders(),
            params: { key: this.imgbbApiKey },
        });
        return response.data?.data?.url ?? null;
    }
    async create(dto, file) {
        const profileImgUrl = await this.uploadToImgbb(file) || "";
        return this.adminService.create(dto, profileImgUrl);
    }
    findAllAdmins(dto) {
        return this.adminService.findAllAdmins(dto);
    }
    findAllDoctors(dto) {
        return this.adminService.findAllDoctors(dto);
    }
    findAllPatients(dto) {
        return this.adminService.findAllPatients(dto);
    }
    findOne(id) {
        return this.adminService.findOneAdmin(id);
    }
    async update(id, dto, file) {
        const profileImgUrl = await this.uploadToImgbb(file) || "";
        return this.adminService.updateAdmin(id, dto, profileImgUrl);
    }
    remove(id) {
        return this.adminService.deleteAdmin(id);
    }
    removeDoctor(id) {
        return this.adminService.deleteDoctor(id);
    }
    removePatient(id) {
        return this.adminService.deletePatient(id);
    }
    blockUser(dto) {
        return this.adminService.blockUser(dto);
    }
    unblockUser(dto) {
        return this.adminService.unblockUser(dto);
    }
    nimadir() {
        return this.adminService.nimadir();
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: "Yangi admin yaratish" }),
    (0, swagger_1.ApiConsumes)("multipart/form-data"),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("profileImg")),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_admin_dto_1.CreateAdminDto, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "create", null);
__decorate([
    (0, common_1.Post)("admins"),
    (0, swagger_1.ApiOperation)({ summary: "Adminlarni qidirish va ro‘yxatlash" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_admin_dto_1.SearchUserDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "findAllAdmins", null);
__decorate([
    (0, common_1.Post)("doctors"),
    (0, swagger_1.ApiOperation)({ summary: "Doctorlarni qidirish va ro‘yxatlash" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_admin_dto_1.SearchUserDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "findAllDoctors", null);
__decorate([
    (0, common_1.Post)("patients"),
    (0, swagger_1.ApiOperation)({ summary: "Bemorlarni qidirish va ro‘yxatlash" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_admin_dto_1.SearchUserDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "findAllPatients", null);
__decorate([
    (0, common_1.Get)(":id"),
    (0, swagger_1.ApiOperation)({ summary: "Bitta adminni topish" }),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(":id"),
    (0, swagger_1.ApiOperation)({ summary: "Adminni yangilash" }),
    (0, swagger_1.ApiConsumes)("multipart/form-data"),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("profileImg")),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_admin_dto_1.UpdateAdminDto, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":id"),
    (0, swagger_1.ApiOperation)({ summary: "Adminni o‘chirish" }),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "remove", null);
__decorate([
    (0, common_1.Delete)("doctor/:id"),
    (0, swagger_1.ApiOperation)({ summary: "Doctorni o‘chirish" }),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "removeDoctor", null);
__decorate([
    (0, common_1.Delete)("bemor/:id"),
    (0, swagger_1.ApiOperation)({ summary: "Bemorni o‘chirish" }),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "removePatient", null);
__decorate([
    (0, common_1.Post)("block"),
    (0, swagger_1.ApiOperation)({ summary: "Userni bloklash" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_admin_dto_1.BlockUserDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "blockUser", null);
__decorate([
    (0, common_1.Post)("unblock"),
    (0, swagger_1.ApiOperation)({ summary: "Userni blokdan chiqarish" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_admin_dto_1.UnblockUserDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "unblockUser", null);
__decorate([
    (0, common_1.Get)("devices/fret/fdf"),
    (0, swagger_1.ApiOperation)({ summary: "Barcha qurilmalarni olish" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "nimadir", null);
exports.AdminController = AdminController = __decorate([
    (0, swagger_1.ApiTags)("Admin"),
    (0, common_1.Controller)("admin"),
    __metadata("design:paramtypes", [admin_service_1.AdminService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map