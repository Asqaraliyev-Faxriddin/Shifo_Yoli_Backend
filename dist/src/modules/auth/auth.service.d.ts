import { JwtService } from '@nestjs/jwt';
import { Token_activate } from 'src/common/types/token';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { VerificationService } from '../verification/verification.service';
import { RefreshTokenDto } from './dto/refresh.token.dto';
import { Reset_Password } from './dto/reset-password';
export declare class AuthService {
    private prisma;
    private jwtServise;
    private verificationService;
    constructor(prisma: PrismaService, jwtServise: JwtService, verificationService: VerificationService);
    generateToken(payload: Token_activate, Token_status?: boolean): Promise<string | {
        AccessToken: string;
        RefreshToken: string;
    }>;
    register(payload: Required<RegisterDto>): Promise<{
        status: boolean;
        message: string;
        data: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            password: string;
            age: number;
            role: import(".prisma/client").$Enums.UserRole;
            profileImg: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
        Tokens: string | {
            AccessToken: string;
            RefreshToken: string;
        };
    }>;
    login(payload: LoginDto): Promise<string | {
        AccessToken: string;
        RefreshToken: string;
    }>;
    RefresholdAcces(token: RefreshTokenDto): Promise<{
        AccessToken: string | {
            AccessToken: string;
            RefreshToken: string;
        };
    }>;
    reset_password(payload: Required<Reset_Password>): Promise<{
        status: boolean;
        message: string;
        data: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            password: string;
            age: number;
            role: import(".prisma/client").$Enums.UserRole;
            profileImg: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    PhoneAndPasswordCheck(password: string, email: string): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        password: string;
        age: number;
        role: import(".prisma/client").$Enums.UserRole;
        profileImg: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    googleLogin(user: any): Promise<{
        status: boolean;
        message: string;
        data: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            password: string;
            age: number;
            role: import(".prisma/client").$Enums.UserRole;
            profileImg: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
        tokens: string | {
            AccessToken: string;
            RefreshToken: string;
        };
    }>;
}
