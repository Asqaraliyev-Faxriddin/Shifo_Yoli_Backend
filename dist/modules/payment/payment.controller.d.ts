import { PaymentService } from './payment.service';
import { Search22PaymentDto, SearchPaymentDto } from './dto/create-payment.dto';
import { PaymentDocktorBemorDto, PaymentDocktorChanegeDto } from './dto/update-payment.dto';
export declare class PaymentController {
    private readonly paymentService;
    constructor(paymentService: PaymentService);
    searchPayments(query: SearchPaymentDto): Promise<{
        total: number;
        count: number;
        data: ({
            wallet: {
                user: {
                    id: string;
                    createdAt: Date;
                    wallet: {
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        userId: string;
                        balance: import("@prisma/client/runtime/library").Decimal;
                    } | null;
                    email: string;
                    firstName: string;
                    lastName: string;
                    phoneNumber: string | null;
                    role: import(".prisma/client").$Enums.UserRole;
                    updatedAt: Date;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                balance: import("@prisma/client/runtime/library").Decimal;
            };
        } & {
            id: string;
            walletId: string;
            type: import(".prisma/client").$Enums.TransactionType;
            amount: import("@prisma/client/runtime/library").Decimal;
            source: import(".prisma/client").$Enums.PaymentType | null;
            meta: import("@prisma/client/runtime/library").JsonValue | null;
            createdAt: Date;
        })[];
    }>;
    userPayment(req: any, query: Search22PaymentDto): Promise<{
        success: boolean;
        message: string;
        total: number;
        count: number;
        data: ({
            wallet: {
                user: {
                    id: string;
                    createdAt: Date;
                    email: string;
                    firstName: string;
                    lastName: string;
                    password: string;
                    age: number;
                    month: number | null;
                    day: number | null;
                    phoneNumber: string | null;
                    role: import(".prisma/client").$Enums.UserRole;
                    profileImg: string | null;
                    isActive: boolean;
                    isOnline: boolean;
                    lastSeen: Date | null;
                    updatedAt: Date;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                balance: import("@prisma/client/runtime/library").Decimal;
            };
        } & {
            id: string;
            walletId: string;
            type: import(".prisma/client").$Enums.TransactionType;
            amount: import("@prisma/client/runtime/library").Decimal;
            source: import(".prisma/client").$Enums.PaymentType | null;
            meta: import("@prisma/client/runtime/library").JsonValue | null;
            createdAt: Date;
        })[];
    }>;
    TolovPayment(req: any, query: PaymentDocktorBemorDto): Promise<{
        message: string;
    }>;
    ChangePayment(req: any, query: PaymentDocktorChanegeDto): Promise<{
        message: string;
    }>;
}
