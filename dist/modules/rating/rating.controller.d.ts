import { ReviewService } from "./rating.service";
import { CreateReviewDto, UpdateReviewDto } from "./dto/create-rating.dto";
export declare class ReviewController {
    private readonly reviewService;
    constructor(reviewService: ReviewService);
    create(req: any, dto: CreateReviewDto): Promise<{
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
    update(req: any, id: string, dto: UpdateReviewDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        doctorId: string;
        rating: number;
        comment: string | null;
    }>;
    remove(req: any, id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        doctorId: string;
        rating: number;
        comment: string | null;
    }>;
}
