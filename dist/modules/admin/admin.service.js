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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../core/prisma/prisma.service");
const client_1 = require("@prisma/client");
const library_1 = require("@prisma/client/runtime/library");
const bcrypt = require("bcrypt");
const mailer_service_1 = require("../../common/mailer/mailer.service");
let AdminService = class AdminService {
    prisma;
    mailerService;
    constructor(prisma, mailerService) {
        this.prisma = prisma;
        this.mailerService = mailerService;
    }
    async createAdmin(dto, profileImgUrl) {
        console.log(profileImgUrl, dto.profileImg);
        await this.ensureEmailUnique(dto.email);
        const hashed = await bcrypt.hash(dto.password, 10);
        return this.prisma.user.create({
            data: {
                ...dto,
                password: hashed,
                profileImg: profileImgUrl ?? null,
                role: client_1.UserRole.ADMIN,
                wallet: { create: { balance: new library_1.Decimal(2000) } },
            },
            include: { wallet: true },
        });
    }
    async createDoctor(dto, profileImgUrl) {
        await this.ensureEmailUnique(dto.email);
        const hashed = await bcrypt.hash(dto.password, 10);
        return this.prisma.user.create({
            data: {
                email: dto.email,
                password: hashed,
                firstName: dto.firstName,
                lastName: dto.lastName,
                profileImg: profileImgUrl ?? null,
                age: dto.age,
                role: client_1.UserRole.DOCTOR,
                doctorProfile: {
                    create: {
                        categoryId: dto.categoryId,
                        bio: dto.bio,
                        images: dto.images ? JSON.stringify(dto.images) : "[]",
                        videos: dto.videos ? JSON.stringify(dto.videos) : "[]",
                        salary: {
                            create: {
                                daily: new library_1.Decimal(dto.dailySalary),
                                weekly: new library_1.Decimal(Number(dto.dailySalary) * 7),
                                monthly: new library_1.Decimal(Number(dto.dailySalary) * 30),
                                yearly: new library_1.Decimal(Number(dto.dailySalary) * 365),
                            },
                        },
                    },
                },
                wallet: { create: { balance: new library_1.Decimal(2000) } },
            },
            include: {
                doctorProfile: { include: { salary: true, category: true } },
                wallet: true,
            },
        });
    }
    async createPatient(dto, profileImgUrl) {
        await this.ensureEmailUnique(dto.email);
        const hashed = await bcrypt.hash(dto.password, 10);
        return this.prisma.user.create({
            data: {
                ...dto,
                password: hashed,
                profileImg: profileImgUrl ?? null,
                role: client_1.UserRole.BEMOR,
                wallet: { create: { balance: new library_1.Decimal(2000) } },
            },
            include: { wallet: true },
        });
    }
    async searchUsers(dto, role) {
        const { firstName, lastName, email, ageFrom, ageTo, categoryId, page, limit } = dto;
        const skip = (page - 1) * limit;
        const where = { role };
        if (email)
            where.email = { contains: email, mode: "insensitive" };
        if (firstName)
            where.firstName = { contains: firstName, mode: "insensitive" };
        if (lastName)
            where.lastName = { contains: lastName, mode: "insensitive" };
        if (ageFrom || ageTo) {
            where.age = {};
            if (ageFrom)
                where.age.gte = ageFrom;
            if (ageTo)
                where.age.lte = ageTo;
        }
        if (role === client_1.UserRole.DOCTOR && categoryId) {
            where.doctorProfile = { categoryId };
        }
        const [data, total] = await Promise.all([
            this.prisma.user.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: "desc" },
                include: { blockedUser: true, devices: true, doctorProfile: { include: { category: true } }, wallet: true, },
            }),
            this.prisma.user.count({ where }),
        ]);
        return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
    }
    async findAllAdmins(dto) {
        return this.searchUsers(dto, client_1.UserRole.ADMIN);
    }
    async findAllDoctors(dto) {
        return this.searchUsers(dto, client_1.UserRole.DOCTOR);
    }
    async findAllPatients(dto) {
        return this.searchUsers(dto, client_1.UserRole.BEMOR);
    }
    async updateUser(id, dto, profileImgUrl) {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user)
            throw new common_1.NotFoundException("User topilmadi");
        return this.prisma.user.update({
            where: { id },
            data: {
                firstName: dto.firstName ?? user.firstName,
                lastName: dto.lastName ?? user.lastName,
                age: dto.age ?? user.age,
                email: dto.email ?? user.email,
                day: dto.day ?? user.day,
                month: dto.month ?? user.month,
                phoneNumber: dto.phoneNumber ?? user.phoneNumber,
                profileImg: profileImgUrl ?? user.profileImg
            },
        });
    }
    async deleteUser(dto) {
        const user = await this.prisma.user.findUnique({
            where: { id: dto.userId },
            include: { doctorProfile: true },
        });
        if (!user)
            throw new common_1.NotFoundException("User topilmadi");
        if (user.role === client_1.UserRole.DOCTOR && user.doctorProfile) {
            await this.prisma.doctorProfile.delete({ where: { doctorId: user.id } });
        }
        return this.prisma.user.delete({ where: { id: dto.userId } });
    }
    async addFunds(dto) {
        return this.updateWallet(dto.userId, dto.amount, client_1.TransactionType.CREDIT);
    }
    async deductFunds(dto) {
        return this.updateWallet(dto.userId, -dto.amount, client_1.TransactionType.DEBIT);
    }
    async massPayment(dto) {
        const users = await this.prisma.user.findMany({ where: { role: dto.role } });
        await Promise.all(users.map((u) => this.updateWallet(u.id, dto.amount, client_1.TransactionType.CREDIT)));
        return { success: true, count: users.length };
    }
    async massDeduction(dto) {
        const users = await this.prisma.user.findMany({ where: { role: dto.role } });
        console.log(users);
        if (dto.amount > 0)
            throw new common_1.BadRequestException("Miqdor manfiy bo'lishi kerak");
        await Promise.all(users.map(u => {
            if (u.email) {
                return this.updateWallet(u.id, dto.amount, client_1.TransactionType.DEBIT);
            }
            else {
                console.warn(`User ${u.id} uchun email yo'q, pul hisoblandi, lekin email yuborilmadi.`);
                return this.updateWallet(u.id, dto.amount, client_1.TransactionType.DEBIT);
            }
        }));
        return { success: true, count: users.length };
    }
    async notificationAll(dto) {
        const users = await this.prisma.user.findMany({ where: { role: dto.role } });
        console.log(users);
        await Promise.all(users.map(u => {
            if (u.email) {
                return this.notificationOne(u.id, dto.message, dto.title);
            }
            else {
                console.warn(`User ${u.id} uchun email yo'q, pul hisoblandi, lekin email yuborilmadi.`);
                return this.notificationOne(u.id, dto.message, dto.title || "F");
            }
        }));
        return { success: true, count: users.length };
    }
    async notificationOne(userId, message, title) {
        let olduser = await this.prisma.user.findFirst({
            where: {
                id: userId
            }
        });
        if (!olduser)
            throw new common_1.NotFoundException();
        let wallet = await this.prisma.wallet.findUnique({ where: { userId } });
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        console.log("user", user);
        if (user && user.email) {
            await this.mailerService.sendNotificationEmail(user.email, title, message);
            return { message: "succase" };
        }
        return { userId, };
    }
    async updateWallet(userId, amount, type) {
        let olduser = await this.prisma.user.findFirst({
            where: {
                id: userId
            }
        });
        if (!olduser)
            throw new common_1.NotFoundException();
        let wallet = await this.prisma.wallet.findUnique({ where: { userId } });
        if (!wallet) {
            wallet = await this.prisma.wallet.create({ data: { userId, balance: new library_1.Decimal(0) } });
        }
        const newBalance = new library_1.Decimal(wallet.balance).plus(amount);
        await this.prisma.wallet.update({ where: { id: wallet.id }, data: { balance: newBalance } });
        await this.prisma.walletTransaction.create({
            data: {
                walletId: wallet.id,
                type,
                amount: new library_1.Decimal(Math.abs(amount)),
                source: client_1.PaymentType.COMPANY,
            },
        });
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        console.log("user", user);
        if (user && user.email) {
            const subject = type === client_1.TransactionType.CREDIT ? "Hisobingiz to‘ldirildi" : "Hisobingizdan mablag‘ yechildi";
            const message = type === client_1.TransactionType.CREDIT
                ? `Hisobingizga ${amount} so‘m tushdi. Yangi balans: ${newBalance.toNumber()} so‘m.`
                : `Hisobingizdan ${Math.abs(amount)} so‘m ayrildi. Yangi balans: ${newBalance.toNumber()} so‘m.`;
            await this.mailerService.sendNotificationEmail(user.email, subject, message);
            return { message: "succase" };
        }
        return { userId, balance: newBalance.toNumber() };
    }
    async sendNotification(dto) {
        const user = await this.prisma.user.findUnique({ where: { id: dto.userId } });
        if (!user)
            throw new common_1.NotFoundException("User topilmadi");
        return this.prisma.userNotification.create({
            data: { userId: dto.userId, message: dto.message },
        });
    }
    async broadcastNotification(dto) {
        const users = await this.prisma.user.findMany();
        if (!users.length)
            throw new common_1.NotFoundException("Hech qanday user topilmadi");
        await this.prisma.userNotification.createMany({
            data: users.map((u) => ({ userId: u.id, message: dto.message })),
        });
        return { success: true, count: users.length };
    }
    async blockUser(userId, reason) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new common_1.NotFoundException("User topilmadi");
        let oldblock = await this.prisma.blockedUsers.findFirst({
            where: {
                userId
            }
        });
        if (oldblock) {
            return { message: "Bu user bloklangan oldin." };
        }
        await this.prisma.blockedUsers.create({
            data: { userId, reason },
        });
        await this.prisma.user.update({ where: { id: userId }, data: { isActive: false } });
        await this.sendNotificationEmail(user.email, "Profilingiz bloklandi", reason ?? "Sizning profilingiz bloklandi.");
        return { success: true };
    }
    async unblockUser(userId) {
        const blocked = await this.prisma.blockedUsers.findUnique({ where: { userId } });
        if (!blocked)
            throw new common_1.NotFoundException("User bloklanmagan");
        await this.prisma.blockedUsers.delete({ where: { userId } });
        await this.prisma.user.update({ where: { id: userId }, data: { isActive: true } });
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (user) {
            await this.sendNotificationEmail(user.email, "Profilingiz faollashtirildi", "Profilingiz blokdan chiqarildi.");
        }
        return { success: true };
    }
    async blockDevice(deviceId, reason) {
        const device = await this.prisma.device.findUnique({ where: { deviceId } });
        if (!device)
            throw new common_1.NotFoundException("Device topilmadi");
        await this.prisma.blockedUsers.create({
            data: { deviceId, reason, userId: device.userId },
        });
        const user = await this.prisma.user.findUnique({ where: { id: device.userId } });
        if (user) {
            await this.sendNotificationEmail(user.email, "Qurilmangiz bloklandi", reason ?? "Sizning qurilmangiz bloklandi.");
        }
        return { success: true };
    }
    async unblockDevice(deviceId) {
        const blocked = await this.prisma.blockedUsers.findFirst({ where: { deviceId } });
        if (!blocked)
            throw new common_1.NotFoundException("Device bloklanmagan");
        await this.prisma.blockedUsers.delete({ where: { id: blocked.id } });
        const device = await this.prisma.device.findUnique({ where: { deviceId } });
        if (device) {
            const user = await this.prisma.user.findUnique({ where: { id: device.userId } });
            if (user) {
                await this.sendNotificationEmail(user.email, "Qurilmangiz blokdan chiqarildi", "Qurilmangiz endi faol.");
            }
        }
        return { success: true };
    }
    async toggleDoctorPublish(doctorId, published) {
        const doctor = await this.prisma.doctorProfile.findUnique({ where: { doctorId } });
        if (!doctor)
            throw new common_1.NotFoundException("Doktor topilmadi");
        return this.prisma.doctorProfile.update({ where: { doctorId }, data: { published } });
    }
    async ensureEmailUnique(email) {
        const exists = await this.prisma.user.findUnique({ where: { email } });
        if (exists)
            throw new common_1.BadRequestException("Bunday email mavjud");
        return true;
    }
    async sendNotificationEmail(to, subject, message, date = new Date()) {
        await this.mailerService.sendNotificationEmail(to, subject, message, date);
        return;
    }
    async BlokdeviceAll() {
        let data = await this.prisma.blockedUsers.findMany({ include: { user: true, device: true } });
        return {
            status: true,
            message: "Barcha bloklangan qurilmalar",
            data
        };
    }
    async BlokuserAll() {
        let data = await this.prisma.device.findMany({ include: { user: true, blockedUsers: true } });
        return {
            status: true,
            message: "Barcha devicelar",
            data
        };
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        mailer_service_1.AppMailerService])
], AdminService);
//# sourceMappingURL=admin.service.js.map