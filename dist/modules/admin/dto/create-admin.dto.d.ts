export declare class BaseUserDto {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    age: number;
    profileImg?: Express.Multer.File;
}
export declare class CreateAdminDto extends BaseUserDto {
}
export declare class CreateDoctorDto extends BaseUserDto {
}
export declare class CreateBemorDto extends BaseUserDto {
}
export declare class UpdateAdminDto {
    firstName?: string;
    lastName?: string;
    password?: string;
    age?: number;
    profileImg?: Express.Multer.File;
}
export declare class UpdateDoctorDto extends UpdateAdminDto {
}
export declare class UpdateBemorDto extends UpdateAdminDto {
}
export declare class BlockUserDto {
    userId: string;
    reason?: string;
}
export declare class UnblockUserDto {
    userId: string;
}
