import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
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
  controllers: [PaymentController],
  providers: [PaymentService,AuthGuard],
})
export class PaymentModule {}
