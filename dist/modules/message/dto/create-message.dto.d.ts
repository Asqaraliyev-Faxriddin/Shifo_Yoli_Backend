export declare enum MessageType {
    TEXT = "TEXT",
    FILE = "FILE",
    VIDEO = "VIDEO"
}
export declare class CreateChatDto {
    receiverId: string;
}
export declare class SendMessageDto {
    chatId?: string;
    receiverId?: string;
    message: string;
    type?: MessageType;
    file?: Express.Multer.File;
}
export declare class UpdateMessageDto {
    messageId: string;
    newText: string;
}
export declare class DeleteMessageDto {
    messageId: string;
}
export declare class ReadMessageDto {
    chatId: string;
}
export declare class GetMessagesDto {
    chatId: string;
    page?: number;
    limit?: number;
}
export declare class GetChatsDto {
    participantId?: string;
    page?: number;
    limit?: number;
}
declare const _default: {
    CreateChatDto: typeof CreateChatDto;
    SendMessageDto: typeof SendMessageDto;
    UpdateMessageDto: typeof UpdateMessageDto;
    DeleteMessageDto: typeof DeleteMessageDto;
    ReadMessageDto: typeof ReadMessageDto;
    GetMessagesDto: typeof GetMessagesDto;
    GetChatsDto: typeof GetChatsDto;
    MessageType: typeof MessageType;
};
export default _default;
