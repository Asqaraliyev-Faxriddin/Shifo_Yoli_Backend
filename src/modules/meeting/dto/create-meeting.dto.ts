import { PartialType } from '@nestjs/mapped-types';
import { MeetingStatus, MessageType } from '@prisma/client';
import {
  IsDateString,
  IsOptional,
  IsInt,
  Min,
  IsEnum,
  IsString,
  IsUUID,
} from 'class-validator';

/**
 * Meeting yaratish DTO
 * ❌ userId yoki doctorId bo‘lmaydi, token orqali olinadi
 */
export class CreateMeetingDto {
  @IsOptional()
  @IsDateString()
  scheduledAt?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  duration?: number;

  @IsUUID()
  targetId: string; // kimga qo‘ng‘iroq qilinyapti (user yoki doctor id)
}

/**
 * Meeting yangilash DTO
 */
export class UpdateMeetingDto extends PartialType(CreateMeetingDto) {
  @IsOptional()
  @IsEnum(MeetingStatus)
  status?: MeetingStatus;
}

/**
 * Meeting ichida xabar yuborish DTO
 * ❌ senderId bo‘lmaydi, token orqali olinadi
 */
export class SendMessageDto {
  @IsUUID()
  meetingId: string;

  @IsString()
  content: string;

  @IsOptional()
  @IsEnum(MessageType)
  type?: MessageType;
}

/**
 * Meetingga qo‘shilish DTO
 * ❌ userId bo‘lmaydi, token orqali olinadi
 */
export class JoinMeetingDto {
  @IsUUID()
  meetingId: string;
}
