import { OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
export declare class SeaderService implements OnModuleInit {
    private prisma;
    private loger;
    constructor(prisma: PrismaService);
    onModuleInit(): Promise<void>;
    CreateSuperadmin(): Promise<void>;
}
