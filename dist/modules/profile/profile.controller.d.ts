import { PhoneUpdateDto, UpdatePasswordDto, UpdateProfileDto } from './dto/profile.dto';
import { ProfileService } from './profile.service';
import { PrismaService } from 'src/core/prisma/prisma.service';
export declare class ProfileController {
    private profileService;
    private prisma;
    constructor(profileService: ProfileService, prisma: PrismaService);
    updateProfile(req: any, dto: UpdateProfileDto, file?: Express.Multer.File): Promise<{
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
    }>;
    updatePhone(req: Request, body: PhoneUpdateDto): Promise<{
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
    updatePassword(req: Request, payload: UpdatePasswordDto): Promise<{
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
    getProfile(req: Request): Promise<{
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
            };
        };
    }>;
    deleteProfile(req: Request): Promise<{
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
}
