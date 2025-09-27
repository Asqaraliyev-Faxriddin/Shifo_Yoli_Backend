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
    async searchUsers(dto, role) {
        const { firstName, lastName, email, ageFrom, ageTo, page, limit } = dto;
        const skip = (page - 1) * limit;
        const where = { role };
        if (email) {
            where.email = { contains: email, mode: "insensitive" };
        }
        if (firstName) {
            where.firstName = { contains: firstName, mode: "insensitive" };
        }
        if (lastName) {
            where.lastName = { contains: lastName, mode: "insensitive" };
        }
        if (ageFrom || ageTo) {
            where.age = {};
            if (ageFrom)
                where.age.gte = ageFrom;
            if (ageTo)
                where.age.lte = ageTo;
        }
        const [data, total] = await Promise.all([
            this.prisma.user.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: "desc" },
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    age: true,
                    profileImg: true,
                    role: true,
                    createdAt: true,
                },
            }),
            this.prisma.user.count({ where }),
        ]);
        return {
            data,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
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
    async findOneAdmin(id) {
        const admin = await this.prisma.user.findUnique({
            where: { id },
        });
        if (!admin || admin.role !== client_1.UserRole.ADMIN) {
            throw new common_1.NotFoundException("Admin topilmadi");
        }
        return admin;
    }
    async updateAdmin(id, dto, profileImgUrl) {
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
    async updatePatient(id, dto, profileImgUrl) {
        const admin = await this.prisma.user.findUnique({ where: { id } });
        if (!admin || admin.role !== client_1.UserRole.BEMOR) {
            throw new common_1.NotFoundException("Bemor topilmadi");
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
    async deleteAdmin(id) {
        const admin = await this.prisma.user.findUnique({ where: { id } });
        if (!admin || admin.role !== client_1.UserRole.ADMIN) {
            throw new common_1.NotFoundException("Admin topilmadi");
        }
        return this.prisma.user.delete({ where: { id } });
    }
    async deleteDoctor(id) {
        const doctor = await this.prisma.user.findUnique({ where: { id } });
        if (!doctor || doctor.role !== client_1.UserRole.DOCTOR) {
            throw new common_1.NotFoundException("Doctor topilmadi");
        }
        return this.prisma.user.delete({ where: { id } });
    }
    async deletePatient(id) {
        const patient = await this.prisma.user.findUnique({ where: { id } });
        if (!patient || patient.role !== client_1.UserRole.BEMOR) {
            throw new common_1.NotFoundException("Bemor topilmadi");
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
    async createDoctor(dto, profileImgUrl, images, videos) {
        const exists = await this.prisma.user.findUnique({ where: { email: dto.email } });
        if (exists) {
            throw new common_1.BadRequestException("Bunday email bilan foydalanuvchi mavjud");
        }
        return this.prisma.user.create({
            data: {
                email: dto.email,
                firstName: dto.firstName,
                lastName: dto.lastName,
                password: dto.password,
                age: dto.age,
                profileImg: profileImgUrl ?? undefined,
                role: client_1.UserRole.DOCTOR,
                doctorProfile: {
                    create: {
                        category: {
                            connect: { id: dto.categoryId },
                        },
                        bioUz: dto.bio ?? undefined,
                        images: images && Object.keys(images).length ? images : undefined,
                        videos: videos && Object.keys(videos).length ? videos : undefined,
                        salary: {
                            create: {
                                daily: dto.dailySalary,
                                weekly: dto.dailySalary * 7,
                                monthly: dto.dailySalary * 30,
                                yearly: dto.dailySalary * 365,
                            },
                        },
                    },
                },
            },
            include: {
                doctorProfile: {
                    include: { category: true, salary: true },
                },
            },
        });
    }
    async createPatient(dto, profileImgUrl) {
        const exists = await this.prisma.user.findUnique({ where: { email: dto.email } });
        if (exists) {
            throw new common_1.BadRequestException("Bunday email bilan foydalanuvchi mavjud");
        }
        return this.prisma.user.create({
            data: {
                email: dto.email,
                firstName: dto.firstName,
                lastName: dto.lastName,
                password: dto.password,
                age: dto.age,
                profileImg: profileImgUrl ?? null,
                role: client_1.UserRole.BEMOR,
            },
        });
    }
    async nimadir() {
        let data = await this.prisma.device.findMany({ include: { user: true } });
        let total = await this.prisma.device.count();
        return { data, total };
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminService);
//# sourceMappingURL=admin.service.js.map