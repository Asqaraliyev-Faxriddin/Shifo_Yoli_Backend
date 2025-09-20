import { PhoneUpdateDto, UpdatePasswordDto, UpdateProfileDto } from './dto/profile.dto';
import { ProfileService } from './profile.service';
import { PrismaService } from 'src/core/prisma/prisma.service';
export declare class ProfileController {
    private profileService;
    private prisma;
    constructor(profileService: ProfileService, prisma: PrismaService);
    updateProfile(req: any, dto: UpdateProfileDto, file?: Express.Multer.File): Promise<{
        email: string;
        password: string;
        lastName: string;
        firstName: string;
        age: number;
        id: string;
        role: import(".prisma/client").$Enums.UserRole;
        profileImg: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updatePhone(req: Request, body: PhoneUpdateDto): Promise<{
        status: boolean;
        message: string;
        data: {
            email: string;
            password: string;
            lastName: string;
            firstName: string;
            age: number;
            id: string;
            role: import(".prisma/client").$Enums.UserRole;
            profileImg: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    updatePassword(req: Request, payload: UpdatePasswordDto): Promise<{
        message: string;
        user: {
            email: string;
            password: string;
            lastName: string;
            firstName: string;
            age: number;
            id: string;
            role: import(".prisma/client").$Enums.UserRole;
            profileImg: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    getProfile(req: Request): Promise<{
        succase: boolean;
        message: string;
        data: {
            email: string;
            lastName: string;
            firstName: string;
            id: string;
            role: import(".prisma/client").$Enums.UserRole;
            profileImg: string | null;
        };
    }>;
    deleteProfile(req: Request): Promise<{
        succase: boolean;
        message: string;
        data: {
            email: string;
            password: string;
            lastName: string;
            firstName: string;
            age: number;
            id: string;
            role: import(".prisma/client").$Enums.UserRole;
            profileImg: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
}
