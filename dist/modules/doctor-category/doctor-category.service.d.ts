import { PrismaService } from 'src/core/prisma/prisma.service';
import { CreateCategory, CategoryAllDto, UpdateCategory } from './dto/create-doctor-category.dto';
export declare class DoctorCategoryService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createDto: CreateCategory, img?: string): Promise<{
        doctors: {
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
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        img: string | null;
    }>;
    findAll(filter?: CategoryAllDto): Promise<({
        _count: {
            doctors: number;
        };
        doctors: {
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
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        img: string | null;
    })[]>;
    transitionAll(): Promise<({
        wallet: {
            user: {
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
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            balance: import("@prisma/client/runtime/library").Decimal;
            userId: string;
        };
    } & {
        type: import(".prisma/client").$Enums.TransactionType;
        id: string;
        createdAt: Date;
        amount: import("@prisma/client/runtime/library").Decimal;
        source: import(".prisma/client").$Enums.PaymentType | null;
        meta: import("@prisma/client/runtime/library").JsonValue | null;
        walletId: string;
    })[]>;
    findOne(id: string): Promise<{
        doctors: {
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
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        img: string | null;
    }>;
    update(id: string, updateDto: UpdateCategory, img?: string): Promise<{
        doctors: {
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
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        img: string | null;
    }>;
    remove(id: string): Promise<{
        doctors: {
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
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        img: string | null;
    }>;
}
