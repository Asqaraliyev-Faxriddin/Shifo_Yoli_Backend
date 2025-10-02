import { Controller, Get, Post, Param, Body, Patch, Delete } from '@nestjs/common';
import { MeetingService } from './meeting.service';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { UpdateMeetingDto } from './dto/update-meeting.dto';

@Controller('meetings')
export class MeetingController {
  constructor(private readonly meetingService: MeetingService) {}

  @Post()
  create(@Body() dto: CreateMeetingDto) {
    return this.meetingService.create(dto);
  }

  @Get()
  findAll() {
    return this.meetingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.meetingService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateMeetingDto) {
    return this.meetingService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.meetingService.remove(id);
  }
}
