import { PrismaService } from "src/core/prisma/prisma.service";
import { CreateReviewDto, UpdateReviewDto } from "./dto/create-rating.dto";
export declare class ReviewService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(userId: string, dto: CreateReviewDto): Promise<{
        id: string;
        rating: number;
        comment: string | null;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        doctorId: string;
    }>;
    findAllByDoctor(doctorId: string, offset?: number, limit?: number): Promise<{
        total: number;
        offset: number;
        limit: number;
        items: ({
            user: {
                id: string;
                firstName: string;
                lastName: string;
            };
        } & {
            id: string;
            rating: number;
            comment: string | null;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            doctorId: string;
        })[];
    }>;
    getAnalytics(doctorId: string): Promise<{
        average: number;
        total: number;
        distribution: {};
        top10: never[];
        best: null;
        worst: null;
    } | {
        average: number;
        total: number;
        distribution: Record<number, number>;
        top10: ({
            user: {
                id: string;
                firstName: string;
                lastName: string;
            };
        } & {
            id: string;
            rating: number;
            comment: string | null;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            doctorId: string;
        })[];
        best: {
            user: {
                id: string;
                firstName: string;
                lastName: string;
            };
        } & {
            id: string;
            rating: number;
            comment: string | null;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            doctorId: string;
        };
        worst: {
            user: {
                id: string;
                firstName: string;
                lastName: string;
            };
        } & {
            id: string;
            rating: number;
            comment: string | null;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            doctorId: string;
        };
    }>;
    update(userId: string, reviewId: string, dto: UpdateReviewDto): Promise<{
        id: string;
        rating: number;
        comment: string | null;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        doctorId: string;
    }>;
    remove(userId: string, reviewId: string): Promise<{
        id: string;
        rating: number;
        comment: string | null;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        doctorId: string;
    }>;
}
