import { 
  ApiProperty, 
  ApiPropertyOptional 
} from "@nestjs/swagger";
import { 
  IsEmail, 
  IsOptional, 
  IsString, 
  IsInt, 
  Min, 
  Max, 
  IsUUID, 
  IsNumber, 
  IsNotEmpty
} from "class-validator";
import { Transform, Type } from "class-transformer";
import { Express } from "express";


// ==================== BASE DTO ====================
export class BaseUserDto {
  @ApiProperty({ description: "Foydalanuvchi email manzili", example: "user@example.com" })
  @IsEmail()
  email: string;

  @ApiProperty({ description: "Foydalanuvchi ismi", example: "Ali" })
  @IsString()
  @Type(() => String)
  firstName: string;

  @ApiProperty({ description: "Foydalanuvchi familiyasi", example: "Valiyev" })
  @IsString()
  lastName: string;

  @ApiProperty({ description: "Parol", example: "StrongPass123" })
  @IsString()
  password: string;

  @ApiProperty({ description: "Yoshi", example: 25, minimum: 1, maximum: 170 })
  @IsInt()
  @Min(1)
  @Max(170)
  @Type(() => Number)
  age: number;

  @ApiProperty({ type: "string", format: "binary", required: false, description: "Profil rasmi" })
  @IsOptional()
  profileImg?: Express.Multer.File;
}


// ==================== CREATE DTO ====================
export class CreateAdminDto extends BaseUserDto {}

export class CreateDoctorDto extends BaseUserDto {
  @ApiProperty({ description: "Kategoriya ID", example: "uuid-category" })
  @IsUUID()
  categoryId: string;

  @ApiProperty({ description: "Doktor biografiyasi", example: "10 yillik tajribaga ega shifokor" })
  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  bio: string;

  @ApiProperty({ description: "Kunlik maosh", example: 100000 })
  @IsNumber()
  dailySalary: number;

  @ApiProperty({ type: "array", items: { type: "string", format: "binary" }, required: false, description: "Doktor rasmlari" })
  @IsOptional()
  images?: Express.Multer.File[];

  @ApiProperty({ type: "array", items: { type: "string", format: "binary" }, required: false, description: "Doktor videolari" })
  @IsOptional()
  videos?: Express.Multer.File[];
}

export class CreatePatientDto extends BaseUserDto {}


// ==================== UPDATE DTO ====================
export class UpdateUserDto {
  @ApiPropertyOptional({ description: "Ism" })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional({ description: "Familiya" })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional({ description: "Parol" })
  @IsOptional()
  @IsString()
  password?: string;

  @ApiPropertyOptional({ description: "Yoshi" })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(170)
  age?: number;

  @ApiProperty({ type: "string", format: "binary", required: false, description: "Profil rasmi" })
  @IsOptional()
  profileImg?: Express.Multer.File;
}


// ==================== DELETE DTO ====================
export class DeleteUserDto {
  @ApiProperty({ description: "O‘chiriladigan user ID" })
  @IsUUID()
  userId: string;
}


// ==================== BLOCK / UNBLOCK ====================
export class BlockUserDto {
  @ApiProperty({ description: "Block qilinadigan user ID" })
  @IsUUID()
  userId: string;

  @ApiPropertyOptional({ description: "Block sababi", example: "Qoidabuzarlik" })
  @IsOptional()
  @IsString()
  reason?: string;
}

export class UnblockUserDto {
  @ApiProperty({ description: "Unblock qilinadigan user ID" })
  @IsUUID()
  userId: string;
}


export class SearchUserDto {
  @ApiPropertyOptional({ description: "Ism bo‘yicha qidirish", example: "Ali" })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional({ description: "Familiya bo‘yicha qidirish", example: "Valiyev" })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional({ description: "Email bo‘yicha qidirish", example: "user@example.com" })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional({ description: "Minimal yosh filteri", example: 18 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  ageFrom?: number;

  @ApiPropertyOptional({ description: "Maksimal yosh filteri", example: 65 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  ageTo?: number;

  @ApiPropertyOptional({ description: "Kategoriya ID bo‘yicha qidirish (faqat doktorlar uchun)", example: "uuid-category" })
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @ApiPropertyOptional({ description: "Limit", example: 10, default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 10;

  @ApiPropertyOptional({ description: "Sahifa raqami", example: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;
}

export class SendNotificationDto {
  @ApiProperty({ example: "uuid-user" })
  @IsUUID()
  userId: string;

  @ApiProperty({ example: "Xabar matni" })
  @IsString()
  message: string;

  @ApiProperty({ example: "Xabar matni" })
  @IsString()
  title: string;
}

export class BroadcastNotificationDto {
  @ApiProperty({ example: "Umumiy xabar matni" })
  @IsString()
  message: string;

  @ApiProperty({ example: "Umumiy xabar sarlavhasi" })
  @IsString()
  title: string;
}


export class UserPaymentDto {
  @ApiProperty({ description: "User ID", example: "uuid-user" })
  @IsUUID()
  userId: string;

  @ApiProperty({ description: "Miqdor", example: 10000 })
  @IsNumber()
  amount: number;
}

export class MassPaymentDto {
  @ApiProperty({ enum: ["BEMOR", "DOCTOR", "ADMIN"], example: "DOCTOR" })
  @IsString()
  role: string;

  @ApiProperty({ example: 50000 })
  @IsNumber()
  amount: number;


  @ApiProperty({ example: "Umumiy xabar matni" })
  @IsString()
  message: string;

  @ApiProperty({ example: "Umumiy xabar sarlavhasi" })
  @IsString()
  title: string;
}

export class MassPaymentDto2 {
  @ApiProperty({ enum: ["BEMOR", "DOCTOR", "ADMIN"], example: "DOCTOR" })
  @IsString()
  role: string;

  @ApiProperty({ example: -50000, description: "Foydalanuvchi hisobidan ayriladigan pul (manfiy son)" })
  @IsNumber({}, { message: "Amount faqat son bo'lishi kerak" })
  @Min(-Infinity, { message: "Amount manfiy bo'lishi kerak" }) // faqat manfiy son
  @Transform(({ value }) => Number(value))
  amount: number;


  @ApiProperty({ example: "Umumiy xabar matni" })
  @IsString()
  message: string;

  @ApiProperty({ example: "Umumiy xabar sarlavhasi" })
  @IsString()
  title: string;
}



export class BlockDeviceDto {
  @ApiProperty({ description: "Device ID", example: "uuid-device" })
  @IsUUID()
  deviceId: string;

  @ApiPropertyOptional({ description: "Block sababi", example: "Qoidabuzarlik" })
  @IsOptional()
  @IsString()
  reason?: string;

}

export class BlokUnDevice {
  @ApiProperty({ description: "Device ID", example: "uuid-device" })
  @IsUUID()
  deviceId: string;

}

export class UserBlok {

  @ApiProperty({ description: "User ID", example: "uuid-user" })
  @IsUUID()
  userId: string;

  @ApiPropertyOptional({ description: "Block sababi", example: "Qoidabuzarlik" })
  @IsOptional()
  @IsString()
  reason?: string;
}


export class UserUnBlokDto {


  @ApiProperty({ description: "User ID", example: "uuid-user" })
  @IsUUID()
  userId: string;
}