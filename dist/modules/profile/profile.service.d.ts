import { PrismaService } from 'src/core/prisma/prisma.service';
import { PhoneUpdateDto, UpdatePasswordDto, UpdateProfileDto } from './dto/profile.dto';
import { VerificationService } from '../verification/verification.service';
export declare class ProfileService {
    private prisma;
    private verificationService;
    constructor(prisma: PrismaService, verificationService: VerificationService);
    myProfile(id: string): Promise<{
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
    deleteProfile(id: string): Promise<{
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
    updateProfile(userId: string, dto: UpdateProfileDto, fileName?: string): Promise<{
        profileImg: string | null;
        email: string;
        password: string;
        lastName: string;
        firstName: string;
        age: number;
        id: string;
        role: import(".prisma/client").$Enums.UserRole;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updatePhone(userId: string, payload: PhoneUpdateDto): Promise<{
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
    updatePassword(userId: string, payload: UpdatePasswordDto): Promise<{
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
}
