import { PrismaService } from 'src/core/prisma/prisma.service';
import { CreateDoctorProfileDto, UpdateDoctorProfileDto, AddImageDto, RemoveImageDto, AddVideoDto, RemoveVideoDto } from './dto/create-doctor-profile.dto';
import { AppMailerService } from 'src/common/mailer/mailer.service';
import { FindDoctorProfilesDto } from './dto/update-doctor-profile.dto';
export declare class DoctorProfileService {
    private readonly prisma;
    private readonly mailerService;
    constructor(prisma: PrismaService, mailerService: AppMailerService);
    private parseBoolean;
    private deleteFileFromUploads;
    create(userId: string, dto: CreateDoctorProfileDto, images?: string[], videos?: string[]): Promise<{
        success: boolean;
        message: string;
    }>;
    update(id: string, dto: UpdateDoctorProfileDto, images?: string[], videos?: string[], files?: string[]): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    remove(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    addImage(id: string, dto: AddImageDto): Promise<{
        success: boolean;
        message: string;
    }>;
    removeImage(id: string, dto: RemoveImageDto): Promise<{
        success: boolean;
        message: string;
    }>;
    addVideo(id: string, dto: AddVideoDto): Promise<{
        success: boolean;
        message: string;
    }>;
    removeVideo(id: string, dto: RemoveVideoDto): Promise<{
        success: boolean;
        message: string;
    }>;
    doctorProfile(id: string): Promise<{
        success: boolean;
        message: string;
        data: {
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
        };
    }>;
    DoctorProfiles(payload: FindDoctorProfilesDto): Promise<{
        success: boolean;
        message: string;
        total: number;
        page: number;
        limit: number;
        data: ({
            doctor: {
                email: string;
                lastName: string;
                firstName: string;
                age: number;
                id: string;
                phoneNumber: string | null;
                role: import(".prisma/client").$Enums.UserRole;
                profileImg: string | null;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
            };
            category: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                img: string | null;
            };
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
        })[];
    }>;
}
