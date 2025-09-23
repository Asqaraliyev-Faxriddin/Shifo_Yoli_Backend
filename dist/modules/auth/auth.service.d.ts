import { JwtService } from "@nestjs/jwt";
import { Token_activate } from "src/common/types/token";
import { PrismaService } from "src/core/prisma/prisma.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { VerificationService } from "../verification/verification.service";
import { RefreshTokenDto } from "./dto/refresh.token.dto";
import { Reset_Password } from "./dto/reset-password";
import { Request } from "express";
export declare class AuthService {
    private prisma;
    private jwtServise;
    private verificationService;
    constructor(prisma: PrismaService, jwtServise: JwtService, verificationService: VerificationService);
    generateToken(payload: Token_activate, onlyAccess?: boolean): Promise<string | {
        AccessToken: string;
        RefreshToken: string;
    }>;
    register(payload: Required<RegisterDto>, req: Request): Promise<{
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
    login(payload: LoginDto, req: Request): Promise<{
        status: boolean;
        message: string;
        tokens: string | {
            AccessToken: string;
            RefreshToken: string;
        };
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
    googleLogin(user: any, req: Request): Promise<{
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
    PhoneAndPasswordCheck(password: string, email: string): Promise<{
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
    }>;
    private saveDevice;
    private detectPlatform;
}
