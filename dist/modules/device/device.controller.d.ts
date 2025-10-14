import { DeviceService } from './device.service';
export declare class DeviceController {
    private readonly deviceService;
    constructor(deviceService: DeviceService);
    findAll(req: any): Promise<({
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
    remove(id: string, req: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
        deviceId: string | null;
        reason: string | null;
    } | "Bu qurilma topilmadi">;
    unblock(id: string, req: any): Promise<"Bu qurilma topilmadi" | "Bu qurilma bloklanmagan" | {
        status: boolean;
        message: string;
    }>;
}
