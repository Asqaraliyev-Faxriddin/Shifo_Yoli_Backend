import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsUUID } from "class-validator";



export class PaymentDocktorBemorDto {
    @ApiProperty({example:30})
    @IsNotEmpty()
    countday: number;

    @ApiProperty({example:"usdt"})
    @IsUUID()
    @IsNotEmpty()
    doctorId: string;
}


export class PaymentDocktorChanegeDto {
    

    @ApiProperty({example:"usdt"})
    @IsUUID()
    @IsNotEmpty()
    doctorId: string;
}
