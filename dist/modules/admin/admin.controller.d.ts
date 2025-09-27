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
    findOne(id: string): Promise<{
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
    update(id: string, dto: UpdateAdminDto, file?: Express.Multer.File): Promise<{
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
    remove(id: string): Promise<{
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
    removeDoctor(id: string): Promise<{
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
    removePatient(id: string): Promise<{
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
        deviceId: string | null;
        reason: string | null;
    }>;
    unblockUser(dto: UnblockUserDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        deviceId: string | null;
        reason: string | null;
    }>;
    nimadir(): Promise<{
        data: ({
            user: {
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
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string | null;
            userId: string;
            deviceType: import(".prisma/client").$Enums.DeviceType;
            deviceId: string;
            platform: string | null;
            address: string | null;
        })[];
        total: number;
    }>;
}
