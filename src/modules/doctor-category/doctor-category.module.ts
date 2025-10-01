import { Module } from '@nestjs/common';
import { DoctorCategoryService } from './doctor-category.service';
import { DoctorCategoryController } from './doctor-category.controller';
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
  controllers: [DoctorCategoryController],
  providers: [DoctorCategoryService,AuthGuard],
})
export class DoctorCategoryModule {}
