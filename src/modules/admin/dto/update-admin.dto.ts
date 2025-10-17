import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, IsInt, Min, Max, IsNumberString, Length, ValidateIf, IsPhoneNumber, IsNumber, IsEmail } from "class-validator";
import { Type } from "class-transformer";

export class SearchUserDto {
  @ApiProperty({ required: false, description: "Ism bo‘yicha qidirish", example: "Ali" })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({ required: false, description: "Familiya bo‘yicha qidirish", example: "Valiyev" })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional({ required: false, description: "Email bo‘yicha qidirish", example: "user@example.com" })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional({ required: false, description: "Yosh bo‘yicha minimal filter", example: 18 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(170)
  ageFrom?: number;

  @ApiPropertyOptional({ required: false, description: "Yosh bo‘yicha maksimal filter", example: 65 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(170)
  ageTo?: number;

  @ApiPropertyOptional({ required: false, description: "Har bir sahifada nechta yozuv bo‘lsin (limit)", example: 10, default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 10;

  @ApiPropertyOptional({ required: false, description: "Nechinchi sahifa (1 dan boshlanadi)", example: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;
}


export class UpdateProfileUserAdminDto {
  @ApiPropertyOptional({
    description: 'Foydalanuvchining ismi',
    example: 'Ali',
  })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional({
    description: 'Foydalanuvchining familiyasi',
    example: 'Valiyev',
  })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional({
    description: 'Foydalanuvchining roli',
    example: 'BUY',
    enum: ['BUY', 'SELL'],
  })
  @IsOptional()
  @Length(1,330)
  age?:number



    @ApiPropertyOptional()
    @IsNumberString()
    @IsOptional()
    @Type(() => Number)
    @Length(1,12)
    month?:number

    @ApiPropertyOptional()
    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    day?:number


    @ApiPropertyOptional()
    @ValidateIf(o => o.phoneNumber !== '' && o.phoneNumber !== null && o.phoneNumber !== undefined)
    @IsPhoneNumber("UZ")
    phoneNumber?: string;
    @IsOptional()

    @ApiPropertyOptional({
      type: 'string',
      format: 'binary',
      description: 'Profil rasmi (faqat Swagger uchun)',
    })
    @IsOptional()
    profileImg?: any;


    @ApiPropertyOptional()
    @IsOptional()
    password?:string;


    @ApiPropertyOptional()
    @IsOptional()
    @IsEmail()
    email?:string


}
