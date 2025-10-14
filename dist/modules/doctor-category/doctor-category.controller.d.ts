import { DoctorCategoryService } from './doctor-category.service';
import { CreateCategory, CategoryAllDto, UpdateCategory } from './dto/create-doctor-category.dto';
export declare class DoctorCategoryController {
    private readonly service;
    constructor(service: DoctorCategoryService);
    create(dto: CreateCategory, file?: Express.Multer.File): Promise<{
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
    findAll(query: CategoryAllDto): Promise<({
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
    update(id: string, dto: UpdateCategory, file?: Express.Multer.File): Promise<{
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
