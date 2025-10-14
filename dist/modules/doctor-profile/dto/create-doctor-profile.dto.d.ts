export declare class CreateDoctorProfileDto {
    bio: string;
    dailySalary?: number;
    free?: boolean;
    categoryId: string;
    images?: any;
    videos?: any;
    futures?: string[];
}
export declare class UpdateDoctorProfileDto {
    bio?: string;
    dailySalary?: number;
    free?: boolean;
    categoryId?: string;
    images?: any;
    videos?: any;
    files?: any;
    futures?: string[];
}
export declare class AddVideoDto {
    video?: any;
}
export declare class RemoveVideoDto {
    video: string;
}
export declare class AddImageDto {
    image?: any;
}
export declare class RemoveImageDto {
    image: string;
}
export declare class DoctorProfileDto {
    name?: string;
    limit: number;
    offset: number;
    doctorId?: string;
    firstName?: string;
    lastName?: string;
}
