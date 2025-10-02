import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    MessageBody,
    ConnectedSocket,
  } from '@nestjs/websockets';
  import { Server, Socket } from 'socket.io';
  import { MeetingService } from './meeting.service';
  
  @WebSocketGateway({ cors: true })
  export class MeetingGateway {
    @WebSocketServer()
    server: Server;
  
    constructor(private meetingService: MeetingService) {}
  
    @SubscribeMessage('joinMeeting')
    async handleJoin(@MessageBody() data: { meetingId: string; userId: string }, @ConnectedSocket() client: Socket) {
      client.join(data.meetingId);
      this.server.to(data.meetingId).emit('userJoined', data.userId);
    }
  
    @SubscribeMessage('sendMessage')
    async handleMessage(@MessageBody() data: { meetingId: string; senderId: string; content: string }) {
      const message = await this.meetingService.sendMessage(data.meetingId, data.senderId, data.content);
      this.server.to(data.meetingId).emit('newMessage', message);
    }
  
    // 🔊 Ovoz/video signaling (WebRTC uchun)
    @SubscribeMessage('signal')
    async handleSignal(@MessageBody() data: { meetingId: string; signal: any; userId: string }) {
      this.server.to(data.meetingId).emit('signal', data);
    }
  }
  