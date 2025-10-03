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
  
  interface TypingState {
    [chatId: string]: Set<string>; // chatId -> set of userIds typing
  }
  
  @WebSocketGateway({
    cors: { origin: '*' },
    // path: '/ws/chat',
  })
  export class MessageGateway
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
  {
    @WebSocketServer() server: Server;
  
    private activeSockets = new Map<string, Set<string>>();
    private typingState: TypingState = {};
  
    constructor(
      private readonly messageService: MessageService,
      private readonly jwtService: JwtService,
    ) {}
  
    /** Gateway initialized */
    afterInit() {
      console.log('✅ [Gateway] Chat gateway initialized');
    }
  
    /** New client connected */
    async handleConnection(client: Socket) {
      try {
        console.log(`⚡ [Gateway] New client trying to connect: ${client.id}`);
  
        const token =
          client.handshake.auth?.token ?? client.handshake.headers['authorization'];
        if (!token) {
          console.warn('❌ [Gateway] No token, disconnecting');
          return client.disconnect();
        }
  
        const realToken =
          typeof token === 'string' && token.startsWith('Bearer ')
            ? token.split(' ')[1]
            : token;
  
        const payload = this.jwtService.verify(realToken);
        const userId = payload.sub || payload.id;
        if (!userId) {
          console.warn('❌ [Gateway] Invalid token payload, disconnecting');
          return client.disconnect();
        }
  
        const sockets = this.activeSockets.get(userId) ?? new Set<string>();
        sockets.add(client.id);
        this.activeSockets.set(userId, sockets);
  
        client.join(`user_${userId}`);
        (client as any).userId = userId;
  
        await this.messageService.setUserOnline(userId);
  
        this.server.emit('user_status_changed', { userId, isOnline: true });
        this.server.to(`user_${userId}`).emit('user_online', { userId });
  
        console.log(`🔗 [Gateway] User connected: user=${userId}, socket=${client.id}`);
      } catch (err) {
        console.error('❌ [Gateway] WS connection error:', err?.message ?? err);
        client.disconnect();
      }
    }
  
    /** Client disconnected */
    async handleDisconnect(client: Socket) {
      const userId = (client as any).userId;
      console.log(`⚡ [Gateway] Client disconnected: ${client.id}, user=${userId}`);
  
      if (!userId) return;
  
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
        } else {
          this.activeSockets.set(userId, sockets);
          console.log(
            `⚡ [Gateway] User ${userId} still has ${sockets.size} active sockets`,
          );
        }
      }
  
      // Typing holatini tozalash
      for (const chatId of Object.keys(this.typingState)) {
        const set = this.typingState[chatId];
        if (set?.has(userId)) {
          set.delete(userId);
          if (set.size === 0) delete this.typingState[chatId];
          this.server
            .to(`chat_${chatId}`)
            .emit('user_stop_typing', { chatId, userId });
          console.log(
            `⌨️ [Gateway] Typing cleared for user=${userId} in chat=${chatId}`,
          );
        }
      }
    }
  
    /** Join a chat room */
    @SubscribeMessage('join_chat')
    async handleJoinChat(
      @MessageBody() payload: { chatId: string },
      @ConnectedSocket() client: Socket,
    ) {
      if (!payload?.chatId) return;
      client.join(`chat_${payload.chatId}`);
      client.emit('joined_chat', { chatId: payload.chatId });
      console.log(
        `👤 [Gateway] User ${(client as any).userId} joined chat_${payload.chatId}`,
      );
    }
  
    /** Send a message */
    @SubscribeMessage('send_message')
    async handleSendMessage(
      @MessageBody()
      payload: { message: string; chatId?: string; receiverId?: string; type?: string },
      @ConnectedSocket() client: Socket,
    ) {
      const senderId = (client as any).userId;
      if (!senderId) {
        console.warn('❌ [Gateway] Unauthenticated send_message attempt');
        return client.emit('error', { message: 'Unauthenticated' });
      }
  
      console.log(
        `📩 [Gateway] send_message from user=${senderId} chatId=${payload.chatId} receiverId=${payload.receiverId}`,
      );
  
      let chatId = payload.chatId;
  
      try {
        if (!chatId && payload.receiverId) {
          const existingChat = await this.messageService.findChatBetweenUsers(
            senderId,
            payload.receiverId,
          );
          if (existingChat) {
            chatId = existingChat.id;
            console.log(`[Gateway] Existing chat found: ${chatId}`);
          } else {
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
          type: (payload.type as MessageType) ?? MessageType.TEXT,
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
  
            console.log(
              `👀 [Gateway] Receiver online, message marked as read: ${out.id}`,
            );
          }
        }
      } catch (err) {
        console.error('❌ [Gateway] send_message error:', err?.message ?? err);
        client.emit('error', { message: err?.message ?? 'Unknown error' });
      }
    }
  
    /** Typing indicator */
    @SubscribeMessage('typing')
    handleTyping(
      @MessageBody() payload: { chatId: string },
      @ConnectedSocket() client: Socket,
    ) {
      const userId = (client as any).userId;
      if (!userId || !payload?.chatId) return;
  
      const chatId = payload.chatId;
      const set = this.typingState[chatId] ?? new Set<string>();
  
      if (set.has(userId)) return;
  
      set.add(userId);
      this.typingState[chatId] = set;
  
      client.to(`chat_${chatId}`).emit('user_typing', { chatId, userId });
      console.log(`⌨️ [Gateway] User ${userId} typing in chat=${chatId}`);
    }
  
    /** Stop typing */
    @SubscribeMessage('stop_typing')
    handleStopTyping(
      @MessageBody() payload: { chatId: string },
      @ConnectedSocket() client: Socket,
    ) {
      const userId = (client as any).userId;
      if (!userId || !payload?.chatId) return;
  
      const chatId = payload.chatId;
      const set = this.typingState[chatId];
  
      if (!set || !set.has(userId)) return;
  
      set.delete(userId);
      if (set.size === 0) delete this.typingState[chatId];
  
      client.to(`chat_${chatId}`).emit('user_stop_typing', { chatId, userId });
      console.log(`✋ [Gateway] User ${userId} stopped typing in chat=${chatId}`);
    }
  
    /** Get user status */
    @SubscribeMessage('get_user_status')
    async handleGetUserStatus(
      @MessageBody() payload: { userId: string },
      @ConnectedSocket() client: Socket,
    ) {
      try {
        if (!payload?.userId) return;
        const status = await this.messageService.getUserStatus(payload.userId);
        client.emit('user_status', {
          userId: payload.userId,
          isOnline: status.isOnline,
          lastSeen: status.lastSeen,
        });
        console.log(`📡 [Gateway] Sent user status for ${payload.userId}`);
      } catch (err) {
        console.error('❌ [Gateway] get_user_status error:', err?.message ?? err);
        client.emit('error', { message: err?.message ?? 'Failed to get status' });
      }
    }
  }
  