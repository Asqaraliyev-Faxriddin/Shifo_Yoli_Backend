import { AdminService } from "./admin.service";
import { CreateAdminDto, UpdateAdminDto, BlockUserDto, UnblockUserDto } from "./dto/create-admin.dto";
import { SearchUserDto } from "./dto/update-admin.dto";
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    private readonly imgbbApiKey;
    private readonly imgbbUploadUrl;
    private uploadToImgbb;
    create(dto: CreateAdminDto, file?: Express.Multer.File): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        password: string;
        age: number;
        role: import(".prisma/client").$Enums.UserRole;
        profileImg: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAllAdmins(dto: SearchUserDto): Promise<{
        data: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            age: number;
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
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            age: number;
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
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            age: number;
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
    findOne(id: string): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        password: string;
        age: number;
        role: import(".prisma/client").$Enums.UserRole;
        profileImg: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, dto: UpdateAdminDto, file?: Express.Multer.File): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        password: string;
        age: number;
        role: import(".prisma/client").$Enums.UserRole;
        profileImg: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        password: string;
        age: number;
        role: import(".prisma/client").$Enums.UserRole;
        profileImg: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    removeDoctor(id: string): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        password: string;
        age: number;
        role: import(".prisma/client").$Enums.UserRole;
        profileImg: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    removePatient(id: string): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        password: string;
        age: number;
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
        reason: string | null;
        userId: string;
    }>;
    unblockUser(dto: UnblockUserDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        reason: string | null;
        userId: string;
    }>;
}
