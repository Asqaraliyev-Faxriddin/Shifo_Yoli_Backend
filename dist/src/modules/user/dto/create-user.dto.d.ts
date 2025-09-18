export declare enum UserType {
    BUY = "BUY",
    SELL = "SELL",
    ADMIN = "ADMIN"
}
export declare class CreateAdminDto {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    profileImg?: Express.Multer.File;
}
export declare class CreateSellerDto {
    firstName: string;
    lastName: string;
    email: string;
    password: any;
    profileImg?: Express.Multer.File;
}
export declare class CreateBuyerDto {
    firstName: string;
    lastName: string;
    email: string;
    password: any;
    profileImg?: Express.Multer.File;
}
export declare class UpdateUserDto {
    userId: string;
    firstName?: string;
    lastName?: string;
    role?: UserType;
    email?: string;
    profileImg?: any;
    password?: string;
}
export declare class UpdateSellerPortfolioDto {
    userId: string;
    email?: string;
    profileImg?: string;
}
