import { DoctorProfileService } from './doctor-profile.service';
import { CreateDoctorProfileDto, UpdateDoctorProfileDto, RemoveImageDto, RemoveVideoDto } from './dto/create-doctor-profile.dto';
import { FindDoctorProfilesDto } from './dto/update-doctor-profile.dto';
export declare class DoctorProfileController {
    private readonly doctorProfileService;
    constructor(doctorProfileService: DoctorProfileService);
    private static imageFileFilter;
    private static videoFileFilter;
    createProfile(userId: string, dto: CreateDoctorProfileDto, files: {
        images?: Express.Multer.File[];
        videos?: Express.Multer.File[];
    }): Promise<{
        success: boolean;
        message: string;
    }>;
    updateProfile(id: string, dto: UpdateDoctorProfileDto, files: {
        images?: Express.Multer.File[];
        videos?: Express.Multer.File[];
        files?: Express.Multer.File[];
    }): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    createProfileDoctor(req: any, dto: CreateDoctorProfileDto, files: {
        images?: Express.Multer.File[];
        videos?: Express.Multer.File[];
    }): Promise<{
        success: boolean;
        message: string;
    }>;
    updateProfileDoctor(req: any, dto: UpdateDoctorProfileDto, files: {
        images?: Express.Multer.File[];
        videos?: Express.Multer.File[];
        files?: Express.Multer.File[];
    }): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    addImage(id: string, file?: Express.Multer.File): Promise<{
        success: boolean;
        message: string;
    }>;
    addVideo(id: string, file?: Express.Multer.File): Promise<{
        success: boolean;
        message: string;
    }>;
    removeImage(id: string, dto: RemoveImageDto): Promise<{
        success: boolean;
        message: string;
    }>;
    removeVideo(id: string, dto: RemoveVideoDto): Promise<{
        success: boolean;
        message: string;
    }>;
    DoctorProfiles(query: FindDoctorProfilesDto): Promise<{
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
