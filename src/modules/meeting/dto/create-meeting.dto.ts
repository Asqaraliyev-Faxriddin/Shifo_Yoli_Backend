import { PartialType } from '@nestjs/mapped-types';
import { MeetingStatus, MessageType } from '@prisma/client';
import {
  IsUUID,
  IsDateString,
  IsOptional,
  IsInt,
  Min,
  IsEnum,
  IsString,
} from 'class-validator';

// Meeting yaratish DTO
export class CreateMeetingDto {
  @IsUUID()
  userId: string;

  @IsUUID()
  doctorId: string;

  @IsOptional()
  @IsDateString()
  scheduledAt?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  duration?: number;
}

// Meeting yangilash DTO
export class UpdateMeetingDto extends PartialType(CreateMeetingDto) {
  @IsOptional()
  @IsEnum(MeetingStatus)
  status?: MeetingStatus;
}

// Meeting ichida xabar yuborish DTO
export class SendMessageDto {
  @IsUUID()
  meetingId: string;

  @IsUUID()
  senderId: string;

  @IsString()
  content: string;

  @IsOptional()
  @IsEnum(MessageType)
  type?: MessageType;
}

// Meetingga qo‘shilish DTO
export class JoinMeetingDto {
  @IsUUID()
  meetingId: string;

  @IsUUID()
  userId: string;
}
