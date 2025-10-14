import { PrismaService } from 'src/core/prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';
export declare class MessageService {
    private prisma;
    constructor(prisma: PrismaService);
    createChat(participantIds: string[]): Promise<{
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
    getChatsForUser(userId: string): Promise<({
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
    createMessage(senderId: string, dto: CreateMessageDto): Promise<{
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
        email: string;
        lastName: string;
        firstName: string;
        id: string;
        profileImg: string | null;
        isOnline: boolean;
        lastSeen: Date | null;
    }[]>;
}
