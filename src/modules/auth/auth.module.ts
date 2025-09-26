import { Global, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { VerificationModule } from '../verification/verification.module';
import { RedisModule } from 'src/core/prisma/redis/redis.module';
import { PrismaModule } from 'src/core/prisma/prisma.module';
import { MailerModule } from 'src/common/mailer/mailer.module';

import { GoogleStrategy } from './stratagies/google.strategy';
import { GithubStrategy } from './stratagies/github.strategy';

@Global()
@Module({
  imports: [
    ConfigModule,
    PrismaModule,
    RedisModule,
    MailerModule,
    VerificationModule,

    PassportModule.register({ session: false }),

    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        secret: config.get<string>('Jwt_Acc'),
        signOptions: { expiresIn: config.get<string>('Jwt_Acc_in') },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    GoogleStrategy,
    GithubStrategy,
  ],
  exports: [AuthService], 
})
export class AuthModule {}
