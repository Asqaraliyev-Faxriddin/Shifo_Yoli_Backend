import { Module } from '@nestjs/common';
import { MeetingService } from './meeting.service';
import { MeetingController } from './meeting.controller';
import { MeetingGateway } from './meeting-gateway';

@Module({
  controllers: [MeetingController],
  providers: [MeetingService,MeetingGateway],
})
export class MeetingModule {}
