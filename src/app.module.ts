import { Module } from '@nestjs/common';
import { PrismaModule } from './core/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { MailerModule } from './common/mailer/mailer.module';
import { VerificationModule } from './modules/verification/verification.module';
import { RedisModule } from './core/prisma/redis/redis.module';
import { JwtModule } from '@nestjs/jwt';
import { ScheduleModule }  from '@nestjs/schedule';
  
import { SeaderModule } from './core/prisma/seader/seader.module';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ProfileModule } from './modules/profile/profile.module';
import { RatingModule } from './modules/rating/rating.module';
import { AdminModule } from './modules/admin/admin.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ 

    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), "uploads", "documents"),
      serveRoot: "/document/file", 
    }),
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({isGlobal:true})
      
    ,

    PrismaModule, AuthModule,MailerModule,AuthModule,VerificationModule,
    RedisModule,  SeaderModule,JwtModule,AdminModule,ProfileModule,RatingModule, AdminModule]
})
export class AppModule {}
   