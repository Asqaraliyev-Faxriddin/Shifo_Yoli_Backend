import { Module } from '@nestjs/common';
import { DoctorProfileService } from './doctor-profile.service';
import { DoctorProfileController } from './doctor-profile.controller';

@Module({
  controllers: [DoctorProfileController],
  providers: [DoctorProfileService],
})
export class DoctorProfileModule {}
