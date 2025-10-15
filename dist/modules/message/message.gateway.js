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
exports.MessageGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const message_service_1 = require("./message.service");
const jwt_1 = require("@nestjs/jwt");
const create_message_dto_1 = require("./dto/create-message.dto");
const fs = require("fs");
const path = require("path");
const uuid_1 = require("uuid");
const prisma_service_1 = require("../../core/prisma/prisma.service");
let MessageGateway = class MessageGateway {
    messageService;
    jwtService;
    prisma;
    server;
    onlineUsers = new Map();
    constructor(messageService, jwtService, prisma) {
        this.messageService = messageService;
        this.jwtService = jwtService;
        this.prisma = prisma;
    }
    async saveBase64File(base64, originalName) {
        const uploadDir = path.join(process.cwd(), 'uploads', 'chat');
        if (!fs.existsSync(uploadDir))
            fs.mkdirSync(uploadDir, { recursive: true });
        const ext = originalName ? path.extname(originalName) : '';
        const fileName = `${(0, uuid_1.v4)()}${ext || ''}`;
        const filePath = path.join(uploadDir, fileName);
        const buffer = Buffer.from(base64, 'base64');
        fs.writeFileSync(filePath, buffer);
        console.log(`💾 Fayl saqlandi: ${filePath}`);
        return `/uploads/chat/${fileName}`;
    }
    async handleConnection(client) {
        try {
            const token = client.handshake.auth?.token ||
                (client.handshake.headers['authorization'] || '').toString().split(' ')[1];
            if (!token) {
                console.log('❌ Token topilmadi');
                client.emit('error', { message: 'Token topilmadi' });
                client.disconnect();
                return;
            }
            const payload = this.jwtService.verify(token);
            const userId = payload?.sub ?? payload?.id;
            if (!userId) {
                console.log('❌ Token noto‘g‘ri', payload);
                client.emit('error', { message: 'Token noto‘g‘ri' });
                client.disconnect();
                return;
            }
            client.data.userId = userId;
            console.log(`✅ Client ulandi: ${client.id}, userId: ${userId}`);
            const existing = this.onlineUsers.get(userId) ?? new Set();
            existing.add(client.id);
            this.onlineUsers.set(userId, existing);
            await this.prisma.user.update({
                where: { id: userId },
                data: { isOnline: true },
            });
            this.server.emit('user_online', { userId, online: true });
            this.server.to(client.id).emit('connected', { message: 'Ulandi', userId });
        }
        catch (err) {
            console.log('❌ Auth xatosi:', err);
            client.emit('error', { message: 'Auth xatosi', detail: err?.message ?? err });
            client.disconnect();
        }
    }
    async handleDisconnect(client) {
        try {
            const userId = client.data.userId;
            if (!userId)
                return;
            console.log(`⚡ Client uzildi: ${client.id}, userId: ${userId}`);
            const set = this.onlineUsers.get(userId);
            if (set) {
                set.delete(client.id);
                if (set.size === 0) {
                    this.onlineUsers.delete(userId);
                    await this.prisma.user.update({
                        where: { id: userId },
                        data: { isOnline: false, lastSeen: new Date() },
                    });
                    this.server.emit('user_online', { userId, online: false, lastSeen: new Date() });
                }
                else {
                    this.onlineUsers.set(userId, set);
                }
            }
        }
        catch (err) {
            console.log('❌ Disconnect xatosi:', err);
        }
    }
    async handleGetOnlineUsers(client) {
        const online = Array.from(this.onlineUsers.keys());
        console.log('🌐 Online users so‘rov:', online);
        this.server.to(client.id).emit('online_users', online);
    }
    async handleCreateChat(dto, client) {
        const senderId = client.data.userId;
        console.log('💬 Create chat:', dto, 'senderId:', senderId);
        try {
            const res = await this.messageService.createChat(senderId, dto);
            console.log('✅ Chat yaratildi:', res);
            this.server.to(client.id).emit('chat_created', res);
            const receiverSocketSet = this.onlineUsers.get(dto.receiverId);
            if (receiverSocketSet) {
                for (const sid of receiverSocketSet) {
                    this.server.to(sid).emit('chat_created_for_you', { chatId: res.chatId, from: senderId });
                    console.log(`📤 Chat xabari yuborildi receiverga: ${dto.receiverId}, socketId: ${sid}`);
                }
            }
        }
        catch (err) {
            console.log('❌ Create chat xatosi:', err);
            this.server.to(client.id).emit('error', { action: 'create_chat', message: err?.message ?? err });
        }
    }
    async handleSendMessage(payload, client) {
        console.log("wewewwe", payload);
        const senderId = client.data.userId;
        console.log('📨 Xabar kelmoqda:', payload, 'senderId:', senderId);
        try {
            let fileUrl;
            if (payload.fileBase64 && (payload.type === create_message_dto_1.MessageType.FILE || payload.type === create_message_dto_1.MessageType.VIDEO)) {
                fileUrl = await this.saveBase64File(payload.fileBase64, payload.fileName);
            }
            const dto = {
                chatId: payload.chatId,
                receiverId: payload.receiverId,
                message: fileUrl ? fileUrl : (payload.message ?? ''),
                type: payload.type ?? create_message_dto_1.MessageType.TEXT,
            };
            const res = await this.messageService.sendMessage(senderId, dto, undefined);
            console.log('✅ Xabar saqlandi va tayyor:', res.data);
            let receiverId = payload.receiverId;
            if (!receiverId && res?.data?.chatId) {
                const chat = await this.prisma.chat.findUnique({
                    where: { id: res.data.chatId },
                    include: { participants: true },
                });
                receiverId = chat?.participants?.find((p) => p.userId !== senderId)?.userId;
            }
            if (receiverId) {
                const receiverSockets = this.onlineUsers.get(receiverId);
                if (receiverSockets) {
                    for (const sid of receiverSockets) {
                        this.server.to(sid).emit('new_message', res.data);
                        console.log(`📤 Xabar yuborildi online userga: ${receiverId}, socketId: ${sid}`);
                    }
                }
            }
            this.server.to(client.id).emit('message_sent', res.data);
            console.log(`✔️ Xabar jo‘natildi senderga: ${senderId}`);
        }
        catch (err) {
            console.log('❌ Xabar yuborishda xato:', err);
            this.server.to(client.id).emit('error', { action: 'send_message', message: err?.message ?? err });
        }
    }
    async handleUpdateMessage(dto, client) {
        const userId = client.data.userId;
        console.log('✏️ Update message:', dto, 'userId:', userId);
        try {
            const res = await this.messageService.updateMessage(userId, dto);
            console.log('✅ Message updated:', res.data);
            this.server.emit('message_updated', res.data);
            this.server.to(client.id).emit('message_update_ok', res);
        }
        catch (err) {
            console.log('❌ Update message xatosi:', err);
            this.server.to(client.id).emit('error', { action: 'update_message', message: err?.message ?? err });
        }
    }
    async handleDeleteMessage(dto, client) {
        const userId = client.data.userId;
        console.log('🗑 Delete message:', dto, 'userId:', userId);
        try {
            const res = await this.messageService.deleteMessage(userId, dto);
            console.log('✅ Message deleted:', dto.messageId);
            this.server.emit('message_deleted', { id: dto.messageId });
            this.server.to(client.id).emit('message_delete_ok', res);
        }
        catch (err) {
            console.log('❌ Delete message xatosi:', err);
            this.server.to(client.id).emit('error', { action: 'delete_message', message: err?.message ?? err });
        }
    }
    async handleReadMessages(dto, client) {
        const userId = client.data.userId;
        console.log('📖 Read messages:', dto, 'userId:', userId);
        try {
            const res = await this.messageService.readMessages(userId, dto);
            this.server.to(client.id).emit('messages_read', res);
            const chat = await this.prisma.chat.findUnique({
                where: { id: dto.chatId },
                include: { participants: true },
            });
            if (chat) {
                for (const p of chat.participants) {
                    if (p.userId === userId)
                        continue;
                    const sockets = this.onlineUsers.get(p.userId);
                    if (sockets) {
                        for (const sid of sockets) {
                            this.server.to(sid).emit('messages_marked_read', { chatId: dto.chatId, by: userId });
                            console.log(`📬 Messages marked read by ${userId} for ${p.userId}`);
                        }
                    }
                }
            }
        }
        catch (err) {
            console.log('❌ Read messages xatosi:', err);
            this.server.to(client.id).emit('error', { action: 'read_messages', message: err?.message ?? err });
        }
    }
    async handleGetMessages(dto, client) {
        const userId = client.data.userId;
        console.log('📝 Get messages:', dto, 'userId:', userId);
        try {
            const res = await this.messageService.getMessages(userId, dto);
            console.log('✅ Messages list:', res);
            this.server.to(client.id).emit('messages_list', res);
        }
        catch (err) {
            console.log('❌ Get messages xatosi:', err);
            this.server.to(client.id).emit('error', { action: 'get_messages', message: err?.message ?? err });
        }
    }
    async handleGetChats(dto, client) {
        const userId = client.data.userId;
        console.log('💬 Get chats:', dto, 'userId:', userId);
        try {
            const res = await this.messageService.getChats(userId, dto);
            console.log('✅ Chats list:', res);
            this.server.to(client.id).emit('chats_list', res);
        }
        catch (err) {
            console.log('❌ Get chats xatosi:', err);
            this.server.to(client.id).emit('error', { action: 'get_chats', message: err?.message ?? err });
        }
    }
};
exports.MessageGateway = MessageGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], MessageGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('get_online_users'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], MessageGateway.prototype, "handleGetOnlineUsers", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('create_chat'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_message_dto_1.CreateChatDto,
        socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], MessageGateway.prototype, "handleCreateChat", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('send_message'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], MessageGateway.prototype, "handleSendMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('update_message'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_message_dto_1.UpdateMessageDto,
        socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], MessageGateway.prototype, "handleUpdateMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('delete_message'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_message_dto_1.DeleteMessageDto,
        socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], MessageGateway.prototype, "handleDeleteMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('read_messages'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_message_dto_1.ReadMessageDto,
        socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], MessageGateway.prototype, "handleReadMessages", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('get_messages'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_message_dto_1.GetMessagesDto,
        socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], MessageGateway.prototype, "handleGetMessages", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('get_chats'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_message_dto_1.GetChatsDto,
        socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], MessageGateway.prototype, "handleGetChats", null);
exports.MessageGateway = MessageGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        namespace: '/chat',
        cors: { origin: '*' },
    }),
    __metadata("design:paramtypes", [message_service_1.MessageService,
        jwt_1.JwtService,
        prisma_service_1.PrismaService])
], MessageGateway);
//# sourceMappingURL=message.gateway.js.map