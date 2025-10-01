import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
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
  controllers: [NotificationController],
  providers: [NotificationService,AuthGuard],
})
export class NotificationModule {}
