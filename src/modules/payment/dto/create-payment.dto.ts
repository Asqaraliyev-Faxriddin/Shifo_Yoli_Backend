import { IsOptional, IsString, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class SearchPaymentDto {
  @IsOptional()
  @IsString()
  firstName?: string; // User jadvalidan qidirish uchun

  @IsOptional()
  @IsString()
  email?: string; // User jadvalidan qidirish uchun

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  offset?: number = 0;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 10;
}
