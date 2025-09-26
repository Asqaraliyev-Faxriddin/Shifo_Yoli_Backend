import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';

@Module({
  controllers: [AdminController],
  providers: [AdminService,AuthGuard],
})
export class AdminModule {}
