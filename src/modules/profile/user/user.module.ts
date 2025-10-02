import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JwtAccesToken } from 'src/common/config/jwt';
import { VerificationModule } from 'src/modules/verification/verification.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports:[JwtModule.register(JwtAccesToken),VerificationModule, UserModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
