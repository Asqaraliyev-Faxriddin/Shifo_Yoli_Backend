// dto/create-review.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, IsInt, Min, Max, IsOptional, IsString } from 'class-validator';

export class CreateReviewDto {

  @ApiProperty({ description: 'Baholanayotgan shifokor foydalanuvchi IDsi' })
  @IsUUID()
  doctorId: string;

  @ApiProperty({ description: '1 dan 5 gacha baho' })
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiPropertyOptional({ description: 'Qo‘shimcha izoh' })
  @IsOptional()
  @IsString()
  comment?: string;
}


