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
exports.PublicService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../../core/prisma/prisma.service");
let PublicService = class PublicService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getTopDoctors() {
        const ratedDoctors = await this.prisma.review.groupBy({
            by: ['doctorId'],
            _avg: { rating: true },
            orderBy: { _avg: { rating: 'desc' } },
            take: 10,
        });
        const ratedDoctorIds = ratedDoctors.map((d) => d.doctorId);
        const ratedDoctorUsers = await this.prisma.user.findMany({
            where: {
                id: { in: ratedDoctorIds },
                role: 'DOCTOR',
                doctorProfile: {
                    is: {
                        published: true,
                    },
                },
            },
            include: {
                doctorProfile: {
                    include: {
                        category: true,
                        salary: {
                            select: { daily: true, weekly: true, monthly: true, yearly: true },
                        },
                    },
                },
                reviewsReceived: {
                    select: {
                        id: true,
                        rating: true,
                        comment: true,
                        createdAt: true,
                        user: { select: { id: true, firstName: true, lastName: true } },
                    },
                },
            },
        });
        const remainingCount = 10 - ratedDoctorUsers.length;
        let unratedDoctors = [];
        if (remainingCount > 0) {
            unratedDoctors = await this.prisma.user.findMany({
                where: {
                    role: 'DOCTOR',
                    doctorProfile: {
                        is: {
                            published: true,
                        },
                    },
                    NOT: { id: { in: ratedDoctorIds } },
                },
                take: remainingCount,
                orderBy: { createdAt: 'asc' },
                include: {
                    doctorProfile: {
                        include: {
                            category: true,
                            salary: {
                                select: { daily: true, weekly: true, monthly: true, yearly: true },
                            },
                        },
                    },
                    reviewsReceived: {
                        select: {
                            id: true,
                            rating: true,
                            comment: true,
                            createdAt: true,
                            user: { select: { id: true, firstName: true, lastName: true } },
                        },
                    },
                },
            });
        }
        return [...ratedDoctorUsers, ...unratedDoctors].slice(0, 10);
    }
    async getBestDoctorOfWeek() {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const doctor = await this.prisma.review.groupBy({
            by: ['doctorId'],
            where: { createdAt: { gte: sevenDaysAgo } },
            _avg: { rating: true },
            _count: { id: true },
            orderBy: { _count: { id: 'desc' } },
            take: 1,
        });
        if (doctor.length === 0)
            return null;
        return this.prisma.doctorProfile.findUnique({
            where: { doctorId: doctor[0].doctorId },
            include: {
                category: true,
                salary: {
                    select: { daily: true, weekly: true, monthly: true, yearly: true },
                },
                doctor: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        age: true,
                        profileImg: true,
                        role: true,
                        reviewsReceived: {
                            select: {
                                id: true,
                                rating: true,
                                comment: true,
                                createdAt: true,
                                user: { select: { id: true, firstName: true, lastName: true } },
                            },
                        },
                    },
                },
            },
        });
    }
    async getMostReviewedDoctors() {
        const doctors = await this.prisma.review.groupBy({
            by: ['doctorId'],
            _count: { id: true },
            orderBy: { _count: { id: 'desc' } },
            take: 12,
        });
        return this.prisma.doctorProfile.findMany({
            where: {
                doctorId: { in: doctors.map((d) => d.doctorId) },
            },
            include: {
                category: true,
                salary: {
                    select: { daily: true, weekly: true, monthly: true, yearly: true },
                },
                doctor: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        age: true,
                        profileImg: true,
                        role: true,
                        reviewsReceived: {
                            select: {
                                id: true,
                                rating: true,
                                comment: true,
                                createdAt: true,
                                user: { select: { id: true, firstName: true, lastName: true } },
                            },
                        },
                    },
                },
            },
        });
    }
    async getCategories() {
        return this.prisma.doctorCategory.findMany({
            include: {
                doctors: {
                    select: {
                        id: true,
                        bio: true,
                        doctor: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                profileImg: true,
                                reviewsReceived: {
                                    select: {
                                        id: true,
                                        rating: true,
                                        comment: true,
                                        createdAt: true,
                                        user: {
                                            select: { id: true, firstName: true, lastName: true },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
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
        if (role == client_1.UserRole.DOCTOR) {
            where.doctorProfile = { published: true };
        }
        if (role === client_1.UserRole.DOCTOR && categoryId) {
            where.doctorProfile = { categoryId, };
        }
        const [data, total] = await Promise.all([
            this.prisma.user.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: "desc" },
                include: { doctorProfile: { include: { category: true, salary: true } }, wallet: true, },
            }),
            this.prisma.user.count({ where }),
        ]);
        return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
    }
    async searchUsersPrivate(dto, role, userId) {
        const { firstName, lastName, email, ageFrom, ageTo, categoryId, page, limit } = dto;
        const skip = (page - 1) * limit;
        const where = { role };
        if (role === client_1.UserRole.DOCTOR) {
            const paidDoctorIds = await this.prisma.dailyDoctorAccess.findMany({
                where: { patientId: userId },
                select: { doctorId: true },
                distinct: ["doctorId"],
            });
            const paidIds = paidDoctorIds.map((d) => d.doctorId);
            const chatDoctorIds = await this.prisma.chatParticipant.findMany({
                where: {
                    userId: userId,
                    chat: {
                        participants: {
                            some: {
                                user: {
                                    role: client_1.UserRole.DOCTOR,
                                },
                            },
                        },
                    },
                },
                select: {
                    chat: {
                        select: {
                            participants: {
                                where: { user: { role: client_1.UserRole.DOCTOR } },
                                select: { userId: true },
                            },
                        },
                    },
                },
            });
            const chatIds = chatDoctorIds.flatMap((c) => c.chat.participants.map((p) => p.userId));
            const uniqueDoctorIds = [...new Set([...paidIds, ...chatIds])];
            if (uniqueDoctorIds.length === 0) {
                return {
                    data: [],
                    meta: { total: 0, page, limit, totalPages: 0 },
                };
            }
            where.id = { in: uniqueDoctorIds };
            where.doctorProfile = { published: true };
        }
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
            where.doctorProfile = { published: true, categoryId };
        }
        const [data, total] = await Promise.all([
            this.prisma.user.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: "desc" },
                include: {
                    doctorProfile: { include: { category: true, salary: true } },
                    wallet: true,
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
    async doctorsAll(dto) {
        return this.searchUsers(dto, client_1.UserRole.DOCTOR);
    }
    async doctorsAllPrivate(dto, userId) {
        return this.searchUsersPrivate(dto, client_1.UserRole.DOCTOR, userId);
    }
    async doctorOne(id) {
        let olddoctor = await this.prisma.user.findFirst({
            where: {
                role: "DOCTOR",
                id
            },
            include: {
                doctorProfile: {
                    include: {
                        category: true,
                        salary: true
                    }
                },
            }
        });
        if (!olddoctor)
            throw new common_1.NotFoundException("Doktor Topilmadi");
        return {
            data: olddoctor
        };
    }
};
exports.PublicService = PublicService;
exports.PublicService = PublicService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PublicService);
//# sourceMappingURL=user.service.js.map