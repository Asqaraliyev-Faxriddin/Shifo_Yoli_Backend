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
import { ConfigModule } from '@nestjs/config';
import { MessageModule } from './modules/message/message.module';
import { DeviceModule } from './modules/device/device.module';
import { DoctorCategoryModule } from './modules/doctor-category/doctor-category.module';
import { DoctorProfileModule } from './modules/doctor-profile/doctor-profile.module';
import { AdminModule } from './modules/admin/admin.module';
import { NotificationModule } from './modules/notification/notification.module';
import { MeetingModule } from './modules/meeting/meeting.module';
import { ContactModule } from './modules/contact/contact.module';

@Module({
  imports: [ 

    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), "uploads", "documents"),
      serveRoot: "/document/file", 
    }),

    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), "uploads", "images"),
      serveRoot: "/images/file", 
    }),

    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), "uploads", "profiles"),
      serveRoot: "/profiles/file", 
    }),

    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), "uploads", "videos"),
      serveRoot: "/videos/file", 
    }),
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({isGlobal:true})
      
    ,

    PrismaModule, AuthModule,MailerModule,AuthModule,VerificationModule,
    RedisModule,  SeaderModule,JwtModule,
    ProfileModule,AdminModule,RatingModule, 
    MessageModule, DeviceModule, DoctorCategoryModule,
     DoctorProfileModule,
     NotificationModule, MeetingModule, ContactModule],


})


export class AppModule {}
   