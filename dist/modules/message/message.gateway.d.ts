import { OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageService } from './message.service';
import { JwtService } from '@nestjs/jwt';
export declare class MessageGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private readonly messageService;
    private readonly jwtService;
    server: Server;
    private activeSockets;
    private typingState;
    constructor(messageService: MessageService, jwtService: JwtService);
    afterInit(): void;
    handleConnection(client: Socket): Promise<Socket<import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, any> | undefined>;
    handleDisconnect(client: Socket): Promise<void>;
    handleJoinChat(payload: {
        chatId: string;
    }, client: Socket): Promise<void>;
    handleSendMessage(payload: {
        message: string;
        chatId?: string;
        receiverId?: string;
        type?: string;
    }, client: Socket): Promise<boolean | undefined>;
    handleTyping(payload: {
        chatId: string;
    }, client: Socket): void;
    handleStopTyping(payload: {
        chatId: string;
    }, client: Socket): void;
    handleGetUserStatus(payload: {
        userId: string;
    }, client: Socket): Promise<void>;
}
