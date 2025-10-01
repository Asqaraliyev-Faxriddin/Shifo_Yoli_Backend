import { ApiProperty } from "@nestjs/swagger";

export class RemoveDeviceDto {
  @ApiProperty({ example: "uuid-device-id", description: "Qurilma ID" })
  deviceId: string;
}
