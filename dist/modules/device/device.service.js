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
exports.DeviceService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../core/prisma/prisma.service");
let DeviceService = class DeviceService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(userId) {
        let data = await this.prisma.device.findMany({ include: { user: true, _count: true, blockedUsers: true }, where: { userId: userId } });
        return data;
    }
    async BlockDevice(req) {
        if (!req)
            return;
        const userAgent = req.headers["user-agent"] || "unknown";
        const ip = req.ip || req.headers["x-forwarded-for"] || "unknown";
        const existingDevice = await this.prisma.device.findFirst({
            where: {
                OR: [
                    { address: ip },
                    { name: userAgent },
                ],
            },
        });
        if (existingDevice?.deviceType == "register") {
            return true;
        }
        throw new common_1.UnauthorizedException("Siz qolgan qurilmalarni bloklashingiz uchun Ro'yxatdan o'tgan qurilmangizda turib bloklashiz kerak.");
    }
    async remove(deviceId, userId, req) {
        let olddevice = await this.prisma.device.findFirst({ where: { deviceId: deviceId, } });
        if (!olddevice)
            return "Bu qurilma topilmadi";
        let oldDevice = await this.BlockDevice(req);
        if (oldDevice != true)
            throw new common_1.UnauthorizedException("Siz qolgan qurilmalarni bloklashingiz uchun Ro'yxatdan o'tgan qurilmangizda turib bloklashiz kerak.");
        if (olddevice.userId != userId)
            throw new common_1.UnauthorizedException("Bu qurilmani o'chirishga sizda ruxsat yo'q");
        let data = await this.prisma.blockedUsers.create({
            data: {
                deviceId: olddevice.deviceId
            }
        });
        return data;
    }
    async unblock(deviceId, userId, req) {
        let olddevice = await this.prisma.device.findFirst({ where: { deviceId: deviceId, } });
        if (!olddevice)
            return "Bu qurilma topilmadi";
        let oldDevice = await this.BlockDevice(req);
        if (oldDevice != true)
            throw new common_1.UnauthorizedException("Siz qolgan qurilmalarni blokdan chiqarishingiz uchun Ro'yxatdan o'tgan qurilmangizda turib bloklashiz kerak.");
        if (olddevice.userId != userId)
            throw new common_1.UnauthorizedException("Bu qurilmani blokdan chiqarish uchun sizda ruxsat yo'q");
        let olddevice2 = await this.prisma.blockedUsers.findFirst({
            where: {
                id: olddevice.id
            }
        });
        if (!olddevice2)
            return "Bu qurilma bloklanmagan";
        let data = await this.prisma.blockedUsers.delete({
            where: {
                id: olddevice.deviceId
            }
        });
        return {
            status: true,
            message: "Qurilma blokdan chiqarildi"
        };
    }
};
exports.DeviceService = DeviceService;
exports.DeviceService = DeviceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DeviceService);
//# sourceMappingURL=device.service.js.map