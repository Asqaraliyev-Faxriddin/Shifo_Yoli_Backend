import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
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
            id: string;
            role: import(".prisma/client").$Enums.UserRole;
            profileImg: string | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
        tokens: string | {
            AccessToken: string;
            RefreshToken: string;
        };
    }>;
    login(dto: LoginDto, req: any): Promise<{
        status: boolean;
        message: string;
        tokens: string | {
            AccessToken: string;
            RefreshToken: string;
        };
    }>;
    refresh(dto: RefreshTokenDto): Promise<{
        AccessToken: string | {
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
            id: string;
            role: import(".prisma/client").$Enums.UserRole;
            profileImg: string | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    googleAuth(): Promise<void>;
    googleAuthRedirect(req: any): Promise<{
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
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
        tokens: string | {
            AccessToken: string;
            RefreshToken: string;
        };
    }>;
}
