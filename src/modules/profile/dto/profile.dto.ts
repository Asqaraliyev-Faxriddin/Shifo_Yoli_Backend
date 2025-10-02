import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPhoneNumber, IsString, Length, MinLength, ValidateIf } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class UpdateProfileDto {
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
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    year?:number

    @ApiPropertyOptional()
    @IsNumber()
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
@IsOptional()
phoneNumber?: string;

    @ApiPropertyOptional({
      type: 'string',
      format: 'binary',
      description: 'Profil rasmi (faqat Swagger uchun)',
    })
    @IsOptional()
    profileImg?: any;


}



export class PhoneUpdateDto {
  
    @ApiProperty({ example: "123456", description: "SMS orqali yuborilgan OTP kodi" })
    @IsNotEmpty()
    @IsString()
    otp: string;
  
    @ApiProperty({ example: "@example.com", description: "Yangi telefon raqami" })
    @IsNotEmpty()
    email: string;
  }

  export class UpdatePasswordDto {
    @ApiProperty()
    @IsString()
    oldPassword: string;
  
    @ApiProperty()
    @IsString()
    newPassword: string;
  }
  