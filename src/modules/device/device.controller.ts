import { 
  Controller, 
  Get, 
  Delete, 
  Req, 
  Param, 
  UseGuards, 
  Post
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiParam } from "@nestjs/swagger";
import { DeviceService } from './device.service';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';

@ApiTags("Devices")
@ApiBearerAuth()
@Controller('device')
@UseGuards(AuthGuard, RolesGuard)
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}

  @Get("all")
  @ApiOperation({ summary: "Foydalanuvchining barcha qurilmalarini olish" })
  findAll(@Req() req) {
    return this.deviceService.findAll(req.user.id);
  }

  @Post('block/:id')
  @ApiOperation({ summary: "Qurilmani bloklash" })
  @ApiParam({ name: "id", description: "Qurilma ID (uuid)", example: "uuid-device-id" })
  remove(@Param('id') id: string, @Req() req) {
    return this.deviceService.remove(id, req.user.id, req);
  }


  @Post('unblock/:id')
  @ApiOperation({ summary: "Qurilmani bloklash" })
  @ApiParam({ name: "id", description: "Qurilma ID (uuid)", example: "uuid-device-id" })
  unblock(@Param('id') id: string, @Req() req) {
    return this.deviceService.unblock(id, req.user.id, req);
  }
}
