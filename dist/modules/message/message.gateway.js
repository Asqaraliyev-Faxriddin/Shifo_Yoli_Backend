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
let MessageGateway = class MessageGateway {
    messageService;
    jwtService;
    server;
    activeSockets = new Map();
    typingState = {};
    constructor(messageService, jwtService) {
        this.messageService = messageService;
        this.jwtService = jwtService;
    }
    afterInit() {
        console.log('✅ [Gateway] Chat gateway initialized');
    }
    async handleConnection(client) {
        try {
            console.log(`⚡ [Gateway] New client trying to connect: ${client.id}`);
            const token = client.handshake.auth?.token ?? client.handshake.headers['authorization'];
            if (!token) {
                console.warn('❌ [Gateway] No token, disconnecting');
                return client.disconnect();
            }
            const realToken = typeof token === 'string' && token.startsWith('Bearer ')
                ? token.split(' ')[1]
                : token;
            const payload = this.jwtService.verify(realToken);
            const userId = payload.sub || payload.id;
            if (!userId) {
                console.warn('❌ [Gateway] Invalid token payload, disconnecting');
                return client.disconnect();
            }
            const sockets = this.activeSockets.get(userId) ?? new Set();
            sockets.add(client.id);
            this.activeSockets.set(userId, sockets);
            client.join(`user_${userId}`);
            client.userId = userId;
            await this.messageService.setUserOnline(userId);
            this.server.emit('user_status_changed', { userId, isOnline: true });
            this.server.to(`user_${userId}`).emit('user_online', { userId });
            console.log(`🔗 [Gateway] User connected: user=${userId}, socket=${client.id}`);
        }
        catch (err) {
            console.error('❌ [Gateway] WS connection error:', err?.message ?? err);
            client.disconnect();
        }
    }
    async handleDisconnect(client) {
        const userId = client.userId;
        console.log(`⚡ [Gateway] Client disconnected: ${client.id}, user=${userId}`);
        if (!userId)
            return;
        const sockets = this.activeSockets.get(userId);
        if (sockets) {
            sockets.delete(client.id);
            if (sockets.size === 0) {
                this.activeSockets.delete(userId);
                await this.messageService.setUserOffline(userId);
                const lastSeen = new Date().toISOString();
                this.server.emit('user_status_changed', {
                    userId,
                    isOnline: false,
                    lastSeen,
                });
                this.server.to(`user_${userId}`).emit('user_offline', {
                    userId,
                    lastSeen,
                });
                console.log(`❌ [Gateway] User went offline: ${userId}`);
            }
            else {
                this.activeSockets.set(userId, sockets);
                console.log(`⚡ [Gateway] User ${userId} still has ${sockets.size} active sockets`);
            }
        }
        for (const chatId of Object.keys(this.typingState)) {
            const set = this.typingState[chatId];
            if (set?.has(userId)) {
                set.delete(userId);
                if (set.size === 0)
                    delete this.typingState[chatId];
                this.server
                    .to(`chat_${chatId}`)
                    .emit('user_stop_typing', { chatId, userId });
                console.log(`⌨️ [Gateway] Typing cleared for user=${userId} in chat=${chatId}`);
            }
        }
    }
    async handleJoinChat(payload, client) {
        if (!payload?.chatId)
            return;
        client.join(`chat_${payload.chatId}`);
        client.emit('joined_chat', { chatId: payload.chatId });
        console.log(`👤 [Gateway] User ${client.userId} joined chat_${payload.chatId}`);
    }
    async handleSendMessage(payload, client) {
        const senderId = client.userId;
        if (!senderId) {
            console.warn('❌ [Gateway] Unauthenticated send_message attempt');
            return client.emit('error', { message: 'Unauthenticated' });
        }
        console.log(`📩 [Gateway] send_message from user=${senderId} chatId=${payload.chatId} receiverId=${payload.receiverId}`);
        let chatId = payload.chatId;
        try {
            if (!chatId && payload.receiverId) {
                const existingChat = await this.messageService.findChatBetweenUsers(senderId, payload.receiverId);
                if (existingChat) {
                    chatId = existingChat.id;
                    console.log(`[Gateway] Existing chat found: ${chatId}`);
                }
                else {
                    const newChat = await this.messageService.createChat([
                        senderId,
                        payload.receiverId,
                    ]);
                    chatId = newChat.id;
                    console.log(`[Gateway] New chat created: ${chatId}`);
                }
            }
            if (!chatId) {
                console.error('❌ [Gateway] Chat not found for send_message');
                return client.emit('error', { message: 'Chat not found' });
            }
            const result = await this.messageService.createMessage(senderId, {
                chatId,
                receiverId: payload.receiverId,
                message: payload.message,
                type: payload.type ?? create_message_dto_1.MessageType.TEXT,
            });
            const out = {
                id: result.message.id,
                chatId: result.chatId,
                message: result.message.message,
                sender: {
                    id: senderId,
                    firstName: result.message.sender.firstName,
                    lastName: result.message.sender.lastName,
                    profileImg: result.message.sender.profileImg,
                },
                createdAt: result.message.createdAt,
                type: result.message.type,
                isRead: result.message.isRead ?? false,
            };
            this.server.to(`chat_${chatId}`).emit('message', out);
            console.log(`✅ [Gateway] Message emitted to chat_${chatId}:`, out.id);
            if (payload.receiverId) {
                const receiverSockets = this.activeSockets.get(payload.receiverId);
                if (receiverSockets && receiverSockets.size > 0) {
                    await this.messageService.markMessagesRead(chatId, payload.receiverId);
                    out.isRead = true;
                    this.server
                        .to(`chat_${chatId}`)
                        .emit('message_read', { chatId, messageId: out.id, userId: payload.receiverId });
                    console.log(`👀 [Gateway] Receiver online, message marked as read: ${out.id}`);
                }
            }
        }
        catch (err) {
            console.error('❌ [Gateway] send_message error:', err?.message ?? err);
            client.emit('error', { message: err?.message ?? 'Unknown error' });
        }
    }
    handleTyping(payload, client) {
        const userId = client.userId;
        if (!userId || !payload?.chatId)
            return;
        const chatId = payload.chatId;
        const set = this.typingState[chatId] ?? new Set();
        if (set.has(userId))
            return;
        set.add(userId);
        this.typingState[chatId] = set;
        client.to(`chat_${chatId}`).emit('user_typing', { chatId, userId });
        console.log(`⌨️ [Gateway] User ${userId} typing in chat=${chatId}`);
    }
    handleStopTyping(payload, client) {
        const userId = client.userId;
        if (!userId || !payload?.chatId)
            return;
        const chatId = payload.chatId;
        const set = this.typingState[chatId];
        if (!set || !set.has(userId))
            return;
        set.delete(userId);
        if (set.size === 0)
            delete this.typingState[chatId];
        client.to(`chat_${chatId}`).emit('user_stop_typing', { chatId, userId });
        console.log(`✋ [Gateway] User ${userId} stopped typing in chat=${chatId}`);
    }
    async handleGetUserStatus(payload, client) {
        try {
            if (!payload?.userId)
                return;
            const status = await this.messageService.getUserStatus(payload.userId);
            client.emit('user_status', {
                userId: payload.userId,
                isOnline: status.isOnline,
                lastSeen: status.lastSeen,
            });
            console.log(`📡 [Gateway] Sent user status for ${payload.userId}`);
        }
        catch (err) {
            console.error('❌ [Gateway] get_user_status error:', err?.message ?? err);
            client.emit('error', { message: err?.message ?? 'Failed to get status' });
        }
    }
};
exports.MessageGateway = MessageGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], MessageGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('join_chat'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], MessageGateway.prototype, "handleJoinChat", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('send_message'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], MessageGateway.prototype, "handleSendMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('typing'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], MessageGateway.prototype, "handleTyping", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('stop_typing'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], MessageGateway.prototype, "handleStopTyping", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('get_user_status'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], MessageGateway.prototype, "handleGetUserStatus", null);
exports.MessageGateway = MessageGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: { origin: '*' },
    }),
    __metadata("design:paramtypes", [message_service_1.MessageService,
        jwt_1.JwtService])
], MessageGateway);
//# sourceMappingURL=message.gateway.js.map