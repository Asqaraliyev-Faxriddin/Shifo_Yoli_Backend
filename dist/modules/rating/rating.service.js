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
exports.ReviewService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../core/prisma/prisma.service");
const client_1 = require("@prisma/client");
let ReviewService = class ReviewService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, dto) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new common_1.NotFoundException("Foydalanuvchi topilmadi");
        const doctor = await this.prisma.user.findUnique({
            where: { id: dto.doctorId },
        });
        if (!doctor || doctor.role !== client_1.UserRole.DOCTOR) {
            throw new common_1.BadRequestException("Doktor topilmadi yoki noto‘g‘ri role");
        }
        if (userId === dto.doctorId) {
            throw new common_1.ForbiddenException("O‘zingizni baholay olmaysiz");
        }
        const existing = await this.prisma.review.findFirst({
            where: { userId, doctorId: dto.doctorId },
        });
        if (existing) {
            throw new common_1.BadRequestException("Siz bu doktorga allaqachon baho qo‘yganingiz");
        }
        if (dto.rating < 1 || dto.rating > 5) {
            throw new common_1.BadRequestException("Reyting 1 dan 5 gacha bo‘lishi kerak");
        }
        return this.prisma.review.create({
            data: {
                userId,
                doctorId: dto.doctorId,
                rating: dto.rating,
                comment: dto.comment,
            },
        });
    }
    async findAllByDoctor(doctorId, offset = 0, limit = 10) {
        const [items, total] = await this.prisma.$transaction([
            this.prisma.review.findMany({
                where: { doctorId },
                skip: offset,
                take: limit,
                orderBy: { createdAt: "desc" },
                include: {
                    user: { select: { id: true, firstName: true, lastName: true } },
                },
            }),
            this.prisma.review.count({ where: { doctorId } }),
        ]);
        return {
            total,
            offset,
            limit,
            items,
        };
    }
    async getAnalytics(doctorId) {
        const reviews = await this.prisma.review.findMany({
            where: { doctorId },
            orderBy: { createdAt: "desc" },
            include: {
                user: { select: { id: true, firstName: true, lastName: true } },
            },
        });
        if (reviews.length === 0) {
            return {
                average: 0,
                total: 0,
                distribution: {},
                top10: [],
                best: null,
                worst: null,
            };
        }
        const total = reviews.length;
        const average = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
        const distribution = {};
        for (let i = 1; i <= 5; i++) {
            distribution[i] = reviews.filter((r) => r.rating === i).length;
        }
        const sortedByRating = [...reviews].sort((a, b) => b.rating - a.rating);
        const best = sortedByRating[0];
        const worst = sortedByRating[sortedByRating.length - 1];
        const top10 = sortedByRating.slice(0, 10);
        return { average, total, distribution, top10, best, worst };
    }
    async update(userId, reviewId, dto) {
        const review = await this.prisma.review.findUnique({
            where: { id: reviewId },
        });
        if (!review)
            throw new common_1.NotFoundException("Review topilmadi");
        if (review.userId !== userId) {
            throw new common_1.ForbiddenException("Siz faqat o‘zingizning review ingizni tahrirlay olasiz");
        }
        if (dto.rating && (dto.rating < 1 || dto.rating > 5)) {
            throw new common_1.BadRequestException("Reyting 1 dan 5 gacha bo‘lishi kerak");
        }
        return this.prisma.review.update({
            where: { id: reviewId },
            data: {
                rating: dto.rating ?? review.rating,
                comment: dto.comment ?? review.comment,
            },
        });
    }
    async remove(userId, reviewId) {
        const review = await this.prisma.review.findUnique({ where: { id: reviewId } });
        if (!review)
            throw new common_1.NotFoundException("Review topilmadi");
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { role: true },
        });
        if (!user)
            throw new common_1.NotFoundException("Foydalanuvchi topilmadi");
        if (review.userId !== userId && !["ADMIN", "SUPERADMIN"].includes(user.role)) {
            throw new common_1.ForbiddenException("Siz bu reviewni o‘chira olmaysiz");
        }
        return this.prisma.review.delete({ where: { id: reviewId } });
    }
};
exports.ReviewService = ReviewService;
exports.ReviewService = ReviewService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReviewService);
//# sourceMappingURL=rating.service.js.map