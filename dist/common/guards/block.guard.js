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
exports.BlockGuard = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../../core/prisma/prisma.service");
let BlockGuard = class BlockGuard {
    jwtService;
    prisma;
    constructor(jwtService, prisma) {
        this.jwtService = jwtService;
        this.prisma = prisma;
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
        if (existingDevice) {
            return existingDevice;
        }
        return true;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        try {
            if (request.url == "/auth/login" || request.url == "/auth/register") {
                let data = await this.BlockDevice(request);
                if (data && data != true) {
                    let olduser = await this.prisma.blockedUsers.findFirst({
                        where: {
                            OR: [
                                { deviceId: data.deviceId },
                                { userId: data.userId },
                            ],
                        },
                    });
                    if (olduser)
                        throw new common_1.UnauthorizedException("Siz yoki qurilmanziz bloklangansiz blokdan chiqish uchun @Asqaraliyev_Faxriddin bilan bog'laning");
                    return true;
                }
                return true;
            }
            return true;
        }
        catch (error) {
            throw new common_1.UnauthorizedException("Siz yoki qurilmangiz bloklangansiz blokdan chiqish uchun @Asqaraliyev_Faxriddin bilan bog'laning");
        }
    }
};
exports.BlockGuard = BlockGuard;
exports.BlockGuard = BlockGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService, prisma_service_1.PrismaService])
], BlockGuard);
//# sourceMappingURL=block.guard.js.map