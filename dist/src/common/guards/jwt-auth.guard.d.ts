import { CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { PrismaService } from 'src/core/prisma/prisma.service';
export declare class AuthGuard implements CanActivate {
    private jwtService;
    private prismaService;
    constructor(jwtService: JwtService, prismaService: PrismaService);
    canActivate(context: ExecutionContext): Promise<boolean>;
    TokenValidation(request: Request): string | undefined;
}
