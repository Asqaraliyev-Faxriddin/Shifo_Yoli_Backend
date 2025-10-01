import {
  Controller,
  Get,
  Patch,
  Param,
  Query,
  UseGuards,
  Req,
  Post,
  Body,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { FindAllNotificationDto } from './dto/create-notification.dto';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags, ApiQuery, ApiOperation, ApiBody } from '@nestjs/swagger';
import { Request } from 'express';
import { NameDto } from './dto/update-notification.dto';

@ApiTags('Notification')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  @ApiOperation({ summary: 'Get all notifications with pagination & filter' })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'offset', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'read', required: false, type: Boolean, example: false })
  async findAll(@Req() req, @Query() query: FindAllNotificationDto) {
    const userId = req.user['id']; 
    return this.notificationService.findAll(userId, query);
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Mark one notification as read' })
  async markAsRead(@Param('id') id: string) {
    return this.notificationService.markAsRead(id);
  }

  @Patch('read-all')
  @ApiOperation({ summary: 'Mark all notifications as read' })
  async markAllAsRead(@Req() req) {
    const userId = req.user['id'];
    return this.notificationService.markAllAsRead(userId);
  }

  
  @Post("weweweew")
  @ApiOperation({summary:"juda zorda"})
  @ApiBody({type:NameDto})
  async salom(@Body() body:NameDto){
    return this.notificationService.see(body)
  }
}
