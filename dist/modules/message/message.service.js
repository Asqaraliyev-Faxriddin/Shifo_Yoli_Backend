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
let MessageService = class MessageService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createChat(participantIds) {
        const uniqueIds = Array.from(new Set(participantIds));
        console.log('[createChat] Participants:', uniqueIds);
        const chat = await this.prisma.chat.create({
            data: {
                participants: {
                    create: uniqueIds.map((id) => ({ userId: id })),
                },
            },
            include: { participants: { include: { user: true } } },
        });
        console.log('[createChat] New chat created:', chat.id);
        return chat;
    }
    async getChatsForUser(userId) {
        console.log('[getChatsForUser] Fetching chats for user:', userId);
        const chats = await this.prisma.chat.findMany({
            where: { participants: { some: { userId } } },
            include: {
                participants: { include: { user: true } },
                messages: {
                    orderBy: { createdAt: 'desc' },
                    take: 1,
                    include: { sender: true },
                },
            },
            orderBy: { updatedAt: 'desc' },
        });
        console.log(`[getChatsForUser] Found ${chats.length} chats`);
        return chats;
    }
    async createMessage(senderId, dto) {
        console.log('[createMessage] Sender:', senderId, 'DTO:', dto);
        let chatId = dto.chatId;
        if (!chatId && dto.receiverId) {
            console.log('[createMessage] Checking existing chat between:', senderId, dto.receiverId);
            const existingChat = await this.findChatBetweenUsers(senderId, dto.receiverId);
            if (existingChat) {
                console.log('[createMessage] Existing chat found:', existingChat.id);
                chatId = existingChat.id;
            }
            else {
                console.log('[createMessage] No chat found. Creating new chat...');
                const newChat = await this.createChat([senderId, dto.receiverId]);
                chatId = newChat.id;
            }
        }
        if (!chatId) {
            console.error('[createMessage] Chat not found!');
            throw new common_1.NotFoundException('Chat not found');
        }
        const message = await this.prisma.message.create({
            data: {
                chatId,
                senderId,
                message: dto.message,
                type: dto.type ?? create_message_dto_1.MessageType.TEXT,
            },
            include: { sender: true, chat: true },
        });
        console.log('[createMessage] New message created:', message.id);
        await this.prisma.chat.update({
            where: { id: chatId },
            data: { updatedAt: new Date() },
        });
        return { chatId, message };
    }
    async getMessages(chatId) {
        console.log('[getMessages] Chat:', chatId);
        const messages = await this.prisma.message.findMany({
            where: { chatId },
            include: { sender: true },
            orderBy: { createdAt: 'asc' },
        });
        console.log(`[getMessages] Found ${messages.length} messages`);
        return messages;
    }
    async findChatBetweenUsers(user1, user2) {
        console.log('[findChatBetweenUsers] Checking chat between:', user1, 'and', user2);
        const chat = await this.prisma.chat.findFirst({
            where: {
                AND: [
                    { participants: { some: { userId: user1 } } },
                    { participants: { some: { userId: user2 } } },
                ],
            },
            include: { participants: true },
        });
        if (chat) {
            console.log('[findChatBetweenUsers] Chat found:', chat.id);
        }
        else {
            console.log('[findChatBetweenUsers] No chat found');
        }
        return chat;
    }
    async setUserOnline(userId) {
        console.log('[setUserOnline] User online:', userId);
        await this.prisma.user.update({
            where: { id: userId },
            data: { isOnline: true },
        });
    }
    async setUserOffline(userId) {
        console.log('[setUserOffline] User offline:', userId);
        await this.prisma.user.update({
            where: { id: userId },
            data: { isOnline: false, lastSeen: new Date() },
        });
    }
    async getUserStatus(userId) {
        console.log('[getUserStatus] Fetching status for user:', userId);
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { isOnline: true, lastSeen: true },
        });
        if (!user) {
            console.error('[getUserStatus] User not found:', userId);
            throw new common_1.NotFoundException('User not found');
        }
        return user;
    }
    async markMessagesRead(chatId, userId) {
        console.log('[markMessagesRead] Marking messages as read in chat:', chatId, 'for user:', userId);
        const result = await this.prisma.message.updateMany({
            where: { chatId, senderId: { not: userId }, isRead: false },
            data: { isRead: true },
        });
        console.log('[markMessagesRead] Updated messages:', result.count);
    }
    async getUnreadCount(chatId, userId) {
        console.log('[getUnreadCount] Counting unread messages for user:', userId, 'in chat:', chatId);
        const count = await this.prisma.message.count({
            where: { chatId, senderId: { not: userId }, isRead: false },
        });
        console.log('[getUnreadCount] Unread messages:', count);
        return count;
    }
    async getAllUsers() {
        console.log('[getAllUsers] Fetching all users');
        const users = await this.prisma.user.findMany({
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                profileImg: true,
                isOnline: true,
                lastSeen: true,
            },
            orderBy: { firstName: 'asc' },
        });
        console.log('[getAllUsers] Found users:', users.length);
        return users;
    }
};
exports.MessageService = MessageService;
exports.MessageService = MessageService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MessageService);
//# sourceMappingURL=message.service.js.map