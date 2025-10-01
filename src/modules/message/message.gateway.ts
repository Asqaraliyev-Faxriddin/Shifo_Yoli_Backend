    import {
        WebSocketGateway,
        OnGatewayInit,
        OnGatewayConnection,
        OnGatewayDisconnect,
        WebSocketServer,
        SubscribeMessage,
        MessageBody,
        ConnectedSocket,
    } from '@nestjs/websockets';
    import { Server, Socket } from 'socket.io';
    import { MessageService } from './message.service';
    import { JwtService } from '@nestjs/jwt';
    import { MessageType } from './dto/create-message.dto';
    
    @WebSocketGateway({
        cors: { origin: '*' },
        path: '/chat/socket.io/',
    })
    export class MessageGateway
        implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
    {
        @WebSocketServer() server: Server;
    
        private activeSockets = new Map<string, Set<string>>();
    
        constructor(
        private readonly messageService: MessageService,
        private readonly jwtService: JwtService,  
        ) {}
    
        afterInit() {
        console.log('✅ Chat gateway initialized');
        }
    
        handleConnection(client: Socket) {
        try {
            const token =
            client.handshake.auth?.token ??
            client.handshake.headers['authorization'];
    
            if (!token) {
            client.disconnect();
            return;
            }
    
            const realToken =
            typeof token === 'string' && token.startsWith('Bearer ')
                ? token.split(' ')[1]
                : token;
    
            const payload = this.jwtService.verify(realToken);
            const userId = payload.sub || payload.id;
    
            if (!userId) {
            client.disconnect();
            return;
            }
    
            const set = this.activeSockets.get(userId) ?? new Set<string>();
            set.add(client.id);
            this.activeSockets.set(userId, set);
    
            client.join(`user_${userId}`);
            (client as any).userId = userId;
    
            console.log(`🔗 WS connected: user=${userId} socket=${client.id}`);
        } catch (err) {
            console.error('❌ WS connection error:', err.message);
            client.disconnect();
        }
        }
    
        handleDisconnect(client: Socket) {
        for (const [userId, sockets] of this.activeSockets.entries()) {
            if (sockets.has(client.id)) {
            sockets.delete(client.id);
            if (sockets.size === 0) this.activeSockets.delete(userId);
            break;
            }
        }
        console.log('❌ socket disconnected', client.id);
        }
    
        @SubscribeMessage('join_chat')
        async handleJoinChat(
        @MessageBody() payload: { chatId: string },
        @ConnectedSocket() client: Socket,
        ) {
        if (!payload?.chatId) return;
        client.join(`chat_${payload.chatId}`);
        client.emit('joined_chat', { chatId: payload.chatId });
        }
    
        @SubscribeMessage('send_message')
        async handleSendMessage(
        @MessageBody()
        payload: { message: string; chatId?: string; receiverId?: string; type?: string },
        @ConnectedSocket() client: Socket,
        ) {
        try {
            const senderId = (client as any).userId;
            if (!senderId) {
            client.emit('error', { message: 'Unauthenticated' });
            return;
            }
    
            let chatId = payload.chatId;
    
            // agar chatId bo‘lmasa, receiverId bo‘yicha tekshiramiz
            if (!chatId && payload.receiverId) {
            // mavjud chatni topamiz
            const existingChat = await this.messageService.findChatBetweenUsers(
                senderId,
                payload.receiverId,
            );
    
            if (existingChat) {
                chatId = existingChat.id;
            } else {
                // yo‘q bo‘lsa yangi yaratamiz
                const newChat = await this.messageService.createChat([
                senderId,
                payload.receiverId,
                ]);
                chatId = newChat.id;
            }
            }
    
            if (!chatId) {
            client.emit('error', { message: 'Chat not found' });
            return;
            }
    
            // xabar yaratish
            const result = await this.messageService.createMessage(senderId, {
            chatId,
            receiverId: payload.receiverId,
            message: payload.message,
            type:  MessageType.TEXT,
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
            };
    
            // chat ichidagi hamma userlarga yuborish
            this.server.to(`chat_${chatId}`).emit('message', out);
    
            // receiverga ham yuborish (agar online bo‘lsa)
            if (payload.receiverId) {
            this.server.to(`user_${payload.receiverId}`).emit('message', out);
            }
    
            // senderga ham qaytarib yuboramiz
            client.emit('message', out);
        } catch (err) {
            console.error('❌ send_message error:', err.message);
            client.emit('error', { message: err.message });
        }
        }
    }
    