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
exports.DoctorProfileService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../core/prisma/prisma.service");
const fs = require("fs");
const path = require("path");
const mailer_service_1 = require("../../common/mailer/mailer.service");
let DoctorProfileService = class DoctorProfileService {
    prisma;
    mailerService;
    constructor(prisma, mailerService) {
        this.prisma = prisma;
        this.mailerService = mailerService;
    }
    parseBoolean = (val) => {
        if (val === "true" || val === true)
            return true;
        if (val === "false" || val === false)
            return false;
        return undefined;
    };
    deleteFileFromUploads(filePath) {
        try {
            const fullPath = path.join(process.cwd(), 'uploads', filePath);
            if (fs.existsSync(fullPath)) {
                fs.unlinkSync(fullPath);
            }
        }
        catch (err) {
            console.error('❌ File delete error:', err.message);
        }
    }
    async create(userId, dto, images, videos) {
        let oldtr = await this.prisma.doctorProfile.findFirst({
            where: {
                doctorId: userId
            }
        });
        if (oldtr) {
            throw new common_1.UnauthorizedException("Sizda allaqachon doctor profile mavjud");
        }
        let user = await this.prisma.user.findFirst({
            where: {
                role: "DOCTOR",
                id: userId
            }
        });
        if (!user) {
            throw new common_1.UnauthorizedException("Bunday doctor mavjud emas");
        }
        let olduser = await this.prisma.doctorProfile.create({
            data: {
                bio: dto.bio,
                categoryId: dto.categoryId,
                images: images ?? [],
                videos: videos ?? [],
                doctorId: userId,
                futures: dto.futures,
            },
        });
        if (dto.dailySalary) {
            await this.prisma.doctorSalary.create({
                data: {
                    daily: dto.dailySalary,
                    weekly: dto.dailySalary * 7,
                    monthly: dto.dailySalary * 30,
                    yearly: dto.dailySalary * 365,
                    doctorId: olduser.id
                }
            });
        }
        await this.mailerService.sendNotificationEmail('admin@example.com', 'Yangi Doctor Profile', `Yangi doctor profili yaratildi: ${dto.bio || 'Bio kiritilmagan'}`);
        return {
            success: true,
            message: 'Doctor profili muvaffaqiyatli yaratildi',
        };
    }
    async update(id, dto, images, videos, files) {
        const doctor = await this.prisma.doctorProfile.findUnique({ where: { id } });
        if (!doctor)
            throw new common_1.NotFoundException('Doctor profile not found');
        const data = {};
        if (dto.bio !== undefined) {
            data.bio = dto.bio;
        }
        if (dto.categoryId !== undefined) {
            if (dto.categoryId.trim()) {
                const categoryExists = await this.prisma.doctorCategory.findUnique({
                    where: { id: dto.categoryId },
                });
                if (!categoryExists) {
                    throw new common_1.BadRequestException('Bunday kategoriya mavjud emas');
                }
                data.categoryId = dto.categoryId;
            }
            else {
                data.categoryId = doctor.categoryId;
            }
        }
        if (images && images.length) {
            data.images = images;
        }
        if (files && files.length) {
            data.files = files;
        }
        if (videos && videos.length) {
            data.videos = videos;
        }
        if (dto.futures !== undefined) {
            data.futures = dto.futures;
        }
        await this.prisma.doctorProfile.update({
            where: { id },
            data,
        });
        if (dto.dailySalary !== undefined || dto.free !== undefined) {
            const existingSalary = await this.prisma.doctorSalary.findFirst({
                where: { doctorId: id },
            });
            const salaryData = {};
            if (dto.dailySalary !== undefined) {
                salaryData.daily = dto.dailySalary;
                salaryData.weekly = dto.dailySalary * 7;
                salaryData.monthly = dto.dailySalary * 30;
                salaryData.yearly = dto.dailySalary * 365;
            }
            if (dto.free !== undefined) {
                salaryData.free = this.parseBoolean(dto.free);
            }
            if (existingSalary) {
                await this.prisma.doctorSalary.update({
                    where: { id: existingSalary.id },
                    data: salaryData,
                });
            }
            else {
                await this.prisma.doctorSalary.create({
                    data: {
                        ...salaryData,
                        doctorId: id,
                    },
                });
            }
        }
        const superAdmins = await this.prisma.user.findMany({
            where: { role: 'SUPERADMIN' },
        });
        await Promise.all(superAdmins.map((admin) => this.mailerService.sendNotificationEmail(admin.email, `Doktor profili yangilandi`, `Doctor profili yangilandi: ${id}`)));
        return {
            success: true,
            message: 'Doctor profili muvaffaqiyatli yangilandi va SuperAdmin’larga xabar yuborildi',
            data,
        };
    }
    async remove(id) {
        const doctor = await this.prisma.doctorProfile.findUnique({ where: { id } });
        if (!doctor)
            throw new common_1.NotFoundException('Doctor profile not found');
        (Array.isArray(doctor.images) ? doctor.images : [])
            .filter((img) => typeof img === 'string')
            .forEach((img) => this.deleteFileFromUploads(img));
        (Array.isArray(doctor.videos) ? doctor.videos : [])
            .filter((vid) => typeof vid === 'string')
            .forEach((vid) => this.deleteFileFromUploads(vid));
        let olddoctor = await this.prisma.user.findFirst({
            where: {
                role: "DOCTOR",
                id: doctor.doctorId
            }
        });
        if (!olddoctor) {
            throw new common_1.UnauthorizedException("Bunday doctor mavjud emas");
        }
        await this.prisma.doctorProfile.delete({ where: { id } });
        const superAdmins = await this.prisma.user.findMany({
            where: { role: 'SUPERADMIN' },
        });
        await Promise.all(superAdmins.map((admin) => this.mailerService.sendNotificationEmail(admin.email, `Manashu doctor  email : ${olddoctor.email}  `, `Doctor profilini o'chirdi yangilandi: ${id}`)));
        return {
            success: true,
            message: 'Doctor profili muvaffaqiyatli o‘chirildi',
        };
    }
    async addImage(id, dto) {
        const doctor = await this.prisma.doctorProfile.findUnique({ where: { id } });
        if (!doctor)
            throw new common_1.NotFoundException('Doctor profile not found');
        const updatedImages = [
            ...(Array.isArray(doctor.images) ? doctor.images : []),
            dto.image,
        ];
        await this.prisma.doctorProfile.update({
            where: { id },
            data: { images: updatedImages },
        });
        return {
            success: true,
            message: 'Rasm muvaffaqiyatli qo‘shildi',
        };
    }
    async removeImage(id, dto) {
        const doctor = await this.prisma.doctorProfile.findUnique({ where: { id } });
        if (!doctor)
            throw new common_1.NotFoundException('Doctor profile topilmadi');
        this.deleteFileFromUploads(dto.image);
        const updatedImages = (Array.isArray(doctor.images) ? doctor.images : []).filter((img) => img !== dto.image);
        await this.prisma.doctorProfile.update({
            where: { id },
            data: { images: updatedImages },
        });
        return {
            success: true,
            message: 'Rasm muvaffaqiyatli o‘chirildi',
        };
    }
    async addVideo(id, dto) {
        const doctor = await this.prisma.doctorProfile.findUnique({ where: { id } });
        if (!doctor)
            throw new common_1.NotFoundException('Doctor profile topilmadi');
        const updatedVideos = [
            ...(Array.isArray(doctor.videos) ? doctor.videos : []),
            dto.video,
        ];
        await this.prisma.doctorProfile.update({
            where: { id },
            data: { videos: updatedVideos },
        });
        return {
            success: true,
            message: 'Video muvaffaqiyatli qo‘shildi',
        };
    }
    async removeVideo(id, dto) {
        const doctor = await this.prisma.doctorProfile.findUnique({ where: { id } });
        if (!doctor)
            throw new common_1.NotFoundException('Doctor profile topilmadi');
        this.deleteFileFromUploads(dto.video);
        const updatedVideos = (Array.isArray(doctor.videos) ? doctor.videos : []).filter((vid) => vid !== dto.video);
        await this.prisma.doctorProfile.update({
            where: { id },
            data: { videos: updatedVideos },
        });
        return {
            success: true,
            message: 'Video muvaffaqiyatli o‘chirildi',
        };
    }
    async doctorProfile(id) {
        let data = await this.prisma.doctorProfile.findFirst({
            where: { id },
        });
        if (!data)
            throw new common_1.NotFoundException("Doctor profile topilmadi");
        return {
            success: true,
            message: "Doctor profile muvaffaqiyatli topildi",
            data
        };
    }
    async DoctorProfiles(payload) {
        const { email, firstName, lastName, minAge, maxAge, categoryName, limit = 10, offset = 1, } = payload;
        const where = {
            published: true,
            doctor: {
                email: email ? { contains: email, mode: "insensitive" } : undefined,
                firstName: firstName ? { contains: firstName, mode: "insensitive" } : undefined,
                lastName: lastName ? { contains: lastName, mode: "insensitive" } : undefined,
                age: {
                    gte: minAge ?? undefined,
                    lte: maxAge ?? undefined,
                },
            },
            category: categoryName
                ? { name: { contains: categoryName, mode: "insensitive" } }
                : undefined,
        };
        const [data, total] = await this.prisma.$transaction([
            this.prisma.doctorProfile.findMany({
                where,
                skip: (offset - 1) * limit,
                take: limit,
                include: {
                    category: true,
                    doctor: {
                        select: {
                            id: true,
                            email: true,
                            firstName: true,
                            lastName: true,
                            age: true,
                            phoneNumber: true,
                            role: true,
                            profileImg: true,
                            isActive: true,
                            createdAt: true,
                            updatedAt: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: "desc",
                },
            }),
            this.prisma.doctorProfile.count({ where }),
        ]);
        return {
            success: true,
            message: "Doctor profiles muvaffaqiyatli topildi",
            total,
            page: offset,
            limit,
            data,
        };
    }
};
exports.DoctorProfileService = DoctorProfileService;
exports.DoctorProfileService = DoctorProfileService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        mailer_service_1.AppMailerService])
], DoctorProfileService);
//# sourceMappingURL=doctor-profile.service.js.map