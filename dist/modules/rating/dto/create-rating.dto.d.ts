export declare class CreateReviewDto {
    doctorId: string;
    rating: number;
    comment?: string;
}
declare const UpdateReviewDto_base: import("@nestjs/common").Type<Partial<CreateReviewDto>>;
export declare class UpdateReviewDto extends UpdateReviewDto_base {
}
export declare class ReviewResponseDto {
    id: string;
    userId: string;
    doctorId: string;
    rating: number;
    comment?: string;
    createdAt: Date;
    updatedAt: Date;
}
export {};
