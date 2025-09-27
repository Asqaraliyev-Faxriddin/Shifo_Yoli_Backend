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
const admin_module_1 = require("./modules/admin/admin.module");
const config_1 = require("@nestjs/config");
const message_module_1 = require("./modules/message/message.module");
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
            schedule_1.ScheduleModule.forRoot(),
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            prisma_module_1.PrismaModule, auth_module_1.AuthModule, mailer_module_1.MailerModule, auth_module_1.AuthModule, verification_module_1.VerificationModule,
            redis_module_1.RedisModule, seader_module_1.SeaderModule, jwt_1.JwtModule, admin_module_1.AdminModule, profile_module_1.ProfileModule, rating_module_1.RatingModule, admin_module_1.AdminModule, message_module_1.MessageModule
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map