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
exports.MeetingService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../core/prisma/prisma.service");
const crypto = require("crypto");
let MeetingService = class MeetingService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto, currentUserId) {
        const meeting = await this.prisma.meeting.create({
            data: {
                userId: currentUserId,
                doctorId: dto.targetId,
                scheduledAt: dto.scheduledAt,
                duration: dto.duration,
                meetingLink: `http://localhost:3000/meet/${crypto.randomUUID()}`,
            },
            include: { user: true, doctor: true },
        });
        return {
            success: true,
            message: 'Uchrashuv muvaffaqiyatli yaratildi',
            data: meeting,
        };
    }
    async findAllForUser(userId) {
        const meetings = await this.prisma.meeting.findMany({
            where: { userId },
            include: {
                user: true,
                doctor: true,
                messages: {
                    include: { sender: { select: { id: true, firstName: true, lastName: true } } },
                },
            },
        });
        return {
            success: true,
            message: 'Foydalanuvchining uchrashuvlari',
            data: meetings,
        };
    }
    async findAllForAdmin() {
        const meetings = await this.prisma.meeting.findMany({
            include: {
                user: true,
                doctor: true,
                messages: {
                    include: { sender: { select: { id: true, firstName: true, lastName: true } } },
                },
            },
        });
        return {
            success: true,
            message: 'Barcha uchrashuvlar ro‘yxati',
            data: meetings,
        };
    }
    async findOne(id, currentUserId, isSuperAdmin = false) {
        const meeting = await this.prisma.meeting.findUnique({
            where: { id },
            include: { user: true, doctor: true, messages: { include: { sender: true } } },
        });
        if (!meeting) {
            throw new common_1.NotFoundException({
                success: false,
                message: 'Uchrashuv topilmadi',
            });
        }
        if (!isSuperAdmin && meeting.userId !== currentUserId) {
            throw new common_1.ForbiddenException({
                success: false,
                message: 'Bu uchrashuvga ruxsatingiz yo‘q',
            });
        }
        return {
            success: true,
            message: 'Uchrashuv topildi',
            data: meeting,
        };
    }
    async update(id, dto, currentUserId, isSuperAdmin = false) {
        const meeting = await this.prisma.meeting.findUnique({ where: { id } });
        if (!meeting) {
            throw new common_1.NotFoundException({
                success: false,
                message: 'Yangilash uchun uchrashuv topilmadi',
            });
        }
        if (!isSuperAdmin && meeting.userId !== currentUserId) {
            throw new common_1.ForbiddenException({
                success: false,
                message: 'Bu uchrashuvni yangilashga ruxsatingiz yo‘q',
            });
        }
        const updated = await this.prisma.meeting.update({
            where: { id },
            data: { ...dto },
            include: { user: true, doctor: true },
        });
        return {
            success: true,
            message: 'Uchrashuv muvaffaqiyatli yangilandi',
            data: updated,
        };
    }
    async remove(id, currentUserId, isSuperAdmin = false) {
        const meeting = await this.prisma.meeting.findUnique({ where: { id } });
        if (!meeting) {
            throw new common_1.NotFoundException({
                success: false,
                message: 'O‘chirish uchun uchrashuv topilmadi',
            });
        }
        if (!isSuperAdmin && meeting.userId !== currentUserId) {
            throw new common_1.ForbiddenException({
                success: false,
                message: 'Bu uchrashuvni o‘chirishga ruxsatingiz yo‘q',
            });
        }
        await this.prisma.meeting.delete({ where: { id } });
        return {
            success: true,
            message: 'Uchrashuv muvaffaqiyatli o‘chirildi',
        };
    }
    async sendMessage(dto, currentUserId) {
        const meeting = await this.prisma.meeting.findUnique({ where: { id: dto.meetingId } });
        if (!meeting) {
            throw new common_1.NotFoundException({
                success: false,
                message: 'Xabar yuborish uchun uchrashuv topilmadi',
            });
        }
        const message = await this.prisma.meetingMessage.create({
            data: {
                meetingId: dto.meetingId,
                senderId: currentUserId,
                content: dto.content,
                type: dto.type,
            },
            include: { sender: true },
        });
        return {
            success: true,
            message: 'Xabar muvaffaqiyatli yuborildi',
            data: message,
        };
    }
};
exports.MeetingService = MeetingService;
exports.MeetingService = MeetingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MeetingService);
//# sourceMappingURL=meeting.service.js.map