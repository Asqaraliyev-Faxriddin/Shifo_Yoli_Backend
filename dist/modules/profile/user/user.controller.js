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
exports.PublicController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const user_service_1 = require("./user.service");
const create_admin_dto_1 = require("../../admin/dto/create-admin.dto");
let PublicController = class PublicController {
    publicService;
    constructor(publicService) {
        this.publicService = publicService;
    }
    async getTopDoctors() {
        return this.publicService.getTopDoctors();
    }
    async getBestDoctorOfWeek() {
        return this.publicService.getBestDoctorOfWeek();
    }
    async getMostReviewedDoctors() {
        return this.publicService.getMostReviewedDoctors();
    }
    async getCategories() {
        return this.publicService.getCategories();
    }
    async DoctorsAll(payload) {
        return this.publicService.doctorsAll(payload);
    }
    async DoctorOne(id) {
        return this.publicService.doctorOne(id);
    }
};
exports.PublicController = PublicController;
__decorate([
    (0, common_1.Get)('top-doctors'),
    (0, swagger_1.ApiOperation)({ summary: 'Top 10 doctor rating bo‘yicha' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PublicController.prototype, "getTopDoctors", null);
__decorate([
    (0, common_1.Get)('best-doctor-week'),
    (0, swagger_1.ApiOperation)({ summary: 'Haftaning eng yaxshi doctori' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PublicController.prototype, "getBestDoctorOfWeek", null);
__decorate([
    (0, common_1.Get)('most-reviewed-doctors'),
    (0, swagger_1.ApiOperation)({ summary: 'Eng ko‘p review olgan 12 ta doctor' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PublicController.prototype, "getMostReviewedDoctors", null);
__decorate([
    (0, common_1.Get)('categories'),
    (0, swagger_1.ApiOperation)({ summary: 'Barcha category va doctorlari' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PublicController.prototype, "getCategories", null);
__decorate([
    (0, common_1.Get)("doctors/All"),
    (0, swagger_1.ApiOperation)({ summary: "Barcha doktorlar publiished true bolganlar" }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_admin_dto_1.SearchUserDto]),
    __metadata("design:returntype", Promise)
], PublicController.prototype, "DoctorsAll", null);
__decorate([
    (0, common_1.Get)("doctorOne/:id"),
    (0, swagger_1.ApiOperation)({ summary: "Bitta doktorni olish" }),
    __param(0, (0, common_1.Param)("id", common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PublicController.prototype, "DoctorOne", null);
exports.PublicController = PublicController = __decorate([
    (0, swagger_1.ApiTags)('Public'),
    (0, common_1.Controller)('User'),
    __metadata("design:paramtypes", [user_service_1.PublicService])
], PublicController);
//# sourceMappingURL=user.controller.js.map