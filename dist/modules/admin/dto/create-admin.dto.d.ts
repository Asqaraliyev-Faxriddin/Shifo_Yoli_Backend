export declare class BaseUserDto {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    age: number;
    profileImg?: Express.Multer.File;
}
export declare class CreateAdminDto {
    email: string;
    password: string;
    lastName: string;
    firstName: string;
    age: number;
    profileImg?: Express.Multer.File;
}
export declare class CreateDoctorDto {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    age: number;
    profileImg?: string;
    categoryId: string;
    bio: string;
    dailySalary: number;
    images?: string[] | null;
    videos?: string[] | null;
}
export declare class CreatePatientDto {
    email: string;
    password: string;
    lastName: string;
    firstName: string;
    age: number;
    profileImg?: Express.Multer.File;
}
export declare class UpdateUserDto {
    email?: string;
    password?: string;
    lastName?: string;
    firstName?: string;
    age?: number;
    profileImg?: Express.Multer.File;
    phoneNumber?: string;
    day?: number;
    month?: number;
}
export declare class DeleteUserDto {
    userId: string;
}
export declare class BlockUserDto {
    userId: string;
    reason?: string;
}
export declare class UnblockUserDto {
    userId: string;
}
export declare class SearchUserDto {
    firstName?: string;
    lastName?: string;
    email?: string;
    ageFrom?: number;
    ageTo?: number;
    categoryId?: string;
    limit: number;
    page: number;
}
export declare class SendNotificationDto {
    userId: string;
    message: string;
    title: string;
}
export declare class BroadcastNotificationDto {
    message: string;
    title: string;
}
export declare class UserPaymentDto {
    userId: string;
    amount: number;
}
export declare class MassPaymentDto {
    role: string;
    amount: number;
    message: string;
    title: string;
}
export declare class NotificationAll {
    role: string;
    message: string;
    title: string;
}
export declare class MassPaymentDto2 {
    role: string;
    amount: number;
    message: string;
    title: string;
}
export declare class BlockDeviceDto {
    deviceId: string;
    reason?: string;
}
export declare class BlokUnDevice {
    deviceId: string;
}
export declare class UserBlok {
    userId: string;
    reason?: string;
}
export declare class UserUnBlokDto {
    userId: string;
}
