import { Request } from 'express';
import { PrismaService } from 'src/core/prisma/prisma.service';
export declare class DeviceService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(userId: string): Promise<({
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
        _count: {
            user: number;
            blockedUsers: number;
        };
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
    })[]>;
    private BlockDevice;
    remove(deviceId: string, userId: string, req: Request): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
        deviceId: string | null;
        reason: string | null;
    } | "Bu qurilma topilmadi">;
    unblock(deviceId: string, userId: string, req: Request): Promise<"Bu qurilma topilmadi" | "Bu qurilma bloklanmagan" | {
        status: boolean;
        message: string;
    }>;
}
