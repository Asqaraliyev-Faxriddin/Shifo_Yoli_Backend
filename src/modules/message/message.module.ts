import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports:[ JwtModule.registerAsync({
        inject: [ConfigService],
        useFactory: async (config: ConfigService) => ({
          secret: config.get<string>('Jwt_Acc'),
          signOptions: { expiresIn: config.get<string>('Jwt_Acc_in') },
        }),
      })],
  controllers: [MessageController],
  providers: [MessageService,AuthGuard],
})
export class MessageModule {}
