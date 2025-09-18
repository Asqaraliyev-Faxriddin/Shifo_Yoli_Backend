import { Module } from '@nestjs/common';
import { PrismaModule } from './core/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { MailerModule } from './common/mailer/mailer.module';
import { VerificationModule } from './modules/verification/verification.module';
import { RedisModule } from './core/prisma/redis/redis.module';
import { JwtModule } from '@nestjs/jwt';
import { ScheduleModule } from '@nestjs/schedule';
// import { RatingModule } from './modules/rating/rating.module';

import { SeaderModule } from './core/prisma/seader/seader.module';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { UserModule } from './modules/user/user.module';
import { ProfileModule } from './modules/profile/profile.module';

@Module({
  imports: [

    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), "uploads", "documents"),
      serveRoot: "/document/file", 
    }),
    ScheduleModule.forRoot(),
    PrismaModule, AuthModule,MailerModule,AuthModule,VerificationModule,
    RedisModule,  SeaderModule,UserModule,JwtModule,ProfileModule]
})
export class AppModule {}
  