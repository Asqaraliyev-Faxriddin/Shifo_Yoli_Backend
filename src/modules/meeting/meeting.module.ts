import { Module } from '@nestjs/common';
import { MeetingService } from './meeting.service';
import { MeetingController } from './meeting.controller';
import { MeetingGateway } from './meeting-gateway';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';

@Module({
  imports:[ JwtModule.registerAsync({
    inject: [ConfigService],
    useFactory: async (config: ConfigService) => ({
      secret: config.get<string>('Jwt_Acc'),
      signOptions: { expiresIn: config.get<string>('Jwt_Acc_in') },
    }),
  })],
  controllers: [MeetingController],
  providers: [MeetingService,MeetingGateway,AuthGuard],
})
export class MeetingModule {}
