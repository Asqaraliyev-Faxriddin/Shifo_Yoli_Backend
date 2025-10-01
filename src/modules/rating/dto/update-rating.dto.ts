// dto/update-review.dto.ts
import { PartialType } from '@nestjs/swagger';
import { CreateReviewDto } from './create-rating.dto';

export class UpdateReviewDto extends PartialType(CreateReviewDto) {}
