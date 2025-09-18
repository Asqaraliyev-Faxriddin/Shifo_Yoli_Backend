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
    async generateToken(payload, Token_status = false) {
        let AccessToken = await this.jwtServise.signAsync(payload, jwt_2.JwtAccesToken);
        let RefreshToken = await this.jwtServise.signAsync(payload, jwt_2.JwtRefreshToken);
        if (Token_status == true) {
            return AccessToken;
        }
        else {
            return {
                AccessToken,
                RefreshToken
            };
        }
    }
    async register(payload) {
        let { firstName, lastName, otp, email, password } = payload;
        await this.verificationService.checkConfirmOtp({ email, type: verification_1.EverificationTypes.REGISTER, otp });
        let hashpassword = await bcrypt.hash(password, 10);
        let data = await this.prisma.user.create({ data: {
                firstName,
                lastName,
                age: 4,
                email,
                role: client_1.UserRole.BEMOR,
                password: hashpassword
            } });
        const tokens = await this.generateToken({ id: data.id, role: data.role });
        return {
            status: true,
            message: "Succase created user",
            data,
            Tokens: tokens
        };
    }
    async login(payload) {
        let olduser = await this.PhoneAndPasswordCheck(payload.password, payload.email);
        return await this.generateToken({ id: olduser.id, role: olduser.role });
    }
    async RefresholdAcces(token) {
        try {
            let oldId = await this.jwtServise.verifyAsync(token.token, jwt_2.JwtRefreshToken);
            console.log("token", oldId);
            if (!oldId)
                throw new common_1.UnauthorizedException();
            let checkUser = await this.prisma.user.findFirst({ where: { id: oldId.id } });
            if (!checkUser)
                throw new common_1.UnauthorizedException();
            let AccessToken = await this.generateToken({ id: checkUser.id, role: checkUser.role }, true);
            return { AccessToken };
        }
        catch (error) {
            throw new common_1.UnauthorizedException(error.message);
        }
    }
    async reset_password(payload) {
        let { otp, email, password } = payload;
        await this.verificationService.checkConfirmOtp({ email, type: verification_1.EverificationTypes.RESET_PASSWORD, otp });
        let user = await this.prisma.user.findUnique({ where: { email } });
        if (!user)
            throw new common_1.NotFoundException("User not found");
        let hashpassword = await bcrypt.hash(password, 10);
        let data = await this.prisma.user.update({ where: { email }, data: {
                password: hashpassword
            } });
        return {
            status: true,
            message: "Succase updated user",
            data,
        };
    }
    async PhoneAndPasswordCheck(password, email) {
        let oldphone = await this.prisma.user.findUnique({ where: { email } });
        if (!oldphone)
            throw new common_1.NotFoundException("Email not found");
        let checkpassword;
        if (oldphone.password.startsWith('$2b$')) {
            checkpassword = await bcrypt.compare(password, oldphone.password);
        }
        else {
            checkpassword = password === oldphone.password;
        }
        if (!checkpassword) {
            throw new common_1.BadRequestException("Password Incorrect");
        }
        return oldphone;
    }
    async googleLogin(user) {
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
                    age: 0,
                    lastName: user.lastName,
                    role: client_1.UserRole.BEMOR,
                    password: randomPassword,
                },
            });
        }
        const tokens = await this.generateToken({
            id: existingUser.id,
            role: existingUser.role,
        });
        return {
            status: true,
            message: "Google orqali login qilindi",
            data: existingUser,
            tokens,
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, jwt_1.JwtService,
        verification_service_1.VerificationService])
], AuthService);
//# sourceMappingURL=auth.service.js.map