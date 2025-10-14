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
exports.DeviceController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const device_service_1 = require("./device.service");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
let DeviceController = class DeviceController {
    deviceService;
    constructor(deviceService) {
        this.deviceService = deviceService;
    }
    findAll(req) {
        return this.deviceService.findAll(req.user.id);
    }
    remove(id, req) {
        return this.deviceService.remove(id, req.user.id, req);
    }
    unblock(id, req) {
        return this.deviceService.unblock(id, req.user.id, req);
    }
};
exports.DeviceController = DeviceController;
__decorate([
    (0, common_1.Get)("all"),
    (0, swagger_1.ApiOperation)({ summary: "Foydalanuvchining barcha qurilmalarini olish" }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], DeviceController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)('block/:id'),
    (0, swagger_1.ApiOperation)({ summary: "Qurilmani bloklash" }),
    (0, swagger_1.ApiParam)({ name: "id", description: "Qurilma ID (uuid)", example: "uuid-device-id" }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], DeviceController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)('unblock/:id'),
    (0, swagger_1.ApiOperation)({ summary: "Qurilmani bloklash" }),
    (0, swagger_1.ApiParam)({ name: "id", description: "Qurilma ID (uuid)", example: "uuid-device-id" }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], DeviceController.prototype, "unblock", null);
exports.DeviceController = DeviceController = __decorate([
    (0, swagger_1.ApiTags)("Devices"),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('device'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [device_service_1.DeviceService])
], DeviceController);
//# sourceMappingURL=device.controller.js.map