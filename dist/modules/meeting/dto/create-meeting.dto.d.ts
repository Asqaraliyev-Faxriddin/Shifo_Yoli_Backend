import { MeetingStatus, MessageType } from '@prisma/client';
export declare class CreateMeetingDto {
    scheduledAt?: string;
    duration?: number;
    targetId: string;
}
declare const UpdateMeetingDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateMeetingDto>>;
export declare class UpdateMeetingDto extends UpdateMeetingDto_base {
    status?: MeetingStatus;
}
export declare class SendMessageDto {
    meetingId: string;
    content: string;
    type?: MessageType;
}
export declare class JoinMeetingDto {
    meetingId: string;
}
export {};
