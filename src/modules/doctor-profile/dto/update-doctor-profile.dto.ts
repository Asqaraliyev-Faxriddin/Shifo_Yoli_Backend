import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class FindDoctorProfilesDto {
  @ApiPropertyOptional({ description: 'Foydalanuvchi emaili', example: 'doctor@example.com' })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional({ description: 'Ism bo‘yicha qidirish', example: 'Ali' })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional({ description: 'Familiya bo‘yicha qidirish', example: 'Valiyev' })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional({ description: 'Minimal yosh', example: 25 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minAge?: number;

  @ApiPropertyOptional({ description: 'Maksimal yosh', example: 50 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Max(120)
  maxAge?: number;

  @ApiPropertyOptional({ description: 'Kategoriya nomi', example: 'Cardiology' })
  @IsOptional()
  @IsString()
  categoryName?: string;

  @ApiPropertyOptional({ description: 'Sahifalash uchun limit', example: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 10;

  @ApiPropertyOptional({ description: 'Offset (qaysi sahifadan boshlash)', example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  offset?: number = 1;
}
