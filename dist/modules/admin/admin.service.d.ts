import { PrismaService } from "src/core/prisma/prisma.service";
import { CreateAdminDto, CreateDoctorDto, CreatePatientDto, UpdateUserDto, DeleteUserDto, SearchUserDto, SendNotificationDto, BroadcastNotificationDto, UserPaymentDto, MassPaymentDto, NotificationAll } from "./dto/create-admin.dto";
import { Decimal } from "@prisma/client/runtime/library";
import { AppMailerService } from "src/common/mailer/mailer.service";
export declare class AdminService {
    private readonly prisma;
    private readonly mailerService;
    constructor(prisma: PrismaService, mailerService: AppMailerService);
    createAdmin(dto: CreateAdminDto, profileImgUrl?: string): Promise<{
        wallet: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            balance: Decimal;
            userId: string;
        } | null;
    } & {
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
    createDoctor(dto: CreateDoctorDto, profileImgUrl?: string): Promise<{
        doctorProfile: ({
            category: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                img: string | null;
            };
            salary: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                doctorId: string;
                free: boolean;
                daily: Decimal | null;
                weekly: Decimal | null;
                monthly: Decimal | null;
                yearly: Decimal | null;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            doctorId: string;
            categoryId: string;
            bio: string;
            images: import("@prisma/client/runtime/library").JsonValue | null;
            videos: import("@prisma/client/runtime/library").JsonValue | null;
            published: boolean;
            files: import("@prisma/client/runtime/library").JsonValue | null;
            futures: import("@prisma/client/runtime/library").JsonValue | null;
        }) | null;
        wallet: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            balance: Decimal;
            userId: string;
        } | null;
    } & {
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
    createPatient(dto: CreatePatientDto, profileImgUrl?: string): Promise<{
        wallet: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            balance: Decimal;
            userId: string;
        } | null;
    } & {
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
    private searchUsers;
    findAllAdmins(dto: SearchUserDto): Promise<{
        data: ({
            doctorProfile: ({
                category: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    name: string;
                    img: string | null;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                doctorId: string;
                categoryId: string;
                bio: string;
                images: import("@prisma/client/runtime/library").JsonValue | null;
                videos: import("@prisma/client/runtime/library").JsonValue | null;
                published: boolean;
                files: import("@prisma/client/runtime/library").JsonValue | null;
                futures: import("@prisma/client/runtime/library").JsonValue | null;
            }) | null;
            wallet: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                balance: Decimal;
                userId: string;
            } | null;
            devices: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string | null;
                userId: string;
                deviceType: import(".prisma/client").$Enums.DeviceType;
                deviceId: string;
                platform: string | null;
                address: string | null;
            }[];
            blockedUser: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                userId: string | null;
                deviceId: string | null;
                reason: string | null;
            } | null;
        } & {
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
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findAllDoctors(dto: SearchUserDto): Promise<{
        data: ({
            doctorProfile: ({
                category: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    name: string;
                    img: string | null;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                doctorId: string;
                categoryId: string;
                bio: string;
                images: import("@prisma/client/runtime/library").JsonValue | null;
                videos: import("@prisma/client/runtime/library").JsonValue | null;
                published: boolean;
                files: import("@prisma/client/runtime/library").JsonValue | null;
                futures: import("@prisma/client/runtime/library").JsonValue | null;
            }) | null;
            wallet: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                balance: Decimal;
                userId: string;
            } | null;
            devices: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string | null;
                userId: string;
                deviceType: import(".prisma/client").$Enums.DeviceType;
                deviceId: string;
                platform: string | null;
                address: string | null;
            }[];
            blockedUser: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                userId: string | null;
                deviceId: string | null;
                reason: string | null;
            } | null;
        } & {
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
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findAllPatients(dto: SearchUserDto): Promise<{
        data: ({
            doctorProfile: ({
                category: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    name: string;
                    img: string | null;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                doctorId: string;
                categoryId: string;
                bio: string;
                images: import("@prisma/client/runtime/library").JsonValue | null;
                videos: import("@prisma/client/runtime/library").JsonValue | null;
                published: boolean;
                files: import("@prisma/client/runtime/library").JsonValue | null;
                futures: import("@prisma/client/runtime/library").JsonValue | null;
            }) | null;
            wallet: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                balance: Decimal;
                userId: string;
            } | null;
            devices: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string | null;
                userId: string;
                deviceType: import(".prisma/client").$Enums.DeviceType;
                deviceId: string;
                platform: string | null;
                address: string | null;
            }[];
            blockedUser: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                userId: string | null;
                deviceId: string | null;
                reason: string | null;
            } | null;
        } & {
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
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    updateUser(id: string, dto: UpdateUserDto, profileImgUrl?: string): Promise<{
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
    deleteUser(dto: DeleteUserDto): Promise<{
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
    addFunds(dto: UserPaymentDto): Promise<{
        message: string;
        userId?: undefined;
        balance?: undefined;
    } | {
        userId: string;
        balance: number;
        message?: undefined;
    }>;
    deductFunds(dto: UserPaymentDto): Promise<{
        message: string;
        userId?: undefined;
        balance?: undefined;
    } | {
        userId: string;
        balance: number;
        message?: undefined;
    }>;
    massPayment(dto: MassPaymentDto): Promise<{
        success: boolean;
        count: number;
    }>;
    massDeduction(dto: MassPaymentDto): Promise<{
        success: boolean;
        count: number;
    }>;
    notificationAll(dto: NotificationAll): Promise<{
        success: boolean;
        count: number;
    }>;
    private notificationOne;
    private updateWallet;
    sendNotification(dto: SendNotificationDto): Promise<{
        message: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        isRead: boolean;
        readAt: Date | null;
    }>;
    broadcastNotification(dto: BroadcastNotificationDto): Promise<{
        success: boolean;
        count: number;
    }>;
    blockUser(userId: string, reason?: string): Promise<{
        message: string;
        success?: undefined;
    } | {
        success: boolean;
        message?: undefined;
    }>;
    unblockUser(userId: string): Promise<{
        success: boolean;
    }>;
    blockDevice(deviceId: string, reason?: string): Promise<{
        success: boolean;
    }>;
    unblockDevice(deviceId: string): Promise<{
        success: boolean;
    }>;
    toggleDoctorPublish(doctorId: string, published: boolean): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        doctorId: string;
        categoryId: string;
        bio: string;
        images: import("@prisma/client/runtime/library").JsonValue | null;
        videos: import("@prisma/client/runtime/library").JsonValue | null;
        published: boolean;
        files: import("@prisma/client/runtime/library").JsonValue | null;
        futures: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    private ensureEmailUnique;
    private sendNotificationEmail;
    BlokdeviceAll(): Promise<{
        status: boolean;
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
            } | null;
            device: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string | null;
                userId: string;
                deviceType: import(".prisma/client").$Enums.DeviceType;
                deviceId: string;
                platform: string | null;
                address: string | null;
            } | null;
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string | null;
            deviceId: string | null;
            reason: string | null;
        })[];
    }>;
    BlokuserAll(): Promise<{
        status: boolean;
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
            blockedUsers: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                userId: string | null;
                deviceId: string | null;
                reason: string | null;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string | null;
            userId: string;
            deviceType: import(".prisma/client").$Enums.DeviceType;
            deviceId: string;
            platform: string | null;
            address: string | null;
        })[];
    }>;
}
