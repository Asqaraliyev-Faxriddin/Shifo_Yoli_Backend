export declare class SearchUserDto {
    firstName?: string;
    lastName?: string;
    email?: string;
    ageFrom?: number;
    ageTo?: number;
    limit: number;
    page: number;
}
export declare class UpdateProfileUserAdminDto {
    firstName?: string;
    lastName?: string;
    age?: number;
    month?: number;
    day?: number;
    phoneNumber?: string;
    profileImg?: any;
    password?: string;
    email?: string;
}
