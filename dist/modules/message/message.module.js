"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageModule = void 0;
const common_1 = require("@nestjs/common");
const message_service_1 = require("./message.service");
const message_controller_1 = require("./message.controller");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const message_gateway_1 = require("./message.gateway");
let MessageModule = class MessageModule {
};
exports.MessageModule = MessageModule;
exports.MessageModule = MessageModule = __decorate([
    (0, common_1.Module)({
        imports: [jwt_1.JwtModule.registerAsync({
                inject: [config_1.ConfigService],
                useFactory: async (config) => ({
                    secret: config.get('Jwt_Acc'),
                    signOptions: { expiresIn: config.get('Jwt_Acc_in') },
                }),
            })],
        controllers: [message_controller_1.MessageController],
        providers: [message_service_1.MessageService, jwt_auth_guard_1.AuthGuard, message_gateway_1.MessageGateway],
    })
], MessageModule);
//# sourceMappingURL=message.module.js.map