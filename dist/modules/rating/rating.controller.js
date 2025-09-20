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
exports.ReviewController = void 0;
const common_1 = require("@nestjs/common");
const rating_service_1 = require("./rating.service");
const create_rating_dto_1 = require("./dto/create-rating.dto");
const roles_guard_1 = require("../../common/guards/roles.guard");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const swagger_1 = require("@nestjs/swagger");
let ReviewController = class ReviewController {
    reviewService;
    constructor(reviewService) {
        this.reviewService = reviewService;
    }
    async create(req, dto) {
        return this.reviewService.create(req.user.id, dto);
    }
    async findAllByDoctor(doctorId, offset = 0, limit = 10) {
        return this.reviewService.findAllByDoctor(doctorId, offset, limit);
    }
    async getAnalytics(doctorId) {
        return this.reviewService.getAnalytics(doctorId);
    }
    async update(req, id, dto) {
        return this.reviewService.update(req.user.id, id, dto);
    }
    async remove(req, id) {
        return this.reviewService.remove(req.user.id, id);
    }
};
exports.ReviewController = ReviewController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: "Doktorga review qo‘shish" }),
    (0, swagger_1.ApiResponse)({ status: 201, description: "Review muvaffaqiyatli qo‘shildi" }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_rating_dto_1.CreateReviewDto]),
    __metadata("design:returntype", Promise)
], ReviewController.prototype, "create", null);
__decorate([
    (0, common_1.Get)("doctor/:doctorId"),
    (0, swagger_1.ApiOperation)({ summary: "Doktorning review larini olish" }),
    (0, swagger_1.ApiQuery)({ name: "offset", required: false, example: 0 }),
    (0, swagger_1.ApiQuery)({ name: "limit", required: false, example: 10 }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Doktor reviewlari ro‘yxati" }),
    __param(0, (0, common_1.Param)("doctorId", common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)("offset", common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)("limit", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], ReviewController.prototype, "findAllByDoctor", null);
__decorate([
    (0, common_1.Get)("analytics/:doctorId"),
    (0, swagger_1.ApiOperation)({ summary: "Doktor review analitikasi" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "O‘rtacha baho, umumiy soni, taqsimot, eng zo‘r va eng yomon review lar",
    }),
    __param(0, (0, common_1.Param)("doctorId", common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReviewController.prototype, "getAnalytics", null);
__decorate([
    (0, common_1.Put)(":id"),
    (0, swagger_1.ApiOperation)({ summary: "Review ni yangilash (faqat egasi)" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Review muvaffaqiyatli yangilandi" }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("id", common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, create_rating_dto_1.UpdateReviewDto]),
    __metadata("design:returntype", Promise)
], ReviewController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":id"),
    (0, swagger_1.ApiOperation)({ summary: "Review o‘chirish (egasi yoki ADMIN/SUPERADMIN)" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Review muvaffaqiyatli o‘chirildi" }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("id", common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ReviewController.prototype, "remove", null);
exports.ReviewController = ReviewController = __decorate([
    (0, swagger_1.ApiTags)("Reviews"),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)("reviews"),
    __metadata("design:paramtypes", [rating_service_1.ReviewService])
], ReviewController);
//# sourceMappingURL=rating.controller.js.map