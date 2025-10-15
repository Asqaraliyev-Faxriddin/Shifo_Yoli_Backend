import { PrismaService } from 'src/core/prisma/prisma.service';
import { SendMessageDto, CreateChatDto, UpdateMessageDto, DeleteMessageDto, ReadMessageDto, GetMessagesDto, GetChatsDto } from './dto/create-message.dto';
export declare class MessageService {
    private prisma;
    constructor(prisma: PrismaService);
    createChat(senderId: string, dto: CreateChatDto): Promise<{
        message: string;
        chatId: string;
    }>;
    private saveFile;
    sendMessage(senderId: string, dto: SendMessageDto, file?: Express.Multer.File): Promise<{
        message: string;
        data: {
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
    updateMessage(userId: string, dto: UpdateMessageDto): Promise<{
        message: string;
        data: {
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
    deleteMessage(userId: string, dto: DeleteMessageDto): Promise<{
        message: string;
    }>;
    readMessages(userId: string, dto: ReadMessageDto): Promise<{
        message: string;
    }>;
    getMessages(userId: string, dto: GetMessagesDto): Promise<{
        message: string;
        total: number;
        data: {
            message: string | null;
            type: import(".prisma/client").$Enums.MessageType;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            isRead: boolean;
            chatId: string;
            senderId: string;
        }[];
    }>;
    getChats(userId: string, dto: GetChatsDto): Promise<{
        message: string;
        total: number;
        data: ({
            messages: {
                message: string | null;
                type: import(".prisma/client").$Enums.MessageType;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                isRead: boolean;
                chatId: string;
                senderId: string;
            }[];
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
        })[];
    }>;
}
