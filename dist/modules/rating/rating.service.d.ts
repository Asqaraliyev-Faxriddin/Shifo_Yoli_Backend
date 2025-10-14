import { PrismaService } from "src/core/prisma/prisma.service";
import { CreateReviewDto, UpdateReviewDto } from "./dto/create-rating.dto";
export declare class ReviewService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(userId: string, dto: CreateReviewDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        doctorId: string;
        rating: number;
        comment: string | null;
    }>;
    findAllByDoctor(doctorId: string, offset?: number, limit?: number): Promise<{
        total: number;
        offset: number;
        limit: number;
        items: ({
            user: {
                lastName: string;
                firstName: string;
                id: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            doctorId: string;
            rating: number;
            comment: string | null;
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
                lastName: string;
                firstName: string;
                id: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            doctorId: string;
            rating: number;
            comment: string | null;
        })[];
        best: {
            user: {
                lastName: string;
                firstName: string;
                id: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            doctorId: string;
            rating: number;
            comment: string | null;
        };
        worst: {
            user: {
                lastName: string;
                firstName: string;
                id: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            doctorId: string;
            rating: number;
            comment: string | null;
        };
    }>;
    update(userId: string, reviewId: string, dto: UpdateReviewDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        doctorId: string;
        rating: number;
        comment: string | null;
    }>;
    remove(userId: string, reviewId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        doctorId: string;
        rating: number;
        comment: string | null;
    }>;
}
