// dto/create-message.dto.ts
import { IsNotEmpty, IsOptional, IsString, IsEnum } from 'class-validator';

export class CreateChatDto {
  @IsNotEmpty()
  participantIds: string[]; // userId lar
}

export enum MessageType {
  TEXT = 'TEXT',
  FILE = 'FILE',
  VIDEO = 'VIDEO',
}

export class CreateMessageDto {
  @IsNotEmpty()
  chatId: string;

  @IsOptional()
  receiverId?: string; // agar chat yo‘q bo‘lsa

  @IsOptional()
  @IsString()
  message?: string;

  @IsOptional()
  @IsEnum(MessageType)
  type?: MessageType;
}
