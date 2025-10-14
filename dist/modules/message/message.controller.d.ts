import { MessageService } from './message.service';
import { CreateMessageDto, CreateChatDto } from './dto/create-message.dto';
import { PrismaService } from 'src/core/prisma/prisma.service';
export declare class MessageController {
    private readonly svc;
    private prisma;
    constructor(svc: MessageService, prisma: PrismaService);
    getChats(req: any): Promise<({
        messages: ({
            sender: {
                email: string;
                password: string;
                lastName: string;
                firstName: string;
                age: number;
                month: number | null;
                day: number | null;
                id: string;
                phoneNumber: string | null;
                role: import(".prisma/client").$Enums.UserRole;
                profileImg: string | null;
                isActive: boolean;
                isOnline: boolean;
                lastSeen: Date | null;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            message: string | null;
            type: import(".prisma/client").$Enums.MessageType;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            isRead: boolean;
            chatId: string;
            senderId: string;
        })[];
        participants: ({
            user: {
                email: string;
                password: string;
                lastName: string;
                firstName: string;
                age: number;
                month: number | null;
                day: number | null;
                id: string;
                phoneNumber: string | null;
                role: import(".prisma/client").$Enums.UserRole;
                profileImg: string | null;
                isActive: boolean;
                isOnline: boolean;
                lastSeen: Date | null;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: string;
            userId: string;
            chatId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    getusers(req: any): Promise<{
        email: string;
        lastName: string;
        firstName: string;
        id: string;
        profileImg: string | null;
        isOnline: boolean;
        lastSeen: Date | null;
    }[]>;
    createChat(dto: CreateChatDto): Promise<{
        participants: ({
            user: {
                email: string;
                password: string;
                lastName: string;
                firstName: string;
                age: number;
                month: number | null;
                day: number | null;
                id: string;
                phoneNumber: string | null;
                role: import(".prisma/client").$Enums.UserRole;
                profileImg: string | null;
                isActive: boolean;
                isOnline: boolean;
                lastSeen: Date | null;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: string;
            userId: string;
            chatId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getMessages(chatId: string): Promise<({
        sender: {
            email: string;
            password: string;
            lastName: string;
            firstName: string;
            age: number;
            month: number | null;
            day: number | null;
            id: string;
            phoneNumber: string | null;
            role: import(".prisma/client").$Enums.UserRole;
            profileImg: string | null;
            isActive: boolean;
            isOnline: boolean;
            lastSeen: Date | null;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        message: string | null;
        type: import(".prisma/client").$Enums.MessageType;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isRead: boolean;
        chatId: string;
        senderId: string;
    })[]>;
    sendMessage(req: any, dto: CreateMessageDto): Promise<{
        chatId: string;
        message: {
            chat: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
            };
            sender: {
                email: string;
                password: string;
                lastName: string;
                firstName: string;
                age: number;
                month: number | null;
                day: number | null;
                id: string;
                phoneNumber: string | null;
                role: import(".prisma/client").$Enums.UserRole;
                profileImg: string | null;
                isActive: boolean;
                isOnline: boolean;
                lastSeen: Date | null;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            message: string | null;
            type: import(".prisma/client").$Enums.MessageType;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            isRead: boolean;
            chatId: string;
            senderId: string;
        };
    }>;
}
