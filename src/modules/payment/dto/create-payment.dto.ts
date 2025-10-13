import { IsOptional, IsString, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class SearchPaymentDto {
  @IsOptional()
  @IsString()
  firstName?: string; // User jadvalidan qidirish uchun

  @IsOptional()
  @IsString()
  email?: string; // User jadvalidan qidirish uchun

  
  @ApiProperty({ required: false })
  @IsOptional()
  startDate?: Date; // Boshlanish sanasi

  
  @ApiProperty({ required: false })
  @IsOptional()
  endDate?: Date; // Tugash sanasi

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


export class Search22PaymentDto {

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

  @ApiProperty({ required: false })
  @IsOptional()
  startDate?: Date; // Boshlanish sanasi

  
  @ApiProperty({ required: false })
  @IsOptional()
  endDate?: Date; // Tugash sanasi
}
