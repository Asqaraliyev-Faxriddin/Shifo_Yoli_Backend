import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtAccesToken } from 'src/common/config/jwt';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { ReviewController } from './rating.controller';
import { ReviewService } from './rating.service';

@Module({
  imports:[JwtModule.register(JwtAccesToken)],
  controllers: [ReviewController],
  providers: [ReviewService,AuthGuard],
})
export class RatingModule {}
