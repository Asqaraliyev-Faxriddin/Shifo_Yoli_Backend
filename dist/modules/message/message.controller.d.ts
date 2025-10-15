import { MessageService } from './message.service';
import { SendMessageDto, CreateChatDto, UpdateMessageDto, DeleteMessageDto, ReadMessageDto, GetMessagesDto, GetChatsDto } from './dto/create-message.dto';
export declare class MessageController {
    private readonly messageService;
    constructor(messageService: MessageService);
    createChat(req: any, dto: CreateChatDto): Promise<{
        message: string;
        chatId: string;
    }>;
    sendMessage(req: any, dto: SendMessageDto, file?: Express.Multer.File): Promise<{
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
    updateMessage(req: any, dto: UpdateMessageDto): Promise<{
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
    deleteMessage(req: any, dto: DeleteMessageDto): Promise<{
        message: string;
    }>;
    readMessages(req: any, dto: ReadMessageDto): Promise<{
        message: string;
    }>;
    getMessages(req: any, dto: GetMessagesDto): Promise<{
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
    getChats(req: any, dto: GetChatsDto): Promise<{
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
