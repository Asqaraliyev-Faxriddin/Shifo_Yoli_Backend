import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsInt, IsOptional, IsString, IsUUID, Max, Min } from "class-validator";

export class CreateReviewDto {
  @ApiProperty({
    description: "Shifokorning ID si",
    example: "a3b5c8d2-7e44-4f38-9c77-12b34cd56789",
  })
  @IsUUID()
  doctorId: string;

  @ApiProperty({
    description: "Baholash (1 dan 5 gacha)",
    example: 5,
    minimum: 1,
    maximum: 5,
  })
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({
    description: "Izoh (ixtiyoriy)",
    example: "Doktor juda e'tiborli va yaxshi maslahat berdi.",
    required: false,
  })
  @IsOptional()
  @IsString()
  comment?: string;
}

export class UpdateReviewDto extends PartialType(CreateReviewDto) {}

export class ReviewResponseDto {
  @ApiProperty({ example: "f1c2b3a4-5678-90ab-cdef-1234567890ab" })
  id: string;

  @ApiProperty({ example: "u8d7s6a5-4321-90ab-cdef-0987654321ab" })
  userId: string;

  @ApiProperty({ example: "d9f8e7c6-1234-56ab-cdef-654321abcdef" })
  doctorId: string;

  @ApiProperty({ example: 4 })
  rating: number;

  @ApiProperty({
    example: "Doktor juda yordamchi bo‘ldi",
    nullable: true,
  })
  comment?: string;

  @ApiProperty({ example: "2025-09-18T12:34:56.000Z" })
  createdAt: Date;

  @ApiProperty({ example: "2025-09-18T13:45:01.000Z" })
  updatedAt: Date;
}
