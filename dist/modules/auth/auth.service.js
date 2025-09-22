"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const jwt_2 = require("../../common/config/jwt");
const prisma_service_1 = require("../../core/prisma/prisma.service");
const verification_service_1 = require("../verification/verification.service");
const verification_1 = require("../../common/types/verification");
const bcrypt = require("bcrypt");
const client_1 = require("@prisma/client");
const crypto_1 = require("crypto");
let AuthService = class AuthService {
    prisma;
    jwtServise;
    verificationService;
    constructor(prisma, jwtServise, verificationService) {
        this.prisma = prisma;
        this.jwtServise = jwtServise;
        this.verificationService = verificationService;
    }
    async generateToken(payload, onlyAccess = false) {
        const AccessToken = await this.jwtServise.signAsync(payload, jwt_2.JwtAccesToken);
        const RefreshToken = await this.jwtServise.signAsync(payload, jwt_2.JwtRefreshToken);
        if (onlyAccess) {
            return AccessToken;
        }
        else {
            return {
                AccessToken,
                RefreshToken,
            };
        }
    }
    async register(payload, req) {
        const { firstName, lastName, otp, email, password, age } = payload;
        await this.verificationService.checkConfirmOtp({
            email,
            type: verification_1.EverificationTypes.REGISTER,
            otp,
        });
        const hashPassword = await bcrypt.hash(password, 10);
        const user = await this.prisma.user.create({
            data: {
                firstName,
                lastName,
                age,
                email,
                role: client_1.UserRole.BEMOR,
                password: hashPassword,
            },
        });
        await this.saveDevice(user.id, req, client_1.DeviceType.register);
        const tokens = await this.generateToken({ id: user.id, role: user.role });
        return {
            status: true,
            message: "User successfully registered",
            data: user,
            tokens,
        };
    }
    async login(payload, req) {
        const user = await this.PhoneAndPasswordCheck(payload.password, payload.email);
        await this.saveDevice(user.id, req, client_1.DeviceType.login);
        const tokens = await this.generateToken({ id: user.id, role: user.role });
        return {
            status: true,
            message: "Login successful",
            tokens,
        };
    }
    async RefresholdAcces(token) {
        try {
            const oldId = await this.jwtServise.verifyAsync(token.token, jwt_2.JwtRefreshToken);
            if (!oldId)
                throw new common_1.UnauthorizedException();
            const checkUser = await this.prisma.user.findFirst({ where: { id: oldId.id } });
            if (!checkUser)
                throw new common_1.UnauthorizedException();
            const AccessToken = await this.generateToken({ id: checkUser.id, role: checkUser.role }, true);
            return { AccessToken };
        }
        catch (error) {
            throw new common_1.UnauthorizedException(error.message);
        }
    }
    async reset_password(payload) {
        const { otp, email, password } = payload;
        await this.verificationService.checkConfirmOtp({
            email,
            type: verification_1.EverificationTypes.RESET_PASSWORD,
            otp,
        });
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user)
            throw new common_1.NotFoundException("User not found");
        const hashPassword = await bcrypt.hash(password, 10);
        const updated = await this.prisma.user.update({
            where: { email },
            data: { password: hashPassword },
        });
        return {
            status: true,
            message: "Password successfully updated",
            data: updated,
        };
    }
    async googleLogin(user, req) {
        if (!user) {
            throw new common_1.UnauthorizedException();
        }
        const randomPassword = (0, crypto_1.randomBytes)(16).toString("hex");
        let existingUser = await this.prisma.user.findUnique({
            where: { email: user.email },
        });
        if (!existingUser) {
            existingUser = await this.prisma.user.create({
                data: {
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    age: 0,
                    role: client_1.UserRole.BEMOR,
                    password: randomPassword,
                },
            });
        }
        await this.saveDevice(existingUser.id, req, client_1.DeviceType.login);
        const tokens = await this.generateToken({
            id: existingUser.id,
            role: existingUser.role,
        });
        return {
            status: true,
            message: "Google login successful",
            data: existingUser,
            tokens,
        };
    }
    async PhoneAndPasswordCheck(password, email) {
        const oldUser = await this.prisma.user.findUnique({ where: { email } });
        if (!oldUser)
            throw new common_1.NotFoundException("Email not found");
        let checkPassword;
        if (oldUser.password.startsWith("$2b$")) {
            checkPassword = await bcrypt.compare(password, oldUser.password);
        }
        else {
            checkPassword = password === oldUser.password;
        }
        if (!checkPassword) {
            throw new common_1.BadRequestException("Password Incorrect or Email not found");
        }
        return oldUser;
    }
    async saveDevice(userId, req, type) {
        const userAgent = req.headers["user-agent"] || "unknown";
        const ip = req.ip || req.headers["x-forwarded-for"] || "unknown";
        await this.prisma.device.create({
            data: {
                userId,
                deviceId: (0, crypto_1.randomUUID)(),
                name: userAgent,
                platform: this.detectPlatform(userAgent),
                address: ip,
                deviceType: type,
            },
        });
    }
    detectPlatform(userAgent) {
        userAgent = userAgent.toLowerCase();
        if (/android/i.test(userAgent))
            return "android";
        if (/iphone|ipad|ipod/i.test(userAgent))
            return "ios";
        if (/windows nt/i.test(userAgent))
            return "windows";
        if (/mac os x/i.test(userAgent))
            return "macos";
        if (/ubuntu/i.test(userAgent))
            return "ubuntu";
        if (/debian/i.test(userAgent))
            return "debian";
        if (/fedora/i.test(userAgent))
            return "fedora";
        if (/centos/i.test(userAgent))
            return "centos";
        if (/red hat/i.test(userAgent))
            return "redhat";
        if (/linux/i.test(userAgent))
            return "linux";
        if (/googlebot/i.test(userAgent))
            return "googlebot";
        if (/bingbot/i.test(userAgent))
            return "bingbot";
        if (/duckduckbot/i.test(userAgent))
            return "duckduckbot";
        return "web";
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        verification_service_1.VerificationService])
], AuthService);
//# sourceMappingURL=auth.service.js.map