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
exports.PaymentController = void 0;
const common_1 = require("@nestjs/common");
const payment_service_1 = require("./payment.service");
const create_payment_dto_1 = require("./dto/create-payment.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const Roles_decorator_1 = require("../../common/decorators/Roles.decorator");
const swagger_1 = require("@nestjs/swagger");
let PaymentController = class PaymentController {
    paymentService;
    constructor(paymentService) {
        this.paymentService = paymentService;
    }
    async searchPayments(query) {
        return this.paymentService.searchPayments(query);
    }
    async userPayment(req, query) {
        return this.paymentService.oldPayment(query, req.user.id);
    }
};
exports.PaymentController = PaymentController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.AuthGuard),
    (0, Roles_decorator_1.Roles)('SUPERADMIN', 'ADMIN'),
    (0, common_1.Get)('search'),
    (0, swagger_1.ApiOperation)({ summary: 'SUPERADMIN va ADMIN uchun barcha to‘lovlarni qidirish' }),
    (0, swagger_1.ApiQuery)({ name: 'firstName', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'email', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, example: 10 }),
    (0, swagger_1.ApiQuery)({ name: 'offset', required: false, type: Number, example: 0 }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'To‘lovlar ro‘yxati', type: [Object] }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_payment_dto_1.SearchPaymentDto]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "searchPayments", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.AuthGuard),
    (0, common_1.Get)("Payment/user"),
    (0, swagger_1.ApiOperation)({ summary: "Foydalanuvchi o'z to'lovlarini ko'radi" }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, example: 10 }),
    (0, swagger_1.ApiQuery)({ name: 'offset', required: false, type: Number, example: 0 }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Foydalanuvchi to‘lovlari', type: [Object] }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_payment_dto_1.Search22PaymentDto]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "userPayment", null);
exports.PaymentController = PaymentController = __decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('payment'),
    __metadata("design:paramtypes", [payment_service_1.PaymentService])
], PaymentController);
//# sourceMappingURL=payment.controller.js.map