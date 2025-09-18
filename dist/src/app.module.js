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
const user_module_1 = require("./modules/user/user.module");
const profile_module_1 = require("./modules/profile/profile.module");
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
            prisma_module_1.PrismaModule, auth_module_1.AuthModule, mailer_module_1.MailerModule, auth_module_1.AuthModule, verification_module_1.VerificationModule,
            redis_module_1.RedisModule, seader_module_1.SeaderModule, user_module_1.UserModule, jwt_1.JwtModule, profile_module_1.ProfileModule
        ]
    })
], AppModule);
//# sourceMappingURL=app.module.js.map