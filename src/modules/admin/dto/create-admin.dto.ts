import { ApiProperty } from "@nestjs/swagger";
import { 
  IsEmail, 
  IsOptional, 
  IsString, 
  IsInt, 
  Min, 
  Max, 
  IsUUID 
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
export class CreateDoctorDto extends BaseUserDto {}
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
