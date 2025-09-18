import { Module } from '@nestjs/common';


import { JwtModule } from '@nestjs/jwt';
import { JwtAccesToken } from 'src/common/config/jwt';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
// import { UserController } from './admin.controller';
// import { UserService } from './admin.service';

@Module({
  imports:[JwtModule.register(JwtAccesToken)],
  // controllers: [UserController],
  // providers: [UserService ,AuthGuard ],
})
export class UserModule {}
