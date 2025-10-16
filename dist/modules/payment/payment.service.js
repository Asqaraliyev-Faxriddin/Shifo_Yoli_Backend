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
exports.PaymentService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../core/prisma/prisma.service");
let PaymentService = class PaymentService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async searchPayments(dto) {
        const { firstName, email, limit, offset, startDate, endDate } = dto;
        const where = {};
        if (firstName || email) {
            where.wallet = {
                user: {
                    ...(firstName && { firstName: { contains: firstName, mode: 'insensitive' } }),
                    ...(email && { email: { contains: email, mode: 'insensitive' } }),
                },
            };
        }
        if (startDate && endDate) {
            where.createdAt = {
                gte: new Date(startDate),
                lte: new Date(new Date(endDate).setHours(23, 59, 59, 999)),
            };
        }
        else if (startDate) {
            where.createdAt = { gte: new Date(startDate) };
        }
        else if (endDate) {
            where.createdAt = {
                lte: new Date(new Date(endDate).setHours(23, 59, 59, 999)),
            };
        }
        const [data, total] = await Promise.all([
            this.prisma.walletTransaction.findMany({
                where,
                include: {
                    wallet: {
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    firstName: true,
                                    lastName: true,
                                    email: true,
                                    role: true,
                                    wallet: true,
                                    phoneNumber: true,
                                    createdAt: true,
                                    updatedAt: true,
                                },
                            },
                        },
                    },
                },
                skip: offset,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.walletTransaction.count({ where }),
        ]);
        return {
            total,
            count: data.length,
            data,
        };
    }
    async oldPayment(dto, userId) {
        const { startDate, endDate, limit, offset } = dto;
        const wallet = await this.prisma.wallet.findFirst({
            where: { userId },
        });
        if (!wallet) {
            throw new common_1.BadRequestException("Foydalanuvchi topilmadi");
        }
        const where = { walletId: wallet.id };
        if (startDate && endDate) {
            where.createdAt = {
                gte: new Date(startDate),
                lte: new Date(new Date(endDate).setHours(23, 59, 59, 999)),
            };
        }
        else if (startDate) {
            where.createdAt = { gte: new Date(startDate) };
        }
        else if (endDate) {
            where.createdAt = {
                lte: new Date(new Date(endDate).setHours(23, 59, 59, 999)),
            };
        }
        const [transactions, total] = await Promise.all([
            this.prisma.walletTransaction.findMany({
                where,
                skip: offset,
                take: limit,
                orderBy: { createdAt: "desc" },
                include: {
                    wallet: {
                        include: {
                            user: true,
                        },
                    },
                },
            }),
            this.prisma.walletTransaction.count({ where }),
        ]);
        if (!transactions || transactions.length === 0) {
            throw new common_1.BadRequestException("Bu foydalanuvchida transaction topilmadi");
        }
        return {
            success: true,
            message: "Oldin to‘lov qilgan",
            total,
            count: transactions.length,
            data: transactions,
        };
    }
    async PaymentDocktor(userId, payload) {
        let wallet = await this.prisma.wallet.findFirst({
            where: {
                userId
            }
        });
        if (!wallet) {
            wallet = await this.prisma.wallet.create({
                data: {
                    userId,
                    balance: 0
                }
            });
        }
        let oldDocktor = await this.prisma.doctorProfile.findFirst({
            where: {
                doctorId: payload.doctorId
            },
        });
        if (!oldDocktor) {
            throw new common_1.BadRequestException("Bunday doktor mavjud emas");
        }
        let oldSalary = await this.prisma.doctorSalary.findFirst({
            where: {
                doctorId: oldDocktor.doctorId
            }
        });
        if (!oldSalary) {
            throw new common_1.BadRequestException("Doktor maoshini aniqlab bo'lmadi");
        }
        let amount;
        if (oldSalary.daily !== null) {
            amount = oldSalary.daily.toNumber() * payload.countday;
        }
        else {
            amount = 0;
        }
        if (wallet.balance.toNumber() < amount) {
            throw new common_1.BadRequestException(`Sizning hisobingizda ${payload.countday}-kun uchun pul yetarli emas`);
        }
        let tolov = await this.prisma.dailyDoctorAccess.create({
            data: {
                patientId: String(userId),
                doctorId: oldDocktor.doctorId,
                date: new Date(),
                price: amount,
                dayCountPay: payload.countday
            }
        });
        return {
            message: "Muvaffaqiyatli to'lov qilindi",
        };
    }
    async ChangeDocktorPay(userId, payload) {
        let oldDocktor = await this.prisma.doctorProfile.findFirst({
            where: {
                doctorId: payload.doctorId
            },
        });
        if (!oldDocktor) {
            throw new common_1.BadRequestException("Bunday doktor mavjud emas");
        }
        let daily = await this.prisma.dailyDoctorAccess.findFirst({
            where: {
                patientId: userId,
                doctorId: oldDocktor.doctorId
            }
        });
        if (!daily) {
            throw new common_1.BadRequestException("Siz bu doktor bilan suhbatlashish uchun to'lov qiling");
        }
        return {
            message: "Siz to'lov qilgansiz",
        };
    }
};
exports.PaymentService = PaymentService;
exports.PaymentService = PaymentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PaymentService);
//# sourceMappingURL=payment.service.js.map