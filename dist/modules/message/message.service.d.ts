import { PrismaService } from 'src/core/prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';
export declare class MessageService {
    private prisma;
    constructor(prisma: PrismaService);
    createChat(participantIds: string[]): Promise<{
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
    getChatsForUser(userId: string): Promise<({
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
    createMessage(senderId: string, dto: CreateMessageDto): Promise<{
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
    findChatBetweenUsers(user1: string, user2: string): Promise<({
        participants: {
            id: string;
            userId: string;
            chatId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }) | null>;
    setUserOnline(userId: string): Promise<void>;
    setUserOffline(userId: string): Promise<void>;
    getUserStatus(userId: string): Promise<{
        isOnline: boolean;
        lastSeen: Date | null;
    }>;
    markMessagesRead(chatId: string, userId: string): Promise<void>;
    getUnreadCount(chatId: string, userId: string): Promise<number>;
    getAllUsers(): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        profileImg: string | null;
        isOnline: boolean;
        lastSeen: Date | null;
    }[]>;
}
