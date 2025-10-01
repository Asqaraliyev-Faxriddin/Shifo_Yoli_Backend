import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class NameDto {
    @ApiProperty({ example: 'Ali', description: 'Foydalanuvchi ismi' })
    @IsString()
    @IsNotEmpty()
    name: string;
  }