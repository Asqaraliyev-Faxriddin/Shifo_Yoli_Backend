import { NotificationService } from './notification.service';
import { FindAllNotificationDto } from './dto/create-notification.dto';
import { NameDto } from './dto/update-notification.dto';
export declare class NotificationController {
    private readonly notificationService;
    constructor(notificationService: NotificationService);
    findAll(req: any, query: FindAllNotificationDto): Promise<{
        data: ({
            user: {
                email: string;
                lastName: string;
                firstName: string;
                id: string;
                profileImg: string | null;
            };
        } & {
            message: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            isRead: boolean;
            readAt: Date | null;
        })[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    markAsRead(id: string): Promise<{
        success: boolean;
        message: string;
        data: {
            message: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            isRead: boolean;
            readAt: Date | null;
        };
    }>;
    markAllAsRead(req: any): Promise<{
        success: boolean;
        message: string;
        updatedCount: number;
    }>;
    salom(body: NameDto): Promise<{
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
}
