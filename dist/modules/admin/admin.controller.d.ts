import { AdminService } from "./admin.service";
import { CreateAdminDto, CreatePatientDto, UpdateUserDto, DeleteUserDto, BlockUserDto, UnblockUserDto, SearchUserDto, SendNotificationDto, BroadcastNotificationDto, UserPaymentDto, MassPaymentDto, NotificationAll } from "./dto/create-admin.dto";
import { UpdateProfileUserAdminDto } from "./dto/update-admin.dto";
import { PrismaService } from "src/core/prisma/prisma.service";
export declare class AdminController {
    private readonly adminService;
    private prisma;
    constructor(adminService: AdminService, prisma: PrismaService);
    private readonly imgbbApiKey;
    private readonly imgbbUploadUrl;
    private uploadImage;
    createAdmin(dto: CreateAdminDto, file?: Express.Multer.File): Promise<{
        wallet: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            balance: import("@prisma/client/runtime/library").Decimal;
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
    createDoctor(files: {
        profileImg?: Express.Multer.File[];
        images?: Express.Multer.File[];
        videos?: Express.Multer.File[];
    }, body: any): Promise<{
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
                daily: import("@prisma/client/runtime/library").Decimal | null;
                weekly: import("@prisma/client/runtime/library").Decimal | null;
                monthly: import("@prisma/client/runtime/library").Decimal | null;
                yearly: import("@prisma/client/runtime/library").Decimal | null;
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
            balance: import("@prisma/client/runtime/library").Decimal;
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
    createPatient(dto: CreatePatientDto, req: any, file?: Express.Multer.File): Promise<any>;
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
                balance: import("@prisma/client/runtime/library").Decimal;
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
                balance: import("@prisma/client/runtime/library").Decimal;
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
                balance: import("@prisma/client/runtime/library").Decimal;
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
    updateUser(id: string, dto: UpdateUserDto, file?: Express.Multer.File): Promise<{
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
    NotificationAll(dto: NotificationAll): Promise<{
        success: boolean;
        count: number;
    }>;
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
    blockUser(dto: BlockUserDto): Promise<{
        message: string;
        success?: undefined;
    } | {
        success: boolean;
        message?: undefined;
    }>;
    unblockUser(dto: UnblockUserDto): Promise<{
        success: boolean;
    }>;
    blockDevice(deviceId: string, reason?: string): Promise<{
        success: boolean;
    }>;
    unblockDevice(deviceId: string): Promise<{
        success: boolean;
    }>;
    toggleDoctorPublish(doctorId: string, status: string): Promise<{
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
    updateProfile(req: any, dto: UpdateProfileUserAdminDto, file?: Express.Multer.File): Promise<{
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
    allDevices(): Promise<{
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
    blobkusers(): Promise<{
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
}
