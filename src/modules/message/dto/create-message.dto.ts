// dto/create-message.dto.ts
import { IsNotEmpty, IsOptional, IsString, IsEnum, IsArray } from 'class-validator';

export class CreateChatDto {
  @IsArray()
  @IsNotEmpty({ each: true })
  participantIds: string[]; 
}

export enum MessageType {
  TEXT = 'TEXT',
  FILE = 'FILE',
  VIDEO = 'VIDEO',
}

export class CreateMessageDto {
  @IsOptional()
  chatId?: string; 

  @IsOptional()
  receiverId?: string; 

  @IsOptional()
  @IsString()
  message?: string;

  @IsOptional()
  @IsEnum(MessageType)
  type?: MessageType;
}
