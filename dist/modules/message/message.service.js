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
exports.MessageService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../core/prisma/prisma.service");
const create_message_dto_1 = require("./dto/create-message.dto");
const fs = require("fs");
const path = require("path");
const uuid_1 = require("uuid");
let MessageService = class MessageService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createChat(senderId, dto) {
        const { receiverId } = dto;
        if (senderId === receiverId)
            throw new common_1.BadRequestException('Siz o‘zingiz bilan chat ocholmaysiz.');
        const [sender, receiver] = await Promise.all([
            this.prisma.user.findUnique({ where: { id: senderId } }),
            this.prisma.user.findUnique({ where: { id: receiverId } }),
        ]);
        if (!sender)
            throw new common_1.NotFoundException('Foydalanuvchi topilmadi.');
        if (!receiver)
            throw new common_1.NotFoundException('Qabul qiluvchi topilmadi.');
        if (sender.role === 'BEMOR' && receiver.role === 'DOCTOR') {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const access = await this.prisma.dailyDoctorAccess.findUnique({
                where: {
                    patientId_doctorId_date: {
                        patientId: senderId,
                        doctorId: receiverId,
                        date: today,
                    },
                },
            });
            if (!access)
                throw new common_1.ForbiddenException('Bugun ushbu doktorga to‘lov qilmagansiz. Suhbatni boshlashdan oldin to‘lovni amalga oshiring.');
        }
        const existing = await this.prisma.chat.findFirst({
            where: {
                participants: {
                    some: { userId: senderId },
                },
                AND: {
                    participants: {
                        some: { userId: receiverId },
                    },
                },
            },
        });
        if (existing)
            return { message: 'Chat allaqachon mavjud.', chatId: existing.id };
        const newChat = await this.prisma.chat.create({
            data: {
                participants: {
                    createMany: {
                        data: [
                            { userId: senderId },
                            { userId: receiverId },
                        ],
                    },
                },
            },
        });
        return { message: 'Chat yaratildi.', chatId: newChat.id };
    }
    async saveFile(file) {
        const uploadDir = path.join(process.cwd(), 'uploads', 'chat');
        if (!fs.existsSync(uploadDir))
            fs.mkdirSync(uploadDir, { recursive: true });
        const ext = path.extname(file.originalname);
        const fileName = `${(0, uuid_1.v4)()}${ext}`;
        const filePath = path.join(uploadDir, fileName);
        fs.writeFileSync(filePath, file.buffer);
        return `/uploads/chat/${fileName}`;
    }
    async sendMessage(senderId, dto, file) {
        const { chatId, receiverId, message, type } = dto;
        let chat;
        if (chatId) {
            chat = await this.prisma.chat.findUnique({
                where: { id: chatId },
                include: { participants: true },
            });
            if (!chat)
                throw new common_1.NotFoundException('Chat topilmadi.');
            if (!chat.participants.some((p) => p.userId === senderId))
                throw new common_1.ForbiddenException('Bu chatda yozish huquqiga ega emassiz.');
        }
        if (!chat && receiverId) {
            const res = await this.createChat(senderId, { receiverId });
            chat = await this.prisma.chat.findUnique({
                where: { id: res.chatId },
                include: { participants: true },
            });
        }
        if (!chat)
            throw new common_1.BadRequestException('Chat aniqlanmadi. chatId yoki receiverId yuboring.');
        const receiverUserId = chat.participants.find((p) => p.userId !== senderId)?.userId;
        const [sender, receiver] = await Promise.all([
            this.prisma.user.findUnique({ where: { id: senderId } }),
            this.prisma.user.findUnique({ where: { id: receiverUserId } }),
        ]);
        if (!sender || !receiver)
            throw new common_1.NotFoundException('Foydalanuvchi topilmadi.');
        if (sender.role === 'BEMOR' && receiver.role === 'DOCTOR') {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const access = await this.prisma.dailyDoctorAccess.findUnique({
                where: {
                    patientId_doctorId_date: {
                        patientId: senderId,
                        doctorId: receiverUserId,
                        date: today,
                    },
                },
            });
            if (!access)
                throw new common_1.ForbiddenException('Bugungi kun uchun ushbu doktorga to‘lov qilmagansiz.');
        }
        let finalMessage = message;
        let fileUrl = null;
        if (file && (type === create_message_dto_1.MessageType.FILE || type === create_message_dto_1.MessageType.VIDEO)) {
            fileUrl = await this.saveFile(file);
            finalMessage = fileUrl;
        }
        const newMsg = await this.prisma.message.create({
            data: {
                chatId: chat.id,
                senderId,
                message: finalMessage,
                type: type ?? create_message_dto_1.MessageType.TEXT,
                ...(fileUrl && { fileUrl }),
            },
        });
        return { message: 'Xabar yuborildi.', data: newMsg };
    }
    async updateMessage(userId, dto) {
        const msg = await this.prisma.message.findUnique({
            where: { id: dto.messageId },
        });
        if (!msg)
            throw new common_1.NotFoundException('Xabar topilmadi.');
        if (msg.senderId !== userId)
            throw new common_1.ForbiddenException('Bu xabarni tahrirlash huquqiga ega emassiz.');
        const updated = await this.prisma.message.update({
            where: { id: dto.messageId },
            data: { message: dto.newText },
        });
        return { message: 'Xabar yangilandi.', data: updated };
    }
    async deleteMessage(userId, dto) {
        const msg = await this.prisma.message.findUnique({
            where: { id: dto.messageId },
        });
        if (!msg)
            throw new common_1.NotFoundException('Xabar topilmadi.');
        if (msg.senderId !== userId)
            throw new common_1.ForbiddenException('Bu xabarni o‘chirish huquqiga ega emassiz.');
        await this.prisma.message.delete({ where: { id: dto.messageId } });
        return { message: 'Xabar o‘chirildi.' };
    }
    async readMessages(userId, dto) {
        const chat = await this.prisma.chat.findUnique({
            where: { id: dto.chatId },
            include: { participants: true },
        });
        if (!chat)
            throw new common_1.NotFoundException('Chat topilmadi.');
        if (!chat.participants.some((p) => p.userId === userId))
            throw new common_1.ForbiddenException('Siz bu chatda ishtirok etmagansiz.');
        await this.prisma.message.updateMany({
            where: { chatId: dto.chatId, senderId: { not: userId } },
            data: { isRead: true },
        });
        return { message: 'Xabarlar o‘qilgan deb belgilandi.' };
    }
    async getMessages(userId, dto) {
        const { chatId, page = 1, limit = 30 } = dto;
        const chat = await this.prisma.chat.findUnique({
            where: { id: chatId },
            include: { participants: true },
        });
        if (!chat)
            throw new common_1.NotFoundException('Chat topilmadi.');
        if (!chat.participants.some((p) => p.userId === userId))
            throw new common_1.ForbiddenException('Siz bu chatga kira olmaysiz.');
        const messages = await this.prisma.message.findMany({
            where: { chatId },
            orderBy: { createdAt: 'desc' },
            skip: (page - 1) * limit,
            take: limit,
        });
        return {
            message: 'Xabarlar olindi.',
            total: messages.length,
            data: messages.reverse(),
        };
    }
    async getChats(userId, dto) {
        const { participantId, page = 1, limit = 20 } = dto;
        const chats = await this.prisma.chat.findMany({
            where: {
                participants: {
                    some: { userId },
                },
                ...(participantId && {
                    participants: { some: { userId: participantId } },
                }),
            },
            include: {
                participants: { include: { user: true } },
                messages: {
                    orderBy: { createdAt: 'desc' },
                    take: 1,
                },
            },
            orderBy: { updatedAt: 'desc' },
            skip: (page - 1) * limit,
            take: limit,
        });
        return {
            message: 'Chatlar olindi.',
            total: chats.length,
            data: chats,
        };
    }
};
exports.MessageService = MessageService;
exports.MessageService = MessageService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MessageService);
//# sourceMappingURL=message.service.js.map