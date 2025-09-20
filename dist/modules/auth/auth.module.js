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
const jwt_2 = require("../../common/config/jwt");
const verification_service_1 = require("../verification/verification.service");
const sms_service_1 = require("../../common/services/sms.service");
const redis_service_1 = require("../../core/prisma/redis/redis.service");
const mailer_service_1 = require("../../common/mailer/mailer.service");
const prisma_service_1 = require("../../core/prisma/prisma.service");
const google_strategy_1 = require("./stratagies/google.strategy");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [jwt_1.JwtModule.register(jwt_2.JwtAccesToken)],
        controllers: [auth_controller_1.AuthController],
        providers: [
            auth_service_1.AuthService,
            verification_service_1.VerificationService,
            sms_service_1.SmsService,
            redis_service_1.RedisService,
            mailer_service_1.AppMailerService,
            prisma_service_1.PrismaService,
            google_strategy_1.GoogleStrategy
        ]
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map