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
const client_1 = require("@prisma/client");
const date_fns_1 = require("date-fns");
const axios_1 = require("axios");
let PaymentService = class PaymentService {
    prisma;
    logger = new common_1.Logger("PaymentService");
    TELEGRAM_TOKEN = '7603237952:AAFwBv61YCKO1egUh-vAaFzxwJYVotV91GI';
    CHAT_ID = '7516576408';
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
        const oldUser = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!oldUser) {
            throw new common_1.BadRequestException("Bunday foydalanuvchi mavjud emas");
        }
        let wallet = await this.prisma.wallet.findUnique({
            where: { userId },
        });
        if (!wallet) {
            wallet = await this.prisma.wallet.create({
                data: {
                    userId,
                    balance: new client_1.Prisma.Decimal(0),
                },
            });
        }
        const doctorProfile = await this.prisma.doctorProfile.findUnique({
            where: { doctorId: payload.doctorId },
            include: {
                doctor: true,
                salary: true,
            },
        });
        if (!doctorProfile) {
            throw new common_1.BadRequestException("Bunday doktor mavjud emas");
        }
        const oldSalary = doctorProfile.salary[0];
        if (!oldSalary || oldSalary.daily === null) {
            throw new common_1.BadRequestException("Doktor maoshini aniqlab bo‘lmadi");
        }
        const amount = oldSalary.daily.toNumber() * payload.countday;
        if (oldUser.role !== "SUPERADMIN" && wallet.balance.toNumber() < amount) {
            throw new common_1.BadRequestException(`Sizning hisobingizda ${payload.countday} kun uchun mablag‘ yetarli emas`);
        }
        if (oldUser.role !== "SUPERADMIN") {
            await this.prisma.wallet.update({
                where: { id: wallet.id },
                data: {
                    balance: wallet.balance.minus(amount),
                    transactions: {
                        create: {
                            type: "DEBIT",
                            amount: amount,
                            source: "USER_PAYMENT",
                            meta: { doctorId: payload.doctorId, days: payload.countday },
                        },
                    },
                },
            });
        }
        await this.prisma.dailyDoctorAccess.create({
            data: {
                patientId: userId,
                doctorId: payload.doctorId,
                date: new Date(),
                price: amount,
                dayCountPay: payload.countday,
            },
        });
        const doctorWallet = await this.prisma.wallet.findUnique({
            where: { userId: payload.doctorId },
        });
        await this.prisma.walletTransaction.create({
            data: {
                walletId: wallet.id,
                type: "DEBIT",
                amount: amount,
                source: "USER_PAYMENT",
                meta: { doctorId: payload.doctorId, days: payload.countday },
            },
        });
        if (doctorWallet) {
            await this.prisma.wallet.update({
                where: { id: doctorWallet.id },
                data: {
                    balance: doctorWallet.balance.plus(amount),
                    transactions: {
                        create: {
                            type: "CREDIT",
                            amount: amount,
                            source: "USER_PAYMENT",
                            meta: { fromUserId: userId },
                        },
                    },
                },
            });
        }
        return {
            message: "Muvaffaqiyatli to‘lov amalga oshirildi",
            amount,
        };
    }
    async ChangeDocktorPay(userId, payload) {
        let olduser = await this.prisma.user.findFirst({
            where: {
                id: userId
            }
        });
        if (!olduser) {
            throw new common_1.BadRequestException("Bunday foydalanuvchi mavjud emas");
        }
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
        if (!daily && olduser.role === "BEMOR") {
            throw new common_1.BadRequestException("Siz bu doktor bilan suhbatlashish uchun to'lov qiling");
        }
        return {
            message: "Siz to'lov qilgansiz",
        };
    }
    async cleanExpiredAccesses() {
        const now = new Date();
        const accesses = await this.prisma.dailyDoctorAccess.findMany({
            include: {
                patient: true,
                doctor: true,
            },
        });
        const expired = [];
        for (const access of accesses) {
            const daysPassed = (0, date_fns_1.differenceInDays)(now, new Date(access.createdAt));
            if (daysPassed >= access.dayCountPay) {
                expired.push(`🧾 ${access.patient.firstName} ${access.patient.lastName} → ${access.doctor.firstName} ${access.doctor.lastName} (Tugadi: ${daysPassed} kun)`);
                await this.prisma.dailyDoctorAccess.delete({
                    where: { id: access.id },
                });
            }
        }
        if (expired.length > 0) {
            const message = `🕒 Tugagan kirishlar:\n\n${expired.join('\n')}`;
            await this.sendTelegramMessage(message);
        }
        this.logger.log(`✅ ${expired.length} ta kirish o‘chirildi`);
    }
    async sinovTekshiruv() {
        await this.sendTelegramMessage("Tekshiruv muffaqiyatli ishlamoqda...");
    }
    async sendTelegramMessage(text) {
        try {
            const url = `https://api.telegram.org/bot${this.TELEGRAM_TOKEN}/sendMessage`;
            await axios_1.default.post(url, {
                chat_id: this.CHAT_ID,
                text,
                parse_mode: 'HTML',
            });
        }
        catch (error) {
            this.logger.error('Telegramga yuborishda xatolik', error.message);
        }
    }
};
exports.PaymentService = PaymentService;
exports.PaymentService = PaymentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PaymentService);
//# sourceMappingURL=payment.service.js.map