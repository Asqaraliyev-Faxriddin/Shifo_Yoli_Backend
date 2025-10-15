// src/messages/dto/messages.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  IsInt,
  Min,
} from 'class-validator';


export enum MessageType {
  TEXT = 'TEXT',
  FILE = 'FILE',
  VIDEO = 'VIDEO',
}


export class CreateChatDto {
  @ApiProperty({
    description: "Chat ochilayotgan foydalanuvchining id'si (receiver). Sender token orqali olinadi.",
    example: 'b6d9f3c2-1a2b-4f5d-8a71-111111111111',
  })
  @IsUUID()
  @IsNotEmpty()
  receiverId!: string;
}


export class SendMessageDto {
  @ApiPropertyOptional({
    description: 'Agar mavjud chatga yozilayotgan bo‘lsa — chatId yuboriladi. Aks holda receiverId orqali yangi chat yaratiladi.',
    example: 'd2f6a7e0-2b47-4b2b-8f8a-222222222222',
  })
  @IsOptional()
  @IsUUID()
  chatId?: string;

  @ApiPropertyOptional({
    description: 'Yangi chat yaratish uchun receiver (qabul qiluvchi) foydalanuvchi ID si.',
    example: 'b6d9f3c2-1a2b-4f5d-8a71-333333333333',
  })
  @IsOptional()
  @IsUUID()
  receiverId?: string;

  @ApiProperty({
    description: 'Xabar matni yoki fayl nomi.',
    example: 'Salom doktor, qanday ahvol?',
  })
  @IsString()
  @IsNotEmpty()
  message!: string;

  @ApiPropertyOptional({
    enum: MessageType,
    description: 'Xabar turi (TEXT, FILE, VIDEO).',
    example: MessageType.TEXT,
  })
  @IsOptional()
  @IsEnum(MessageType)
  type?: MessageType = MessageType.TEXT;

  @ApiPropertyOptional({
    description: 'Yuborilayotgan fayl (faqat FILE yoki VIDEO turlarida).',
    type: 'string',
    format: 'binary',
  })
  @IsOptional()
  file?: Express.Multer.File;
  
}


export class UpdateMessageDto {
  @ApiProperty({
    description: 'Tahrirlanayotgan message id',
    example: 'e3a1b5d6-aaaa-4c4c-9c9c-444444444444',
  })
  @IsUUID()
  @IsNotEmpty()
  messageId!: string;

  @ApiProperty({
    description: 'Yangilangan xabar matni',
    example: 'Yangi tahrirlangan matn.',
  })
  @IsString()
  @IsNotEmpty()
  newText!: string;
}

export class DeleteMessageDto {
  @ApiProperty({
    description: 'O\'chirayotgan message id',
    example: 'e3a1b5d6-aaaa-4c4c-9c9c-444444444444',
  })
  @IsUUID()
  @IsNotEmpty()
  messageId!: string;
}


export class ReadMessageDto {
  @ApiProperty({
    description: 'Qaysi chatdagi xabarlar o\'qildi deb belgilanmoqda',
    example: 'd2f6a7e0-2b47-4b2b-8f8a-222222222222',
  })
  @IsUUID()
  @IsNotEmpty()
  chatId!: string;
}


  export class GetMessagesDto {
    @ApiProperty({
      description: 'Qaysi chating xabarlarini olish (chatId)',
      example: 'd2f6a7e0-2b47-4b2b-8f8a-222222222222',
    })
    @IsUUID()
    @IsNotEmpty()
    chatId!: string;

  @ApiPropertyOptional({
    description: 'Sahifa (0 dan boshlanadi yoki 1 dan boshlash sizning implementatsiyangizga bog`liq).',
    example: 1,
    default: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Sahifadagi xabarlar soni (limit).',
    example: 30,
    default: 30,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number = 30;
}


export class GetChatsDto {
  @ApiPropertyOptional({
    description: 'Muayyan suhbatdoshni (bemor yoki shifokorni) filtrlash uchun.',
    example: '6f3f2a71-cc12-4b8f-8cfa-6dce53d1b001',
  })
  @IsOptional()
  @IsUUID()
  participantId?: string;

  @ApiPropertyOptional({
    description: 'Sahifa (1 dan boshlash tavsiya etiladi).',
    example: 1,
    default: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Sahifadagi elementlar soni.',
    example: 20,
    default: 20,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number = 20;
}


export default {
  CreateChatDto,
  SendMessageDto,
  UpdateMessageDto,
  DeleteMessageDto,
  ReadMessageDto,
  GetMessagesDto,
  GetChatsDto,
  MessageType,
};
