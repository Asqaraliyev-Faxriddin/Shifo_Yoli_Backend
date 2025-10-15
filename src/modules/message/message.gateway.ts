// src/messages/message.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageService } from './message.service';
import { JwtService } from '@nestjs/jwt';
import {
  SendMessageDto,
  CreateChatDto,
  UpdateMessageDto,
  DeleteMessageDto,
  ReadMessageDto,
  GetMessagesDto,
  GetChatsDto,
  MessageType,
} from './dto/create-message.dto';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuid } from 'uuid';
import { PrismaService } from 'src/core/prisma/prisma.service';

@WebSocketGateway({
  namespace: '/chat',
  cors: { origin: '*' },
})
export class MessageGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  // userId -> Set of socketIds (supports multi-device)
  private onlineUsers = new Map<string, Set<string>>();

  constructor(
    private readonly messageService: MessageService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  private async saveBase64File(base64: string, originalName?: string) {
    const uploadDir = path.join(process.cwd(), 'uploads', 'chat');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    const ext = originalName ? path.extname(originalName) : '';
    const fileName = `${uuid()}${ext || ''}`;
    const filePath = path.join(uploadDir, fileName);

    const buffer = Buffer.from(base64, 'base64');
    fs.writeFileSync(filePath, buffer);
    console.log(`💾 Fayl saqlandi: ${filePath}`);
    return `/uploads/chat/${fileName}`;
  }

  async handleConnection(client: Socket) {
    try {
      const token =
        client.handshake.auth?.token ||
        (client.handshake.headers['authorization'] || '').toString().split(' ')[1];
      if (!token) {
        console.log('❌ Token topilmadi');
        client.emit('error', { message: 'Token topilmadi' });
        client.disconnect();
        return;
      }

      const payload: any = this.jwtService.verify(token);
      const userId = payload?.sub ?? payload?.id;
      if (!userId) {
        console.log('❌ Token noto‘g‘ri', payload);
        client.emit('error', { message: 'Token noto‘g‘ri' });
        client.disconnect();
        return;
      }

      client.data.userId = userId;

      console.log(`✅ Client ulandi: ${client.id}, userId: ${userId}`);

      const existing = this.onlineUsers.get(userId) ?? new Set<string>();
      existing.add(client.id);
      this.onlineUsers.set(userId, existing);

      await this.prisma.user.update({
        where: { id: userId },
        data: { isOnline: true },
      });

      this.server.emit('user_online', { userId, online: true });
      this.server.to(client.id).emit('connected', { message: 'Ulandi', userId });
    } catch (err: any) {
      console.log('❌ Auth xatosi:', err);
      client.emit('error', { message: 'Auth xatosi', detail: err?.message ?? err });
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    try {
      const userId: string = client.data.userId;
      if (!userId) return;

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
        } else {
          this.onlineUsers.set(userId, set);
        }
      }
    } catch (err) {
      console.log('❌ Disconnect xatosi:', err);
    }
  }

  @SubscribeMessage('get_online_users')
  async handleGetOnlineUsers(@ConnectedSocket() client: Socket) {
    const online = Array.from(this.onlineUsers.keys());
    console.log('🌐 Online users so‘rov:', online);
    this.server.to(client.id).emit('online_users', online);
  }

  @SubscribeMessage('create_chat')
  async handleCreateChat(
    @MessageBody() dto: CreateChatDto,
    @ConnectedSocket() client: Socket,
  ) {
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
    } catch (err: any) {
      console.log('❌ Create chat xatosi:', err);
      this.server.to(client.id).emit('error', { action: 'create_chat', message: err?.message ?? err });
    }
  }

  @SubscribeMessage('send_message')
  async handleSendMessage(
    @MessageBody() payload: Partial<SendMessageDto> & { fileBase64?: string; fileName?: string },
    @ConnectedSocket() client: Socket,
  ) {


    console.log("wewewwe",payload);
    

    const senderId = client.data.userId;
    console.log('📨 Xabar kelmoqda:', payload, 'senderId:', senderId);

    try {
      let fileUrl: string | undefined;

      if (payload.fileBase64 && (payload.type === MessageType.FILE || payload.type === MessageType.VIDEO)) {
        fileUrl = await this.saveBase64File(payload.fileBase64, payload.fileName);
      }

      const dto: SendMessageDto = {
        chatId: payload.chatId,
        receiverId: payload.receiverId,
        message: fileUrl ? fileUrl : (payload.message ?? ''),
        type: payload.type ?? MessageType.TEXT,
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
    } catch (err: any) {
      console.log('❌ Xabar yuborishda xato:', err);
      this.server.to(client.id).emit('error', { action: 'send_message', message: err?.message ?? err });
    }
  }

  @SubscribeMessage('update_message')
  async handleUpdateMessage(
    @MessageBody() dto: UpdateMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    const userId = client.data.userId;
    console.log('✏️ Update message:', dto, 'userId:', userId);
    try {
      const res = await this.messageService.updateMessage(userId, dto);
      console.log('✅ Message updated:', res.data);
      this.server.emit('message_updated', res.data);
      this.server.to(client.id).emit('message_update_ok', res);
    } catch (err: any) {
      console.log('❌ Update message xatosi:', err);
      this.server.to(client.id).emit('error', { action: 'update_message', message: err?.message ?? err });
    }
  }

  @SubscribeMessage('delete_message')
  async handleDeleteMessage(
    @MessageBody() dto: DeleteMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    const userId = client.data.userId;
    console.log('🗑 Delete message:', dto, 'userId:', userId);
    try {
      const res = await this.messageService.deleteMessage(userId, dto);
      console.log('✅ Message deleted:', dto.messageId);
      this.server.emit('message_deleted', { id: dto.messageId });
      this.server.to(client.id).emit('message_delete_ok', res);
    } catch (err: any) {
      console.log('❌ Delete message xatosi:', err);
      this.server.to(client.id).emit('error', { action: 'delete_message', message: err?.message ?? err });
    }
  }

  @SubscribeMessage('read_messages')
  async handleReadMessages(
    @MessageBody() dto: ReadMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
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
          if (p.userId === userId) continue;
          const sockets = this.onlineUsers.get(p.userId);
          if (sockets) {
            for (const sid of sockets) {
              this.server.to(sid).emit('messages_marked_read', { chatId: dto.chatId, by: userId });
              console.log(`📬 Messages marked read by ${userId} for ${p.userId}`);
            }
          }
        }
      }
    } catch (err: any) {
      console.log('❌ Read messages xatosi:', err);
      this.server.to(client.id).emit('error', { action: 'read_messages', message: err?.message ?? err });
    }
  }

  @SubscribeMessage('get_messages')
  async handleGetMessages(
    @MessageBody() dto: GetMessagesDto,
    @ConnectedSocket() client: Socket,
  ) {
    const userId = client.data.userId;
    console.log('📝 Get messages:', dto, 'userId:', userId);
    try {
      const res = await this.messageService.getMessages(userId, dto);
      console.log('✅ Messages list:', res);
      this.server.to(client.id).emit('messages_list', res);
    } catch (err: any) {
      console.log('❌ Get messages xatosi:', err);
      this.server.to(client.id).emit('error', { action: 'get_messages', message: err?.message ?? err });
    }
  }

  @SubscribeMessage('get_chats')
  async handleGetChats(
    @MessageBody() dto: GetChatsDto,
    @ConnectedSocket() client: Socket,
  ) {
    const userId = client.data.userId;
    console.log('💬 Get chats:', dto, 'userId:', userId);
    try {
      const res = await this.messageService.getChats(userId, dto);
      console.log('✅ Chats list:', res);
      this.server.to(client.id).emit('chats_list', res);
    } catch (err: any) {
      console.log('❌ Get chats xatosi:', err);
      this.server.to(client.id).emit('error', { action: 'get_chats', message: err?.message ?? err });
    }
  }
}
