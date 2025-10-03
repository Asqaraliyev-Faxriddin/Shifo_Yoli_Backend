import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, Length } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateContactDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Foydalanuvchi email manzili',
  })
  @IsEmail({}, { message: 'Email noto‘g‘ri kiritilgan' })
  email: string;

  @ApiPropertyOptional({
    example: '+998901234567',
    description: 'Foydalanuvchi telefon raqami',
  })
  @IsPhoneNumber('UZ', { message: 'Telefon raqam noto‘g‘ri' })
  phone?: string;

  @ApiProperty({
    example: 'Salom, menga shifokor kerak.',
    description: 'Xabar matni',
  })
  @IsNotEmpty({ message: 'Xabar bo‘sh bo‘lishi mumkin emas' })
  @IsString()
  @Length(5, 1000, { message: 'Xabar uzunligi 5–1000 belgi orasida bo‘lishi kerak' })
  message: string;
}
