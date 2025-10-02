import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Patch,
  Delete,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import { MeetingService } from './meeting.service';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { UpdateMeetingDto } from './dto/update-meeting.dto';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { join } from 'path';

@ApiBearerAuth()
@ApiTags('Meetings')
@Controller('meeting')
@UseGuards(AuthGuard, RolesGuard)
export class MeetingController {
  constructor(private readonly meetingService: MeetingService) {}

  @Post('create')
  @ApiOperation({ summary: 'Yangi meeting yaratish' })
  @ApiResponse({ status: 201, description: 'Meeting muvaffaqiyatli yaratildi' })
  create(@Body() dto: CreateMeetingDto, @Req() req: any) {
    return this.meetingService.create(dto, req.user.id);
  }

  @Get('all')
  @ApiOperation({ summary: 'Barcha meetinglarni olish' })
  @ApiResponse({ status: 200, description: 'Meetinglar ro‘yxati' })
  findAll(@Req() req: any) {
    if (req.user.role === 'SUPERADMIN') {
      return this.meetingService.findAllForAdmin();
    }
    return this.meetingService.findAllForUser(req.user.id);
  }

  @Get('one/meeting/:id')
  @ApiOperation({ summary: 'Bitta meetingni olish' })
  @ApiResponse({ status: 200, description: 'Meeting topildi' })
  @ApiResponse({ status: 404, description: 'Meeting topilmadi' })
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.meetingService.findOne(
      id,
      req.user.id,
      req.user.role === 'SUPERADMIN',
    );
  }

  @Patch('update/:id')
  @ApiOperation({ summary: 'Meetingni yangilash' })
  @ApiResponse({ status: 200, description: 'Meeting yangilandi' })
  update(@Param('id') id: string, @Body() dto: UpdateMeetingDto, @Req() req: any) {
    return this.meetingService.update(
      id,
      dto,
      req.user.id,
      req.user.role === 'SUPERADMIN',
    );
  }

  @Delete('delete/:id')
  @ApiOperation({ summary: 'Meetingni o‘chirish' })
  @ApiResponse({ status: 200, description: 'Meeting muvaffaqiyatli o‘chirildi' })
  remove(@Param('id') id: string, @Req() req: any) {
    return this.meetingService.remove(
      id,
      req.user.id,
      req.user.role === 'SUPERADMIN',
    );
  }



}
