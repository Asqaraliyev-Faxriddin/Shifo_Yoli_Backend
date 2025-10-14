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
exports.VerificationController = void 0;
const common_1 = require("@nestjs/common");
const verification_dto_1 = require("./dto/verification.dto");
const swagger_1 = require("@nestjs/swagger");
const verification_1 = require("../../common/types/verification");
const verification_service_1 = require("./verification.service");
let VerificationController = class VerificationController {
    verificationservice;
    constructor(verificationservice) {
        this.verificationservice = verificationservice;
    }
    sendOtp(body) {
        return this.verificationservice.sendOtp(body);
    }
    verifyOtp(body) {
        return this.verificationservice.verifyOtp(body);
    }
};
exports.VerificationController = VerificationController;
__decorate([
    (0, swagger_1.ApiOperation)({
        description: `Valid types:
        ${verification_1.EverificationTypes.REGISTER},
        ${verification_1.EverificationTypes.RESET_PASSWORD},
        ${verification_1.EverificationTypes.EDIT_PHONE},
        `
    }),
    (0, common_1.Post)("send"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [verification_dto_1.SendOtpDto]),
    __metadata("design:returntype", void 0)
], VerificationController.prototype, "sendOtp", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        description: `Valid types:
        ${verification_1.EverificationTypes.REGISTER},
        ${verification_1.EverificationTypes.RESET_PASSWORD},
        ${verification_1.EverificationTypes.EDIT_PHONE},
        `
    }),
    (0, common_1.Post)('verify'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [verification_dto_1.VerifyOtpDto]),
    __metadata("design:returntype", void 0)
], VerificationController.prototype, "verifyOtp", null);
exports.VerificationController = VerificationController = __decorate([
    (0, common_1.Controller)('verification'),
    __metadata("design:paramtypes", [verification_service_1.VerificationService])
], VerificationController);
//# sourceMappingURL=verification.controller.js.map