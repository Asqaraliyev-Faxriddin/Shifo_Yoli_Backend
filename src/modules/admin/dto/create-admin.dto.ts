import { ApiProperty } from "@nestjs/swagger";
import { 
  IsEmail, 
  IsOptional, 
  IsString, 
  IsInt, 
  Min, 
  Max, 
  IsUUID, 
  IsNotEmpty,
  IsNumber
} from "class-validator";

export class BaseUserDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsString()
  password: string;

  @ApiProperty()
  @IsInt()
  @Min(1)
  @Max(170)
  age: number;

  @ApiProperty({
    type: "string",
    format: "binary",
    required: false,
    description: "Profil rasmi (fayl sifatida yuboriladi)",
  })
  @IsOptional()
  profileImg?: Express.Multer.File;
}

export class CreateAdminDto extends BaseUserDto {}
export class CreateBemorDto extends BaseUserDto {}

export class UpdateAdminDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  password?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(120)
  age?: number;

  @ApiProperty({
    type: "string",
    format: "binary",
    required: false,
    description: "Profil rasmi (fayl sifatida yuboriladi)",
  })
  @IsOptional()
  profileImg?: Express.Multer.File;
}

export class UpdateDoctorDto extends UpdateAdminDto {}
export class UpdateBemorDto extends UpdateAdminDto {}

export class BlockUserDto {
  @ApiProperty({ description: "Block qilinadigan user ID (UUID)" })
  @IsUUID()
  userId: string;

  @ApiProperty({ required: false, description: "Block sababi" })
  @IsOptional()
  @IsString()
  reason?: string;
}

export class UnblockUserDto {
  @ApiProperty({ description: "Unblock qilinadigan user ID (UUID)" })
  @IsUUID()
  userId: string;
}



export class CreateDoctorDto {
  @ApiProperty({ example: "doctor@example.com" })
  @IsEmail()
  email: string;

  @ApiProperty({ example: "Ali" })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: "Valiyev" })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: "StrongPassword123" })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: 35 })
  @IsInt()
  @Min(1)
  @Max(170)
  age: number;

  @ApiProperty({ example: "category-uuid", description: "Shifokor malakasi ID" })
  @IsString()
  categoryId: string;

  @ApiProperty({
    example: "Men 10 yillik kardiologman...",
    description: "Shifokor bio (faqat bitta til, tizim o‘zi translate qiladi)",
    required: false,
  })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiProperty({ example: 2000.0, description: "Maoshi", required: false })
  @IsOptional()
  @IsNumber()
  salary?: number;

  @ApiProperty({
    example: ["img1.jpg", "img2.png"],
    description: "Shifokor suratlari",
    required: false,
  })
  @IsOptional()
  images?: any;

  @ApiProperty({
    example: ["video1.mp4", "video2.mp4"],
    description: "Shifokor videolari",
    required: false,
  })
  @IsOptional()
  videos?: any;
}

export class CreatePatientDto {
  @ApiProperty({ example: "patient@example.com" })
  @IsEmail()
  email: string;

  @ApiProperty({ example: "Ali" })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: "Valiyev" })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: "StrongPassword123" })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: 25 })
  @IsInt()
  @Min(1)
  @Max(170)
  age: number;
}
