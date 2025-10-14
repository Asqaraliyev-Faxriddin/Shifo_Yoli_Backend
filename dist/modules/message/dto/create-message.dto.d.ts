export declare class CreateChatDto {
    participantIds: string[];
}
export declare enum MessageType {
    TEXT = "TEXT",
    FILE = "FILE",
    VIDEO = "VIDEO"
}
export declare class CreateMessageDto {
    chatId?: string;
    receiverId?: string;
    message?: string;
    type?: MessageType;
}
