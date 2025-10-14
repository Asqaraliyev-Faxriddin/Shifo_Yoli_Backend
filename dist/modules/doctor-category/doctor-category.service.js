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
exports.DoctorCategoryService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../core/prisma/prisma.service");
let DoctorCategoryService = class DoctorCategoryService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createDto, img) {
        let oldCategory = await this.prisma.doctorCategory.findFirst({ where: { name: createDto.name } });
        if (oldCategory)
            throw new common_1.NotFoundException(`Bu kategoriya avval yaratilgan`);
        return this.prisma.doctorCategory.create({
            data: {
                name: createDto.name,
                img: img || null,
            },
            include: {
                doctors: true,
            },
        });
    }
    async findAll(filter) {
        const where = {};
        if (filter?.name) {
            where.name = { contains: filter.name, mode: 'insensitive' };
        }
        if (filter?.doctorId) {
            where.doctors = {
                some: { doctorId: filter.doctorId },
            };
        }
        const categories = await this.prisma.doctorCategory.findMany({
            where,
            skip: filter?.offset ?? 0,
            take: filter?.limit ?? 10,
            include: {
                _count: {
                    select: { doctors: true },
                },
                doctors: true,
            },
            orderBy: { createdAt: 'desc' },
        });
        return categories;
    }
    async transitionAll() {
        return this.prisma.walletTransaction.findMany({ include: { wallet: { include: { user: true } } } });
    }
    async findOne(id) {
        const category = await this.prisma.doctorCategory.findUnique({
            where: { id },
            include: { doctors: true },
        });
        if (!category) {
            throw new common_1.NotFoundException(`DoctorCategory with id ${id} not found`);
        }
        return category;
    }
    async update(id, updateDto, img) {
        const category = await this.prisma.doctorCategory.findUnique({ where: { id } });
        if (!category)
            throw new common_1.NotFoundException(`Bu kategoriya topilmadi`);
        if (updateDto.name) {
            let oldCategory = await this.prisma.doctorCategory.findFirst({ where: { name: updateDto.name } });
            if (oldCategory)
                throw new common_1.NotFoundException(`Bu kategoriya avval yaratilgan`);
        }
        return this.prisma.doctorCategory.update({
            where: { id },
            data: {
                name: updateDto.name ?? category.name,
                img: img ?? category.img,
            },
            include: { doctors: true },
        });
    }
    async remove(id) {
        const category = await this.prisma.doctorCategory.findUnique({ where: { id } });
        if (!category)
            throw new common_1.NotFoundException(`Bu kategoriya topilmadi`);
        return this.prisma.doctorCategory.delete({
            where: { id },
            include: { doctors: true },
        });
    }
};
exports.DoctorCategoryService = DoctorCategoryService;
exports.DoctorCategoryService = DoctorCategoryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DoctorCategoryService);
//# sourceMappingURL=doctor-category.service.js.map