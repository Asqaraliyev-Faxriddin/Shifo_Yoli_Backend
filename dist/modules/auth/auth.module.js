"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const auth_controller_1 = require("./auth.controller");
const auth_service_1 = require("./auth.service");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const config_1 = require("@nestjs/config");
const verification_module_1 = require("../verification/verification.module");
const redis_module_1 = require("../../core/prisma/redis/redis.module");
const prisma_module_1 = require("../../core/prisma/prisma.module");
const mailer_module_1 = require("../../common/mailer/mailer.module");
const google_strategy_1 = require("./stratagies/google.strategy");
const github_strategy_1 = require("./stratagies/github.strategy");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule,
            prisma_module_1.PrismaModule,
            redis_module_1.RedisModule,
            mailer_module_1.MailerModule,
            verification_module_1.VerificationModule,
            passport_1.PassportModule.register({ session: false }),
            jwt_1.JwtModule.registerAsync({
                inject: [config_1.ConfigService],
                useFactory: async (config) => ({
                    secret: config.get('Jwt_Acc'),
                    signOptions: { expiresIn: config.get('Jwt_Acc_in') },
                }),
            }),
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [
            auth_service_1.AuthService,
            google_strategy_1.GoogleStrategy,
            github_strategy_1.GithubStrategy,
        ],
        exports: [auth_service_1.AuthService],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map