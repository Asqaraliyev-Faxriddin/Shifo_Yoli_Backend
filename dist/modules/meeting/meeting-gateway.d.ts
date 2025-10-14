import { Server, Socket } from 'socket.io';
import { MeetingService } from './meeting.service';
import { SendMessageDto } from './dto/create-meeting.dto';
export declare class MeetingGateway {
    private meetingService;
    server: Server;
    constructor(meetingService: MeetingService);
    handleJoin(data: {
        meetingId: string;
        userId: string;
    }, client: Socket): Promise<void>;
    handleMessage(data: SendMessageDto & {
        senderId: string;
    }): Promise<void>;
    handleSignal(data: {
        meetingId: string;
        signal: any;
        userId: string;
    }): Promise<void>;
}
