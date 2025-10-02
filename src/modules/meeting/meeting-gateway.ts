import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    MessageBody,
    ConnectedSocket,
  } from '@nestjs/websockets';
  import { Server, Socket } from 'socket.io';
  import { MeetingService } from './meeting.service';
  import { SendMessageDto } from './dto/create-meeting.dto';
  
  @WebSocketGateway({ cors: true })
  export class MeetingGateway {
    @WebSocketServer()
    server: Server;
  
    constructor(private meetingService: MeetingService) {}
  
    // ✅ Meetingga qo‘shilish
    @SubscribeMessage('joinMeeting')
    async handleJoin(
      @MessageBody() data: { meetingId: string; userId: string },
      @ConnectedSocket() client: Socket,
    ) {
      client.join(data.meetingId);
      this.server.to(data.meetingId).emit('userJoined', {
        userId: data.userId,
        message: `Foydalanuvchi meetingga qo‘shildi`,
      });
    }
  
    // ✅ Xabar yuborish
    @SubscribeMessage('sendMessage')
    async handleMessage(@MessageBody() data: SendMessageDto & { senderId: string }) {
      const dto: SendMessageDto = {
        meetingId: data.meetingId,
        content: data.content,
        type: 'TEXT', // default yoki kelgan qiymatdan olish mumkin
      };
  
      const message = await this.meetingService.sendMessage(dto, data.senderId);
  
      this.server.to(data.meetingId).emit('newMessage', message);
    }
  
    // ✅ WebRTC signaling
    @SubscribeMessage('signal')
    async handleSignal(
      @MessageBody() data: { meetingId: string; signal: any; userId: string },
    ) {
      this.server.to(data.meetingId).emit('signal', data);
    }
  }
  