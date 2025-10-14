import { PrismaService } from 'src/core/prisma/prisma.service';
import { CreateMeetingDto, UpdateMeetingDto, SendMessageDto } from './dto/create-meeting.dto';
export declare class MeetingService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateMeetingDto, currentUserId: string): Promise<{
        success: boolean;
        message: string;
        data: {
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
            doctor: {
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
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            doctorId: string;
            scheduledAt: Date | null;
            duration: number | null;
            meetingLink: string | null;
            status: import(".prisma/client").$Enums.MeetingStatus;
        };
    }>;
    findAllForUser(userId: string): Promise<{
        success: boolean;
        message: string;
        data: ({
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
            doctor: {
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
            messages: ({
                sender: {
                    lastName: string;
                    firstName: string;
                    id: string;
                };
            } & {
                type: import(".prisma/client").$Enums.MessageType;
                id: string;
                createdAt: Date;
                content: string | null;
                senderId: string;
                meetingId: string;
            })[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            doctorId: string;
            scheduledAt: Date | null;
            duration: number | null;
            meetingLink: string | null;
            status: import(".prisma/client").$Enums.MeetingStatus;
        })[];
    }>;
    findAllForAdmin(): Promise<{
        success: boolean;
        message: string;
        data: ({
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
            doctor: {
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
            messages: ({
                sender: {
                    lastName: string;
                    firstName: string;
                    id: string;
                };
            } & {
                type: import(".prisma/client").$Enums.MessageType;
                id: string;
                createdAt: Date;
                content: string | null;
                senderId: string;
                meetingId: string;
            })[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            doctorId: string;
            scheduledAt: Date | null;
            duration: number | null;
            meetingLink: string | null;
            status: import(".prisma/client").$Enums.MeetingStatus;
        })[];
    }>;
    findOne(id: string, currentUserId: string, isSuperAdmin?: boolean): Promise<{
        success: boolean;
        message: string;
        data: {
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
            doctor: {
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
            messages: ({
                sender: {
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
                type: import(".prisma/client").$Enums.MessageType;
                id: string;
                createdAt: Date;
                content: string | null;
                senderId: string;
                meetingId: string;
            })[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            doctorId: string;
            scheduledAt: Date | null;
            duration: number | null;
            meetingLink: string | null;
            status: import(".prisma/client").$Enums.MeetingStatus;
        };
    }>;
    update(id: string, dto: UpdateMeetingDto, currentUserId: string, isSuperAdmin?: boolean): Promise<{
        success: boolean;
        message: string;
        data: {
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
            doctor: {
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
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            doctorId: string;
            scheduledAt: Date | null;
            duration: number | null;
            meetingLink: string | null;
            status: import(".prisma/client").$Enums.MeetingStatus;
        };
    }>;
    remove(id: string, currentUserId: string, isSuperAdmin?: boolean): Promise<{
        success: boolean;
        message: string;
    }>;
    sendMessage(dto: SendMessageDto, currentUserId: string): Promise<{
        success: boolean;
        message: string;
        data: {
            sender: {
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
            type: import(".prisma/client").$Enums.MessageType;
            id: string;
            createdAt: Date;
            content: string | null;
            senderId: string;
            meetingId: string;
        };
    }>;
}
