import { PrismaService } from 'src/core/prisma/prisma.service';
import { Search22PaymentDto, SearchPaymentDto } from './dto/create-payment.dto';
export declare class PaymentService {
    private prisma;
    constructor(prisma: PrismaService);
    searchPayments(dto: SearchPaymentDto): Promise<{
        total: number;
        count: number;
        data: ({
            wallet: {
                user: {
                    wallet: {
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        balance: import("@prisma/client/runtime/library").Decimal;
                        userId: string;
                    } | null;
                    email: string;
                    lastName: string;
                    firstName: string;
                    id: string;
                    phoneNumber: string | null;
                    role: import(".prisma/client").$Enums.UserRole;
                    createdAt: Date;
                    updatedAt: Date;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                balance: import("@prisma/client/runtime/library").Decimal;
                userId: string;
            };
        } & {
            type: import(".prisma/client").$Enums.TransactionType;
            id: string;
            createdAt: Date;
            amount: import("@prisma/client/runtime/library").Decimal;
            source: import(".prisma/client").$Enums.PaymentType | null;
            meta: import("@prisma/client/runtime/library").JsonValue | null;
            walletId: string;
        })[];
    }>;
    oldPayment(dto: Search22PaymentDto, userId: string): Promise<{
        success: boolean;
        message: string;
        total: number;
        count: number;
        data: ({
            wallet: {
                user: {
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
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                balance: import("@prisma/client/runtime/library").Decimal;
                userId: string;
            };
        } & {
            type: import(".prisma/client").$Enums.TransactionType;
            id: string;
            createdAt: Date;
            amount: import("@prisma/client/runtime/library").Decimal;
            source: import(".prisma/client").$Enums.PaymentType | null;
            meta: import("@prisma/client/runtime/library").JsonValue | null;
            walletId: string;
        })[];
    }>;
}
