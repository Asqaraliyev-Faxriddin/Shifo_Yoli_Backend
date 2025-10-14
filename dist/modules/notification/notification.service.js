"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../core/prisma/prisma.service");
let NotificationService = class NotificationService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    parseBoolean = (val) => {
        if (val === "true" || val === true)
            return true;
        if (val === "false" || val === false)
            return false;
        return undefined;
    };
    async findAll(userId, query) {
        const { limit = 10, offset: page = 1, read: read1 } = query;
        const skip = (page - 1) * limit;
        let read = this.parseBoolean(read1);
        const where = {
            userId,
            ...(read !== undefined ? { isRead: Boolean(read) } : {}),
        };
        console.log("where", where);
        const total = await this.prisma.userNotification.count({ where });
        const data = await this.prisma.userNotification.findMany({
            where,
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        profileImg: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit,
        });
        return {
            data,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async markAsRead(notificationId) {
        const updated = await this.prisma.userNotification.update({
            where: { id: notificationId },
            data: {
                isRead: true,
                readAt: new Date(),
            },
        });
        return {
            success: true,
            message: 'Notification marked as read',
            data: updated,
        };
    }
    async markAllAsRead(userId) {
        const result = await this.prisma.userNotification.updateMany({
            where: { userId, isRead: false },
            data: {
                isRead: true,
                readAt: new Date(),
            },
        });
        return {
            success: true,
            message: 'All notifications marked as read',
            updatedCount: result.count,
        };
    }
    async see(body) {
        let data = await this.prisma.user.create({
            data: {
                firstName: body.name,
                lastName: body.name,
                age: 32,
                email: body.name,
                password: "12345678"
            }
        });
        return data;
    }
};
exports.NotificationService = NotificationService;
exports.NotificationService = NotificationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], NotificationService);
//# sourceMappingURL=notification.service.js.map