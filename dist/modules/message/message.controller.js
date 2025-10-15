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
exports.MessageController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const platform_express_1 = require("@nestjs/platform-express");
const message_service_1 = require("./message.service");
const create_message_dto_1 = require("./dto/create-message.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
let MessageController = class MessageController {
    messageService;
    constructor(messageService) {
        this.messageService = messageService;
    }
    async createChat(req, dto) {
        return this.messageService.createChat(req.user.id, dto);
    }
    async sendMessage(req, dto, file) {
        return this.messageService.sendMessage(req.user.id, dto, file);
    }
    async updateMessage(req, dto) {
        return this.messageService.updateMessage(req.user.id, dto);
    }
    async deleteMessage(req, dto) {
        return this.messageService.deleteMessage(req.user.id, dto);
    }
    async readMessages(req, dto) {
        return this.messageService.readMessages(req.user.id, dto);
    }
    async getMessages(req, dto) {
        return this.messageService.getMessages(req.user.id, dto);
    }
    async getChats(req, dto) {
        return this.messageService.getChats(req.user.id, dto);
    }
};
exports.MessageController = MessageController;
__decorate([
    (0, common_1.Post)('create-chat'),
    (0, swagger_1.ApiOperation)({ summary: 'Yangi chat yaratish yoki mavjudini olish' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_message_dto_1.CreateChatDto]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "createChat", null);
__decorate([
    (0, common_1.Post)('send'),
    (0, swagger_1.ApiOperation)({ summary: 'Xabar yuborish (matn, fayl yoki video)' }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_message_dto_1.SendMessageDto, Object]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "sendMessage", null);
__decorate([
    (0, common_1.Patch)('update'),
    (0, swagger_1.ApiOperation)({ summary: 'Xabar matnini yangilash (faqat o‘z xabari)' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_message_dto_1.UpdateMessageDto]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "updateMessage", null);
__decorate([
    (0, common_1.Delete)('delete'),
    (0, swagger_1.ApiOperation)({ summary: 'Xabarni o‘chirish (faqat o‘z xabari)' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_message_dto_1.DeleteMessageDto]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "deleteMessage", null);
__decorate([
    (0, common_1.Patch)('read'),
    (0, swagger_1.ApiOperation)({ summary: 'Xabarlarni o‘qilgan deb belgilash' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_message_dto_1.ReadMessageDto]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "readMessages", null);
__decorate([
    (0, common_1.Get)('list'),
    (0, swagger_1.ApiOperation)({ summary: 'Chatdagi xabarlarni olish (pagination bilan)' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_message_dto_1.GetMessagesDto]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "getMessages", null);
__decorate([
    (0, common_1.Get)('chats'),
    (0, swagger_1.ApiOperation)({ summary: 'Foydalanuvchining barcha chatlarini olish' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_message_dto_1.GetChatsDto]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "getChats", null);
exports.MessageController = MessageController = __decorate([
    (0, swagger_1.ApiTags)('Chat va Xabarlar'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.AuthGuard),
    (0, common_1.Controller)('messages'),
    __metadata("design:paramtypes", [message_service_1.MessageService])
], MessageController);
//# sourceMappingURL=message.controller.js.map