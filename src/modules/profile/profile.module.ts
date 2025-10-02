import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtAccesToken } from 'src/common/config/jwt';
import { VerificationModule } from '../verification/verification.module';
import { UserModule } from './user/user.module';

@Module({
  imports:[JwtModule.register(JwtAccesToken),VerificationModule, UserModule],
  providers: [ProfileService],
  controllers: [ProfileController]
})
export class ProfileModule {}
