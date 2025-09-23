import { PrismaService } from "src/core/prisma/prisma.service";
import { CreateAdminDto, UpdateAdminDto, BlockUserDto, UnblockUserDto, CreateDoctorDto, CreatePatientDto } from "./dto/create-admin.dto";
import { SearchUserDto } from "./dto/update-admin.dto";
export declare class AdminService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createAdminDto: CreateAdminDto, profileImgUrl?: string): Promise<{
        email: string;
        password: string;
        lastName: string;
        firstName: string;
        age: number;
        id: string;
        role: import(".prisma/client").$Enums.UserRole;
        profileImg: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    private searchUsers;
    findAllAdmins(dto: SearchUserDto): Promise<{
        data: {
            email: string;
            lastName: string;
            firstName: string;
            age: number;
            id: string;
            role: import(".prisma/client").$Enums.UserRole;
            profileImg: string | null;
            createdAt: Date;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findAllDoctors(dto: SearchUserDto): Promise<{
        data: {
            email: string;
            lastName: string;
            firstName: string;
            age: number;
            id: string;
            role: import(".prisma/client").$Enums.UserRole;
            profileImg: string | null;
            createdAt: Date;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findAllPatients(dto: SearchUserDto): Promise<{
        data: {
            email: string;
            lastName: string;
            firstName: string;
            age: number;
            id: string;
            role: import(".prisma/client").$Enums.UserRole;
            profileImg: string | null;
            createdAt: Date;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOneAdmin(id: string): Promise<{
        email: string;
        password: string;
        lastName: string;
        firstName: string;
        age: number;
        id: string;
        role: import(".prisma/client").$Enums.UserRole;
        profileImg: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateAdmin(id: string, dto: UpdateAdminDto, profileImgUrl?: string): Promise<{
        email: string;
        password: string;
        lastName: string;
        firstName: string;
        age: number;
        id: string;
        role: import(".prisma/client").$Enums.UserRole;
        profileImg: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    deleteAdmin(id: string): Promise<{
        email: string;
        password: string;
        lastName: string;
        firstName: string;
        age: number;
        id: string;
        role: import(".prisma/client").$Enums.UserRole;
        profileImg: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    deleteDoctor(id: string): Promise<{
        email: string;
        password: string;
        lastName: string;
        firstName: string;
        age: number;
        id: string;
        role: import(".prisma/client").$Enums.UserRole;
        profileImg: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    deletePatient(id: string): Promise<{
        email: string;
        password: string;
        lastName: string;
        firstName: string;
        age: number;
        id: string;
        role: import(".prisma/client").$Enums.UserRole;
        profileImg: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    blockUser(dto: BlockUserDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        reason: string | null;
    }>;
    unblockUser(dto: UnblockUserDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        reason: string | null;
    }>;
    createDoctor(dto: CreateDoctorDto, profileImgUrl?: string): Promise<{
        doctorProfile: ({
            category: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                nameUz: string;
                nameRu: string;
                nameEn: string;
            } | null;
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            doctorId: string;
            rating: number;
            categoryId: string | null;
            salary: import("@prisma/client/runtime/library").Decimal | null;
            images: import("@prisma/client/runtime/library").JsonValue | null;
            videos: import("@prisma/client/runtime/library").JsonValue | null;
            bioUz: string | null;
            bioRu: string | null;
            bioEn: string | null;
        }) | null;
    } & {
        email: string;
        password: string;
        lastName: string;
        firstName: string;
        age: number;
        id: string;
        role: import(".prisma/client").$Enums.UserRole;
        profileImg: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    createPatient(dto: CreatePatientDto, profileImgUrl?: string): Promise<{
        email: string;
        password: string;
        lastName: string;
        firstName: string;
        age: number;
        id: string;
        role: import(".prisma/client").$Enums.UserRole;
        profileImg: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
