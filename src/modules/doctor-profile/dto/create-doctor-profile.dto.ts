// src/modules/doctor-profile/dto/create-doctor-profile.dto.ts

import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsBoolean,
  IsNumber,
  IsArray,
  IsUUID,
  ValidateIf,
  IsNotEmpty,
  Length,
  IsInt,
  Min,
} from 'class-validator';


// ================= CREATE DOCTOR PROFILE =================
export class CreateDoctorProfileDto {
  @ApiPropertyOptional({
    description: 'Doktorning bio (uz)',
    example: 'Men 10 yillik tajribaga ega shifokorman.',
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  bio: string;

  @ApiPropertyOptional({
    description: 'Kunlik maosh (faqat bitta salary)',
    example: 150000,
  })
  @ValidateIf((o) => o.free === false || o.free === undefined)
  @Type(() => Number)
  @IsNumber()
  dailySalary?: number;

  @ApiPropertyOptional({
    description: 'Doctor bepulmi?',
    example: false,
    default: false,
  })
  @ValidateIf((o) => o.dailySalary === undefined)
  @IsBoolean()
  @IsOptional()
  free?: boolean;

  @ApiProperty({
    description: 'DoctorCategory ID (kategoriya)',
    example: '7b6e3f0c-7c56-4e59-9c2c-123456789abc',
  })
  @IsUUID()
  categoryId!: string;

  // Fayllar (multipart/form-data) — Swagger uchun array of binary
  @ApiPropertyOptional({
    description: 'Rasmlar (multipart/form-data file array)',
    type: 'array',
    items: { type: 'string', format: 'binary' },
  })
  @IsOptional()
  images?: any;
  
  @ApiPropertyOptional({
    description: 'Videolar (multipart/form-data file array)',
    type: 'array',
    items: { type: 'string', format: 'binary' },
  })
  @IsOptional()
  videos?: any;
  
  // futures: string array
  @ApiPropertyOptional({
    description: "Shifokorning kelajakdagi imkoniyatlari yoki qo‘shimcha malakalari",
    example: ['Nevrologiya bo‘yicha kurs', 'Yuqori toifadagi sertifikat'],
    isArray: true,
    type: String,
  })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.split(',').map(v => v.trim()) : value
  )
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  futures?: string[];
  
}

// ================= UPDATE DOCTOR PROFILE =================
export class UpdateDoctorProfileDto {
  @ApiPropertyOptional({
    description: 'Doktorning bio (uz)',
    example: 'Men 10 yillik tajribaga ega shifokorman.',
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  bio?: string;

  @ApiPropertyOptional({
    description: 'Kunlik maosh (faqat bitta salary)',
    example: 150000,
  })
  @IsOptional()
  @ValidateIf((o) => o.free === false || o.free === undefined)
  @Type(() => Number)
  @IsNumber()
  dailySalary?: number;

  @ApiPropertyOptional({
    description: 'Doctor bepulmi?',
    example: false,
    default: false,
  })
  @IsOptional()
  @ValidateIf((o) => o.dailySalary === undefined)
  @IsBoolean()
  free?: boolean;

  @ApiPropertyOptional({
    description: 'DoctorCategory ID (kategoriya)',
    example: '7b6e3f0c-7c56-4e59-9c2c-123456789abc',
  })
  @IsOptional()
  @ValidateIf((o) => o.categoryId !== '')
  @IsString()
  @Length(36, 36)
  @IsUUID()
  categoryId?: string;

  @ApiPropertyOptional({
    description: 'Rasmlar (multipart/form-data file array)',
    type: 'array',
    items: { type: 'string', format: 'binary' },
  })
  @IsOptional()
  images?: any;

  @ApiPropertyOptional({
    description: 'Videolar (multipart/form-data file array)',
    type: 'array',
    items: { type: 'string', format: 'binary' },
  })
  @IsOptional()
  videos?: any;
  
  @ApiPropertyOptional({
    description: "Shifokorning kelajakdagi imkoniyatlari yoki qo‘shimcha malakalari",
    example: ['Nevrologiya bo‘yicha kurs', 'Yuqori toifadagi sertifikat'],
    isArray: true,
    type: String,
  })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.split(',').map(v => v.trim()) : value
  )
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  futures?: string[];
  
  
}

export class AddVideoDto {
    @ApiProperty({
      description: 'Yangi qo‘shiladigan video fayl nomi yoki URL',
      example: 'video3.mp4',
    })
    video?: any;
  }

  export class RemoveVideoDto {
    @ApiProperty({
      description: 'O‘chiriladigan video fayl nomi yoki URL',
      example: 'video1.mp4',
    })
    @IsString()
    video: string;
  }

export class AddImageDto {
    @ApiProperty({
      description: 'Yangi qo‘shiladigan rasm fayl nomi yoki URL',
      example: 'image3.png',
    })
    image?: any;
  }

    export class RemoveImageDto {
        @ApiProperty({
        description: 'O‘chiriladigan rasm fayl nomi yoki URL',
        example: 'image1.png',
        })
        @IsString()
        image: string;
    }






    export class DoctorProfileDto {

        @ApiPropertyOptional({ description: "Kategoriya nomi bo'yicha filter" })
        @IsString()
        @IsNotEmpty()
        @Length(3,50)
        @IsOptional()
        name?: string;
    
        @ApiPropertyOptional({ description: "Sahifa bo'yicha limit", example: 10 })
        @IsInt()
        @Min(1)
        @Type(() => Number) 
        limit: number;
    
        @ApiPropertyOptional({ description: "Sahifa bo'yicha offset", example: 0 })
        @IsInt()
        @Min(0)
        @Type(() => Number)
        offset: number;
    
        @ApiPropertyOptional({ description: "Shifokor ID bo'yicha filter" })
        @IsString()
        @IsOptional()
        doctorId?: string;


        @ApiPropertyOptional()
        @IsString()
        @IsOptional()
        firstName?:string

        @ApiPropertyOptional()
        @IsString()
        @IsOptional()
        lastName?:string
    }
    