import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsNotEmpty, IsOptional, IsString, Length, Min } from "class-validator";



export class CreateCategory {

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @Length(3,50)
    name:string

    @ApiPropertyOptional()
    @IsOptional()
    img?:any

} 


export class UpdateCategory {

    @ApiPropertyOptional()
    @IsString()
    @IsNotEmpty()
    @Length(3,50)
    name?:string

    @ApiPropertyOptional()
    @IsOptional()
    img?:any

} 

export class CategoryAllDto {

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
}
