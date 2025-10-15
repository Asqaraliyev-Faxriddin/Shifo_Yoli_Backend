import { MessageService } from './message.service';
import { CreateMessageDto, CreateChatDto } from './dto/create-message.dto';
import { PrismaService } from 'src/core/prisma/prisma.service';
export declare class MessageController {
    private readonly svc;
    private prisma;
    constructor(svc: MessageService, prisma: PrismaService);
    getChats(req: any): Promise<({
        participants: ({
            user: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                email: string;
                firstName: string;
                lastName: string;
                password: string;
                age: number;
                month: number | null;
                day: number | null;
                phoneNumber: string | null;
                role: import(".prisma/client").$Enums.UserRole;
                profileImg: string | null;
                isActive: boolean;
                isOnline: boolean;
                lastSeen: Date | null;
            };
        } & {
            id: string;
            userId: string;
            chatId: string;
        })[];
        messages: ({
            sender: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                email: string;
                firstName: string;
                lastName: string;
                password: string;
                age: number;
                month: number | null;
                day: number | null;
                phoneNumber: string | null;
                role: import(".prisma/client").$Enums.UserRole;
                profileImg: string | null;
                isActive: boolean;
                isOnline: boolean;
                lastSeen: Date | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            chatId: string;
            message: string | null;
            senderId: string;
            type: import(".prisma/client").$Enums.MessageType;
            isRead: boolean;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    getusers(req: any): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        profileImg: string | null;
        isOnline: boolean;
        lastSeen: Date | null;
    }[]>;
    createChat(dto: CreateChatDto): Promise<{
        participants: ({
            user: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                email: string;
                firstName: string;
                lastName: string;
                password: string;
                age: number;
                month: number | null;
                day: number | null;
                phoneNumber: string | null;
                role: import(".prisma/client").$Enums.UserRole;
                profileImg: string | null;
                isActive: boolean;
                isOnline: boolean;
                lastSeen: Date | null;
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
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            firstName: string;
            lastName: string;
            password: string;
            age: number;
            month: number | null;
            day: number | null;
            phoneNumber: string | null;
            role: import(".prisma/client").$Enums.UserRole;
            profileImg: string | null;
            isActive: boolean;
            isOnline: boolean;
            lastSeen: Date | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        chatId: string;
        message: string | null;
        senderId: string;
        type: import(".prisma/client").$Enums.MessageType;
        isRead: boolean;
    })[]>;
    sendMessage(req: any, dto: CreateMessageDto): Promise<{
        chatId: any;
        message: {
            chat: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
            };
            sender: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                email: string;
                firstName: string;
                lastName: string;
                password: string;
                age: number;
                month: number | null;
                day: number | null;
                phoneNumber: string | null;
                role: import(".prisma/client").$Enums.UserRole;
                profileImg: string | null;
                isActive: boolean;
                isOnline: boolean;
                lastSeen: Date | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            chatId: string;
            message: string | null;
            senderId: string;
            type: import(".prisma/client").$Enums.MessageType;
            isRead: boolean;
        };
    }>;
}
