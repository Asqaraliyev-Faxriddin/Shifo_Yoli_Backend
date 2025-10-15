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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageController = void 0;
const common_1 = require("@nestjs/common");
const message_service_1 = require("./message.service");
const create_message_dto_1 = require("./dto/create-message.dto");
const prisma_service_1 = require("../../core/prisma/prisma.service");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const swagger_1 = require("@nestjs/swagger");
let MessageController = class MessageController {
    svc;
    prisma;
    constructor(svc, prisma) {
        this.svc = svc;
        this.prisma = prisma;
    }
    async getChats(req) {
        return this.svc.getChatsForUser(req.user.id);
    }
    async getusers(req) {
        return this.svc.getAllUsers();
    }
    async createChat(dto) {
        return this.svc.createChat(dto.participantIds);
    }
    async getMessages(chatId) {
        return this.svc.getMessages(chatId);
    }
    async sendMessage(req, dto) {
        return this.svc.createMessage(req.user.id, dto);
    }
};
exports.MessageController = MessageController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.AuthGuard),
    (0, common_1.Get)('/chats'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "getChats", null);
__decorate([
    (0, common_1.Get)('/users'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "getusers", null);
__decorate([
    (0, common_1.Post)('/create/chat'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_message_dto_1.CreateChatDto]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "createChat", null);
__decorate([
    (0, common_1.Get)('/chats/:chatId/messages'),
    __param(0, (0, common_1.Param)('chatId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "getMessages", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.AuthGuard),
    (0, common_1.Post)('/send'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_a = typeof create_message_dto_1.CreateMessageDto !== "undefined" && create_message_dto_1.CreateMessageDto) === "function" ? _a : Object]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "sendMessage", null);
exports.MessageController = MessageController = __decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('messages'),
    __metadata("design:paramtypes", [message_service_1.MessageService, prisma_service_1.PrismaService])
], MessageController);
//# sourceMappingURL=message.controller.js.map