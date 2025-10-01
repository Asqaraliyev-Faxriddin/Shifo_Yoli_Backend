// src/modules/doctor-profile/dto/create-doctor-profile.dto.ts

import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
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

export class CreateDoctorProfileDto {
  @ApiPropertyOptional({
    description: 'Doktorning bio (uz)',
    example: 'Men 10 yillik tajribaga ega shifokorman.',
  })
  @IsOptional()
  @IsNotEmpty()
  bio: string;

  @ApiPropertyOptional({
    description: 'Kunlik maosh (faqat bitta salary)',
    example: 150000,
  })
  @ValidateIf((o) => o.free === false || o.free === undefined) // free false bo‘lsa salary majburiy
  @IsNumber()
  dailySalary?: number;

  @ApiPropertyOptional({
    description: 'Doctor bepulmi?',
    example: false,
    default: false,
  })
  @ValidateIf((o) => o.dailySalary === undefined) 
  @IsBoolean()
  free?: boolean;

  @ApiProperty({
    description: 'DoctorCategory ID (kategoriya)',
    example: '7b6e3f0c-7c56-4e59-9c2c-123456789abc',
  })
  @IsUUID()
  categoryId: string;

  @ApiPropertyOptional({
    description: 'Rasmlar ro‘yxati (JSON array)',
    example: ['image1.png', 'image2.png'],
  })
  @IsOptional()
  @IsArray()
  images?: string[];

  @ApiPropertyOptional({
    description: 'Videolar ro‘yxati (JSON array)',
    example: ['video1.mp4', 'video2.mp4'],
  })
  @IsOptional()
  @IsArray()
  videos?: string[];
}




export class UpdateDoctorProfileDto {

  @ApiPropertyOptional({
    description: 'Doktorning bio (uz)',
    example: 'Men 10 yillik tajribaga ega shifokorman.',
  })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiPropertyOptional({
    description: 'Kunlik maosh (faqat bitta salary)',
    example: 150000,
  })
  @ValidateIf((o) => o.free === false || o.free === undefined) // free false bo‘lsa salary majburiy
  @IsNumber()
  dailySalary?: number;

  @ApiPropertyOptional({
    description: 'Doctor bepulmi?',
    example: false,
    default: false,
  })
  @ValidateIf((o) => o.dailySalary === undefined) 
  @IsBoolean()
  free?: boolean;

  @ApiPropertyOptional({
    description: 'DoctorCategory ID (kategoriya)',
    example: '7b6e3f0c-7c56-4e59-9c2c-123456789abc',
  })
  @IsUUID()
  categoryId?: string;

  @ApiPropertyOptional({
    description: 'Rasmlar ro‘yxati (JSON array)',
    example: ['image1.png', 'image2.png'],
  })
  @IsOptional()
  @IsArray()
  images?: string[];

  @ApiPropertyOptional({
    description: 'Videolar ro‘yxati (JSON array)',
    example: ['video1.mp4', 'video2.mp4'],
  })
  @IsOptional()
  @IsArray()
  videos?: string[];
}

export class AddVideoDto {
    @ApiProperty({
      description: 'Yangi qo‘shiladigan video fayl nomi yoki URL',
      example: 'video3.mp4',
    })
    @IsString()
    video: string;
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
    @IsString()
    image: string;
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
        @Type(() => Number) // query params string bo'lsa number ga o'tkazadi
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
    