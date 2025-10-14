"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const prisma_module_1 = require("./core/prisma/prisma.module");
const auth_module_1 = require("./modules/auth/auth.module");
const mailer_module_1 = require("./common/mailer/mailer.module");
const verification_module_1 = require("./modules/verification/verification.module");
const redis_module_1 = require("./core/prisma/redis/redis.module");
const jwt_1 = require("@nestjs/jwt");
const schedule_1 = require("@nestjs/schedule");
const seader_module_1 = require("./core/prisma/seader/seader.module");
const path_1 = require("path");
const serve_static_1 = require("@nestjs/serve-static");
const profile_module_1 = require("./modules/profile/profile.module");
const rating_module_1 = require("./modules/rating/rating.module");
const config_1 = require("@nestjs/config");
const message_module_1 = require("./modules/message/message.module");
const device_module_1 = require("./modules/device/device.module");
const doctor_category_module_1 = require("./modules/doctor-category/doctor-category.module");
const doctor_profile_module_1 = require("./modules/doctor-profile/doctor-profile.module");
const admin_module_1 = require("./modules/admin/admin.module");
const notification_module_1 = require("./modules/notification/notification.module");
const meeting_module_1 = require("./modules/meeting/meeting.module");
const contact_module_1 = require("./modules/contact/contact.module");
const payment_module_1 = require("./modules/payment/payment.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            serve_static_1.ServeStaticModule.forRoot({
                rootPath: (0, path_1.join)(process.cwd(), "uploads", "documents"),
                serveRoot: "/document/file",
            }),
            serve_static_1.ServeStaticModule.forRoot({
                rootPath: (0, path_1.join)(process.cwd(), "uploads", "images"),
                serveRoot: "/images",
            }),
            serve_static_1.ServeStaticModule.forRoot({
                rootPath: (0, path_1.join)(process.cwd(), "uploads", "profiles"),
                serveRoot: "/profiles/file",
            }),
            serve_static_1.ServeStaticModule.forRoot({
                rootPath: (0, path_1.join)(process.cwd(), "uploads", "videos"),
                serveRoot: "/videos",
            }),
            schedule_1.ScheduleModule.forRoot(),
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            prisma_module_1.PrismaModule, auth_module_1.AuthModule, mailer_module_1.MailerModule, auth_module_1.AuthModule, verification_module_1.VerificationModule,
            redis_module_1.RedisModule, seader_module_1.SeaderModule, jwt_1.JwtModule,
            profile_module_1.ProfileModule, admin_module_1.AdminModule, rating_module_1.RatingModule,
            message_module_1.MessageModule, device_module_1.DeviceModule, doctor_category_module_1.DoctorCategoryModule,
            doctor_profile_module_1.DoctorProfileModule,
            notification_module_1.NotificationModule, meeting_module_1.MeetingModule, contact_module_1.ContactModule, payment_module_1.PaymentModule
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map