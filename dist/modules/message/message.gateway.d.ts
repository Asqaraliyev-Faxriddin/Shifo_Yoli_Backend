import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageService } from './message.service';
import { JwtService } from '@nestjs/jwt';
import { SendMessageDto, CreateChatDto, UpdateMessageDto, DeleteMessageDto, ReadMessageDto, GetMessagesDto, GetChatsDto } from './dto/create-message.dto';
import { PrismaService } from 'src/core/prisma/prisma.service';
export declare class MessageGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly messageService;
    private readonly jwtService;
    private readonly prisma;
    server: Server;
    private onlineUsers;
    constructor(messageService: MessageService, jwtService: JwtService, prisma: PrismaService);
    private saveBase64File;
    handleConnection(client: Socket): Promise<void>;
    handleDisconnect(client: Socket): Promise<void>;
    handleGetOnlineUsers(client: Socket): Promise<void>;
    handleCreateChat(dto: CreateChatDto, client: Socket): Promise<void>;
    handleSendMessage(payload: Partial<SendMessageDto> & {
        fileBase64?: string;
        fileName?: string;
    }, client: Socket): Promise<void>;
    handleUpdateMessage(dto: UpdateMessageDto, client: Socket): Promise<void>;
    handleDeleteMessage(dto: DeleteMessageDto, client: Socket): Promise<void>;
    handleReadMessages(dto: ReadMessageDto, client: Socket): Promise<void>;
    handleGetMessages(dto: GetMessagesDto, client: Socket): Promise<void>;
    handleGetChats(dto: GetChatsDto, client: Socket): Promise<void>;
}
