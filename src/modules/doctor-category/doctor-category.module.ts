import { Module } from '@nestjs/common';
import { DoctorCategoryService } from './doctor-category.service';
import { DoctorCategoryController } from './doctor-category.controller';

@Module({
  controllers: [DoctorCategoryController],
  providers: [DoctorCategoryService],
})
export class DoctorCategoryModule {}
