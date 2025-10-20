import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class NameDto {
    @ApiProperty({ example: 'Ali', description: 'Foydalanuvchi ismi' })
    @IsString()
    @IsNotEmpty()
    name: string;
  }


  export class CreateNotificationSuperDto {


    @ApiProperty({ example: 'Sizning buyurtmangiz qabul qilindi.', description: 'Bildirishnoma xabari' })
    @IsString()
    @IsNotEmpty()
    message: string;

  }