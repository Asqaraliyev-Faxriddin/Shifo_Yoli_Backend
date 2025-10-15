import { PrismaService } from 'src/core/prisma/prisma.service';
import { PhoneUpdateDto, UpdatePasswordDto, UpdateProfileDto } from './dto/profile.dto';
import { VerificationService } from '../verification/verification.service';
export declare class ProfileService {
    private prisma;
    private verificationService;
    constructor(prisma: PrismaService, verificationService: VerificationService);
    myProfile(id: string): Promise<{
        success: boolean;
        message: string;
        data: {
            notifications: {
                isFalseRead: number;
                isTrueRead: number;
            };
            wallet: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                balance: import("@prisma/client/runtime/library").Decimal;
                userId: string;
            } | null;
            email: string;
            lastName: string;
            firstName: string;
            age: number;
            id: string;
            role: import(".prisma/client").$Enums.UserRole;
            profileImg: string | null;
            createdAt: Date;
            updatedAt: Date;
            devices: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string | null;
                deviceType: import(".prisma/client").$Enums.DeviceType;
                deviceId: string;
                address: string | null;
            }[];
            meetingsAsDoctor: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                doctorId: string;
                scheduledAt: Date | null;
                duration: number | null;
                meetingLink: string | null;
                status: import(".prisma/client").$Enums.MeetingStatus;
            }[];
            _count: {
                doctorProfile: number;
                devices: number;
                wallet: number;
                ChatParticipant: number;
                Message: number;
                UserNotification: number;
                meetingsAsUser: number;
                meetingsAsDoctor: number;
                reviewsGiven: number;
                reviewsReceived: number;
                blockedUser: number;
                meetingsMessages: number;
                dailyAccess: number;
                doctorAccess: number;
            };
        };
    }>;
    deleteProfile(id: string): Promise<{
        succase: boolean;
        message: string;
        data: {
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
    }>;
    updateProfile(userId: string, dto: UpdateProfileDto, fileName?: string): Promise<{
        profileImg: string | null;
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
        isActive: boolean;
        isOnline: boolean;
        lastSeen: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updatePhone(userId: string, payload: PhoneUpdateDto): Promise<{
        status: boolean;
        message: string;
        data: {
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
    }>;
    updatePassword(userId: string, payload: UpdatePasswordDto): Promise<{
        message: string;
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
    }>;
}
