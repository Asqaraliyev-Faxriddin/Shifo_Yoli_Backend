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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetChatsDto = exports.GetMessagesDto = exports.ReadMessageDto = exports.DeleteMessageDto = exports.UpdateMessageDto = exports.SendMessageDto = exports.CreateChatDto = exports.MessageType = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
var MessageType;
(function (MessageType) {
    MessageType["TEXT"] = "TEXT";
    MessageType["FILE"] = "FILE";
    MessageType["VIDEO"] = "VIDEO";
})(MessageType || (exports.MessageType = MessageType = {}));
class CreateChatDto {
    receiverId;
}
exports.CreateChatDto = CreateChatDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Chat ochilayotgan foydalanuvchining id'si (receiver). Sender token orqali olinadi.",
        example: 'b6d9f3c2-1a2b-4f5d-8a71-111111111111',
    }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateChatDto.prototype, "receiverId", void 0);
class SendMessageDto {
    chatId;
    receiverId;
    message;
    type = MessageType.TEXT;
}
exports.SendMessageDto = SendMessageDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Agar mavjud bo`lsa — chat id ga yozish uchun (ikkilamchi: chat mavjud bo`lishi kerak).',
        example: 'd2f6a7e0-2b47-4b2b-8f8a-222222222222',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], SendMessageDto.prototype, "chatId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: "Agar chatId berilmagan bo'lsa — qaysi receiver(oluvchi)ga yozilayotganini ko'rsatadi. Sender token orqali olinadi.",
        example: 'b6d9f3c2-1a2b-4f5d-8a71-333333333333',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], SendMessageDto.prototype, "receiverId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Xabar matni yoki fayl uchun meta (agar FILE/VIDEO bo`lsa server tomoni faylni alohida qabul qiladi).',
        example: 'Salom doktor, menga maslahat bering.',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SendMessageDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: MessageType,
        description: 'Xabar turi (TEXT, FILE, VIDEO).',
        example: MessageType.TEXT,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(MessageType),
    __metadata("design:type", String)
], SendMessageDto.prototype, "type", void 0);
class UpdateMessageDto {
    messageId;
    newText;
}
exports.UpdateMessageDto = UpdateMessageDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Tahrirlanayotgan message id',
        example: 'e3a1b5d6-aaaa-4c4c-9c9c-444444444444',
    }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpdateMessageDto.prototype, "messageId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Yangilangan xabar matni',
        example: 'Yangi tahrirlangan matn.',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpdateMessageDto.prototype, "newText", void 0);
class DeleteMessageDto {
    messageId;
}
exports.DeleteMessageDto = DeleteMessageDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'O\'chirayotgan message id',
        example: 'e3a1b5d6-aaaa-4c4c-9c9c-444444444444',
    }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], DeleteMessageDto.prototype, "messageId", void 0);
class ReadMessageDto {
    chatId;
}
exports.ReadMessageDto = ReadMessageDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Qaysi chatdagi xabarlar o\'qildi deb belgilanmoqda',
        example: 'd2f6a7e0-2b47-4b2b-8f8a-222222222222',
    }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ReadMessageDto.prototype, "chatId", void 0);
class GetMessagesDto {
    chatId;
    page = 1;
    limit = 30;
}
exports.GetMessagesDto = GetMessagesDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Qaysi chating xabarlarini olish (chatId)',
        example: 'd2f6a7e0-2b47-4b2b-8f8a-222222222222',
    }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], GetMessagesDto.prototype, "chatId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Sahifa (0 dan boshlanadi yoki 1 dan boshlash sizning implementatsiyangizga bog`liq).',
        example: 1,
        default: 1,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], GetMessagesDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Sahifadagi xabarlar soni (limit).',
        example: 30,
        default: 30,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], GetMessagesDto.prototype, "limit", void 0);
class GetChatsDto {
    participantId;
    page = 1;
    limit = 20;
}
exports.GetChatsDto = GetChatsDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Muayyan suhbatdoshni (bemor yoki shifokorni) filtrlash uchun.',
        example: '6f3f2a71-cc12-4b8f-8cfa-6dce53d1b001',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], GetChatsDto.prototype, "participantId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Sahifa (1 dan boshlash tavsiya etiladi).',
        example: 1,
        default: 1,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], GetChatsDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Sahifadagi elementlar soni.',
        example: 20,
        default: 20,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], GetChatsDto.prototype, "limit", void 0);
exports.default = {
    CreateChatDto,
    SendMessageDto,
    UpdateMessageDto,
    DeleteMessageDto,
    ReadMessageDto,
    GetMessagesDto,
    GetChatsDto,
    MessageType,
};
//# sourceMappingURL=create-message.dto.js.map