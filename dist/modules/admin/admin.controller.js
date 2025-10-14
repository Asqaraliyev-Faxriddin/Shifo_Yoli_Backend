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
const axios_1 = require("axios");
const FormData = require("form-data");
const swagger_1 = require("@nestjs/swagger");
const admin_service_1 = require("./admin.service");
const create_admin_dto_1 = require("./dto/create-admin.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const Roles_decorator_1 = require("../../common/decorators/Roles.decorator");
const client_1 = require("@prisma/client");
let AdminController = class AdminController {
    adminService;
    constructor(adminService) {
        this.adminService = adminService;
    }
    imgbbApiKey = "a22840e1237262e2beec1cf469a82155";
    imgbbUploadUrl = "https://api.imgbb.com/1/upload";
    async uploadImage(file) {
        if (!file)
            return undefined;
        const formData = new FormData();
        formData.append("image", file.buffer.toString("base64"));
        const res = await axios_1.default.post(`${this.imgbbUploadUrl}?key=${this.imgbbApiKey}`, formData, {
            headers: {
                ...formData.getHeaders(),
            },
        });
        return res.data?.data?.url;
    }
    async createAdmin(dto, file) {
        console.log("fwwe", file);
        const profileImgUrl = file ? await this.uploadImage(file) : undefined;
        return this.adminService.createAdmin(dto, profileImgUrl);
    }
    async createDoctor(files, body) {
        const profileImgUrl = files.profileImg?.[0] ? await this.uploadImage(files.profileImg[0]) : null;
        const imagesUrls = [];
        if (files.images) {
            for (const img of files.images) {
                const url = await this.uploadImage(img);
                if (url)
                    imagesUrls.push(url);
            }
        }
        const videosUrls = [];
        if (files.videos) {
            for (const vid of files.videos) {
                const url = await this.uploadImage(vid);
                if (url)
                    videosUrls.push(url);
            }
        }
        const dto = {
            ...body,
            dailySalary: Number(body.dailySalary),
            age: Number(body.age),
            profileImg: profileImgUrl,
            images: imagesUrls.length ? imagesUrls : null,
            videos: videosUrls.length ? videosUrls : null,
        };
        return this.adminService.createDoctor(dto, profileImgUrl || "");
    }
    async createPatient(dto, req, file) {
        const profileImgUrl = file ? await this.uploadImage(file) : undefined;
        return this.adminService.createPatient(dto, profileImgUrl);
        return req.body;
    }
    async findAllAdmins(dto) {
        return this.adminService.findAllAdmins(dto);
    }
    async findAllDoctors(dto) {
        return this.adminService.findAllDoctors(dto);
    }
    async findAllPatients(dto) {
        return this.adminService.findAllPatients(dto);
    }
    async updateUser(id, dto, file) {
        const profileImgUrl = file ? await this.uploadImage(file) : undefined;
        return this.adminService.updateUser(id, dto, profileImgUrl);
    }
    async deleteUser(dto) {
        return this.adminService.deleteUser(dto);
    }
    async addFunds(dto) {
        return this.adminService.addFunds(dto);
    }
    async deductFunds(dto) {
        return this.adminService.deductFunds(dto);
    }
    async massPayment(dto) {
        return this.adminService.massPayment(dto);
    }
    async massDeduction(dto) {
        return this.adminService.massDeduction(dto);
    }
    async NotificationAll(dto) {
        return this.adminService.notificationAll(dto);
    }
    async sendNotification(dto) {
        return this.adminService.sendNotification(dto);
    }
    async broadcastNotification(dto) {
        return this.adminService.broadcastNotification(dto);
    }
    async blockUser(dto) {
        return this.adminService.blockUser(dto.userId, dto.reason);
    }
    async unblockUser(dto) {
        return this.adminService.unblockUser(dto.userId);
    }
    async blockDevice(deviceId, reason) {
        return this.adminService.blockDevice(deviceId, reason);
    }
    async unblockDevice(deviceId) {
        return this.adminService.unblockDevice(deviceId);
    }
    async toggleDoctorPublish(doctorId, status) {
        return this.adminService.toggleDoctorPublish(doctorId, status === "true");
    }
    async allDevices() {
        return this.adminService.BlokuserAll();
    }
    async blobkusers() {
        return this.adminService.BlokdeviceAll();
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Post)("create/admin"),
    (0, swagger_1.ApiOperation)({ summary: "Create Admin" }),
    (0, swagger_1.ApiConsumes)("multipart/form-data"),
    (0, swagger_1.ApiBody)({ type: create_admin_dto_1.CreateAdminDto }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_admin_dto_1.CreateAdminDto, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "createAdmin", null);
__decorate([
    (0, common_1.Post)("create/doctor"),
    (0, swagger_1.ApiOperation)({ summary: "Create Doctor" }),
    (0, swagger_1.ApiConsumes)("multipart/form-data"),
    (0, swagger_1.ApiBody)({ type: create_admin_dto_1.CreateDoctorDto }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([
        { name: "profileImg", maxCount: 1 },
        { name: "images", maxCount: 10 },
        { name: "videos", maxCount: 10 },
    ])),
    __param(0, (0, common_1.UploadedFiles)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "createDoctor", null);
__decorate([
    (0, common_1.Post)("create/patient"),
    (0, swagger_1.ApiOperation)({ summary: "Create Patient" }),
    (0, swagger_1.ApiConsumes)("multipart/form-data"),
    (0, swagger_1.ApiBody)({ type: create_admin_dto_1.CreatePatientDto }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_admin_dto_1.CreatePatientDto, Object, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "createPatient", null);
__decorate([
    (0, common_1.Get)("admins"),
    (0, swagger_1.ApiOperation)({ summary: "Get all admins" }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_admin_dto_1.SearchUserDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "findAllAdmins", null);
__decorate([
    (0, common_1.Get)("doctors"),
    (0, swagger_1.ApiOperation)({ summary: "Get all doctors" }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_admin_dto_1.SearchUserDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "findAllDoctors", null);
__decorate([
    (0, common_1.Get)("patients"),
    (0, swagger_1.ApiOperation)({ summary: "Get all patients" }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_admin_dto_1.SearchUserDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "findAllPatients", null);
__decorate([
    (0, common_1.Put)("update/:id"),
    (0, swagger_1.ApiOperation)({ summary: "Update user" }),
    (0, swagger_1.ApiParam)({ name: "id", description: "User ID" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_admin_dto_1.UpdateUserDto, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateUser", null);
__decorate([
    (0, common_1.Delete)("delete"),
    (0, swagger_1.ApiOperation)({ summary: "Delete user" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_admin_dto_1.DeleteUserDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteUser", null);
__decorate([
    (0, common_1.Post)("wallet/add"),
    (0, swagger_1.ApiOperation)({ summary: "Add funds to wallet" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_admin_dto_1.UserPaymentDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "addFunds", null);
__decorate([
    (0, common_1.Post)("wallet/deduct"),
    (0, swagger_1.ApiOperation)({ summary: "Deduct funds from wallet" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_admin_dto_1.UserPaymentDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deductFunds", null);
__decorate([
    (0, common_1.Post)("wallet/mass/add"),
    (0, swagger_1.ApiOperation)({ summary: "Mass add funds" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_admin_dto_1.MassPaymentDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "massPayment", null);
__decorate([
    (0, common_1.Post)("wallet/mass/deduct"),
    (0, swagger_1.ApiOperation)({ summary: "Mass deduct funds" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_admin_dto_1.MassPaymentDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "massDeduction", null);
__decorate([
    (0, common_1.Post)("notification/all"),
    (0, swagger_1.ApiOperation)({ summary: "notification all" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_admin_dto_1.NotificationAll]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "NotificationAll", null);
__decorate([
    (0, common_1.Post)("notification/send"),
    (0, swagger_1.ApiOperation)({ summary: "Send notification to one user" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_admin_dto_1.SendNotificationDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "sendNotification", null);
__decorate([
    (0, common_1.Post)("notification/broadcast"),
    (0, swagger_1.ApiOperation)({ summary: "Broadcast notification to all users" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_admin_dto_1.BroadcastNotificationDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "broadcastNotification", null);
__decorate([
    (0, common_1.Post)("block/user"),
    (0, swagger_1.ApiOperation)({ summary: "Block user" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_admin_dto_1.BlockUserDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "blockUser", null);
__decorate([
    (0, common_1.Post)("unblock/user"),
    (0, swagger_1.ApiOperation)({ summary: "Unblock user" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_admin_dto_1.UnblockUserDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "unblockUser", null);
__decorate([
    (0, common_1.Post)("block/device/:id"),
    (0, swagger_1.ApiOperation)({ summary: "Block device" }),
    (0, swagger_1.ApiParam)({ name: "id", description: "Device ID" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)("reason")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "blockDevice", null);
__decorate([
    (0, common_1.Post)("unblock/device/:id"),
    (0, swagger_1.ApiOperation)({ summary: "Unblock device" }),
    (0, swagger_1.ApiParam)({ name: "id", description: "Device ID" }),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "unblockDevice", null);
__decorate([
    (0, common_1.Put)("doctor/:id/publish/:status"),
    (0, swagger_1.ApiOperation)({ summary: "Toggle doctor profile publish status" }),
    (0, swagger_1.ApiParam)({ name: "id", description: "Doctor ID" }),
    (0, swagger_1.ApiParam)({ name: "status", description: "Publish status (true/false)" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Param)("status")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "toggleDoctorPublish", null);
__decorate([
    (0, common_1.Get)("device/all"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "allDevices", null);
__decorate([
    (0, common_1.Get)("block/users/all"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "blobkusers", null);
exports.AdminController = AdminController = __decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiTags)("Admin"),
    (0, common_1.Controller)("admin"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    (0, Roles_decorator_1.Roles)(client_1.UserRole.SUPERADMIN),
    __metadata("design:paramtypes", [admin_service_1.AdminService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map