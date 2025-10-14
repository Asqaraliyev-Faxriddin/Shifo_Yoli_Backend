import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { GooglePass, LoginDto } from "./dto/login.dto";
import { RefreshTokenDto } from "./dto/refresh.token.dto";
import { Reset_Password } from "./dto/reset-password";
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto, req: any): Promise<{
        status: boolean;
        message: string;
        data: {
            email: string;
            password: string;
            lastName: string;
            firstName: string;
            age: number;
            month: number | null;
            day: number | null;
            id: string;
            phoneNumber: string | null;
            role: import(".prisma/client").$Enums.UserRole;
            profileImg: string | null;
            isActive: boolean;
            isOnline: boolean;
            lastSeen: Date | null;
            createdAt: Date;
            updatedAt: Date;
        };
        tokens: {
            AccessToken: string;
            RefreshToken?: undefined;
        } | {
            AccessToken: string;
            RefreshToken: string;
        };
    }>;
    login(dto: LoginDto, req: any): Promise<{
        status: boolean;
        message: string;
        tokens: {
            AccessToken: string;
            RefreshToken?: undefined;
        } | {
            AccessToken: string;
            RefreshToken: string;
        };
    }>;
    refresh(dto: RefreshTokenDto): Promise<{
        AccessToken: {
            AccessToken: string;
            RefreshToken?: undefined;
        } | {
            AccessToken: string;
            RefreshToken: string;
        };
    }>;
    resetPassword(dto: Reset_Password): Promise<{
        status: boolean;
        message: string;
        data: {
            email: string;
            password: string;
            lastName: string;
            firstName: string;
            age: number;
            month: number | null;
            day: number | null;
            id: string;
            phoneNumber: string | null;
            role: import(".prisma/client").$Enums.UserRole;
            profileImg: string | null;
            isActive: boolean;
            isOnline: boolean;
            lastSeen: Date | null;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    googleAuth(): Promise<void>;
    googleAuthRedirect(req: any, res: any): Promise<any>;
    githubAuth(): Promise<void>;
    googleCallback(req: any, res: any): Promise<any>;
    googlePassword(body: GooglePass, req: any): Promise<{
        status: boolean;
        message: string;
        data: {
            email: string;
            password: string;
            lastName: string;
            firstName: string;
            age: number;
            month: number | null;
            day: number | null;
            id: string;
            phoneNumber: string | null;
            role: import(".prisma/client").$Enums.UserRole;
            profileImg: string | null;
            isActive: boolean;
            isOnline: boolean;
            lastSeen: Date | null;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
}
