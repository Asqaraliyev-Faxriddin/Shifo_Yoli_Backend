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
let AdminService = class AdminService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createAdminDto, profileImgUrl) {
        const exists = await this.prisma.user.findUnique({
            where: { email: createAdminDto.email },
        });
        if (exists) {
            throw new common_1.BadRequestException("Bunday email bilan foydalanuvchi mavjud");
        }
        return this.prisma.user.create({
            data: {
                email: createAdminDto.email,
                firstName: createAdminDto.firstName,
                lastName: createAdminDto.lastName,
                password: createAdminDto.password,
                age: createAdminDto.age,
                profileImg: profileImgUrl ?? null,
                role: client_1.UserRole.ADMIN,
            },
        });
    }
    async findAll() {
        return this.prisma.user.findMany({
            where: { role: client_1.UserRole.ADMIN },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                age: true,
                profileImg: true,
                role: true,
            },
        });
    }
    async findOne(id) {
        const admin = await this.prisma.user.findUnique({
            where: { id, role: client_1.UserRole.ADMIN },
        });
        if (!admin)
            throw new common_1.NotFoundException("Admin topilmadi");
        return admin;
    }
    async update(id, dto, profileImgUrl) {
        const admin = await this.prisma.user.findUnique({ where: { id } });
        if (!admin || admin.role !== client_1.UserRole.ADMIN) {
            throw new common_1.NotFoundException("Admin topilmadi");
        }
        return this.prisma.user.update({
            where: { id },
            data: {
                firstName: dto.firstName ?? admin.firstName,
                lastName: dto.lastName ?? admin.lastName,
                password: dto.password ?? admin.password,
                age: dto.age ?? admin.age,
                profileImg: profileImgUrl ?? admin.profileImg,
            },
        });
    }
    async remove(id) {
        const admin = await this.prisma.user.findUnique({
            where: { id },
        });
        if (!admin || admin.role !== client_1.UserRole.ADMIN) {
            throw new common_1.NotFoundException("Admin topilmadi");
        }
        return this.prisma.user.delete({ where: { id } });
    }
    async blockUser(dto) {
        const user = await this.prisma.user.findUnique({
            where: { id: dto.userId },
        });
        if (!user)
            throw new common_1.NotFoundException("User topilmadi");
        const blocked = await this.prisma.blockedUsers.findUnique({
            where: { userId: dto.userId },
        });
        if (blocked) {
            throw new common_1.BadRequestException("Bu user allaqachon block qilingan");
        }
        return this.prisma.blockedUsers.create({
            data: {
                userId: dto.userId,
                reason: dto.reason ?? null,
            },
        });
    }
    async unblockUser(dto) {
        const blocked = await this.prisma.blockedUsers.findUnique({
            where: { userId: dto.userId },
        });
        if (!blocked)
            throw new common_1.NotFoundException("User block qilinmagan");
        return this.prisma.blockedUsers.delete({
            where: { userId: dto.userId },
        });
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminService);
//# sourceMappingURL=admin.service.js.map