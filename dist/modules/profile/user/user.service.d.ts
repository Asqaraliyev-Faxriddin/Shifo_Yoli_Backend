import { PrismaService } from 'src/core/prisma/prisma.service';
import { SearchUserDto } from 'src/modules/admin/dto/create-admin.dto';
export declare class PublicService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getTopDoctors(): Promise<any[]>;
    getBestDoctorOfWeek(): Promise<({
        doctor: {
            email: string;
            lastName: string;
            firstName: string;
            age: number;
            id: string;
            role: import(".prisma/client").$Enums.UserRole;
            profileImg: string | null;
            reviewsReceived: {
                user: {
                    lastName: string;
                    firstName: string;
                    id: string;
                };
                id: string;
                createdAt: Date;
                rating: number;
                comment: string | null;
            }[];
        };
        category: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            img: string | null;
        };
        salary: {
            daily: import("@prisma/client/runtime/library").Decimal | null;
            weekly: import("@prisma/client/runtime/library").Decimal | null;
            monthly: import("@prisma/client/runtime/library").Decimal | null;
            yearly: import("@prisma/client/runtime/library").Decimal | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        doctorId: string;
        categoryId: string;
        bio: string;
        images: import("@prisma/client/runtime/library").JsonValue | null;
        videos: import("@prisma/client/runtime/library").JsonValue | null;
        published: boolean;
        files: import("@prisma/client/runtime/library").JsonValue | null;
        futures: import("@prisma/client/runtime/library").JsonValue | null;
    }) | null>;
    getMostReviewedDoctors(): Promise<({
        doctor: {
            email: string;
            lastName: string;
            firstName: string;
            age: number;
            id: string;
            role: import(".prisma/client").$Enums.UserRole;
            profileImg: string | null;
            reviewsReceived: {
                user: {
                    lastName: string;
                    firstName: string;
                    id: string;
                };
                id: string;
                createdAt: Date;
                rating: number;
                comment: string | null;
            }[];
        };
        category: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            img: string | null;
        };
        salary: {
            daily: import("@prisma/client/runtime/library").Decimal | null;
            weekly: import("@prisma/client/runtime/library").Decimal | null;
            monthly: import("@prisma/client/runtime/library").Decimal | null;
            yearly: import("@prisma/client/runtime/library").Decimal | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        doctorId: string;
        categoryId: string;
        bio: string;
        images: import("@prisma/client/runtime/library").JsonValue | null;
        videos: import("@prisma/client/runtime/library").JsonValue | null;
        published: boolean;
        files: import("@prisma/client/runtime/library").JsonValue | null;
        futures: import("@prisma/client/runtime/library").JsonValue | null;
    })[]>;
    getCategories(): Promise<({
        doctors: {
            id: string;
            doctor: {
                lastName: string;
                firstName: string;
                id: string;
                profileImg: string | null;
                reviewsReceived: {
                    user: {
                        lastName: string;
                        firstName: string;
                        id: string;
                    };
                    id: string;
                    createdAt: Date;
                    rating: number;
                    comment: string | null;
                }[];
            };
            bio: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        img: string | null;
    })[]>;
    private searchUsers;
    private searchUsersPrivate;
    doctorsAll(dto: SearchUserDto): Promise<{
        data: ({
            doctorProfile: ({
                category: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    name: string;
                    img: string | null;
                };
                salary: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    doctorId: string;
                    free: boolean;
                    daily: import("@prisma/client/runtime/library").Decimal | null;
                    weekly: import("@prisma/client/runtime/library").Decimal | null;
                    monthly: import("@prisma/client/runtime/library").Decimal | null;
                    yearly: import("@prisma/client/runtime/library").Decimal | null;
                }[];
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                doctorId: string;
                categoryId: string;
                bio: string;
                images: import("@prisma/client/runtime/library").JsonValue | null;
                videos: import("@prisma/client/runtime/library").JsonValue | null;
                published: boolean;
                files: import("@prisma/client/runtime/library").JsonValue | null;
                futures: import("@prisma/client/runtime/library").JsonValue | null;
            }) | null;
            wallet: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                balance: import("@prisma/client/runtime/library").Decimal;
                userId: string;
            } | null;
        } & {
            email: string;
            password: string;
            lastName: string;
            firstName: string;
            age: number;
            month: number | null;
            day: number | null;
            id: string;
            phoneNumber: string | null;
            role: import(".prisma/client").$Enums.UserRole;
            profileImg: string | null;
            isActive: boolean;
            isOnline: boolean;
            lastSeen: Date | null;
            createdAt: Date;
            updatedAt: Date;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    doctorsAllPrivate(dto: SearchUserDto, userId: string): Promise<{
        data: ({
            doctorProfile: ({
                category: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    name: string;
                    img: string | null;
                };
                salary: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    doctorId: string;
                    free: boolean;
                    daily: import("@prisma/client/runtime/library").Decimal | null;
                    weekly: import("@prisma/client/runtime/library").Decimal | null;
                    monthly: import("@prisma/client/runtime/library").Decimal | null;
                    yearly: import("@prisma/client/runtime/library").Decimal | null;
                }[];
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                doctorId: string;
                categoryId: string;
                bio: string;
                images: import("@prisma/client/runtime/library").JsonValue | null;
                videos: import("@prisma/client/runtime/library").JsonValue | null;
                published: boolean;
                files: import("@prisma/client/runtime/library").JsonValue | null;
                futures: import("@prisma/client/runtime/library").JsonValue | null;
            }) | null;
            wallet: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                balance: import("@prisma/client/runtime/library").Decimal;
                userId: string;
            } | null;
        } & {
            email: string;
            password: string;
            lastName: string;
            firstName: string;
            age: number;
            month: number | null;
            day: number | null;
            id: string;
            phoneNumber: string | null;
            role: import(".prisma/client").$Enums.UserRole;
            profileImg: string | null;
            isActive: boolean;
            isOnline: boolean;
            lastSeen: Date | null;
            createdAt: Date;
            updatedAt: Date;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    doctorOne(id: string): Promise<{
        data: {
            doctorProfile: ({
                category: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    name: string;
                    img: string | null;
                };
                salary: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    doctorId: string;
                    free: boolean;
                    daily: import("@prisma/client/runtime/library").Decimal | null;
                    weekly: import("@prisma/client/runtime/library").Decimal | null;
                    monthly: import("@prisma/client/runtime/library").Decimal | null;
                    yearly: import("@prisma/client/runtime/library").Decimal | null;
                }[];
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                doctorId: string;
                categoryId: string;
                bio: string;
                images: import("@prisma/client/runtime/library").JsonValue | null;
                videos: import("@prisma/client/runtime/library").JsonValue | null;
                published: boolean;
                files: import("@prisma/client/runtime/library").JsonValue | null;
                futures: import("@prisma/client/runtime/library").JsonValue | null;
            }) | null;
        } & {
            email: string;
            password: string;
            lastName: string;
            firstName: string;
            age: number;
            month: number | null;
            day: number | null;
            id: string;
            phoneNumber: string | null;
            role: import(".prisma/client").$Enums.UserRole;
            profileImg: string | null;
            isActive: boolean;
            isOnline: boolean;
            lastSeen: Date | null;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
}
