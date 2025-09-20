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
exports.ProfileService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../core/prisma/prisma.service");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");
const verification_1 = require("../../common/types/verification");
const verification_service_1 = require("../verification/verification.service");
let ProfileService = class ProfileService {
    prisma;
    verificationService;
    constructor(prisma, verificationService) {
        this.prisma = prisma;
        this.verificationService = verificationService;
    }
    async myProfile(id) {
        console.log("salom");
        let data = await this.prisma.user.findFirst({ where: { id }, select: { id: true, firstName: true, lastName: true, email: true, role: true, profileImg: true } });
        if (!data)
            throw new common_1.NotFoundException("User not found");
        return {
            succase: true,
            message: "Succase my profile",
            data
        };
    }
    async deleteProfile(id) {
        let data = await this.prisma.user.findFirst({ where: { id } });
        if (!data)
            throw new common_1.NotFoundException("User not found");
        await this.prisma.user.delete({
            where: {
                id: data.id
            }
        });
        return {
            succase: true,
            message: "Succase delete User",
            data
        };
    }
    async updateProfile(userId, dto, fileName) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.NotFoundException('Foydalanuvchi topilmadi');
        }
        if (fileName && user.profileImg) {
            const oldFilePath = path.join(process.cwd(), 'uploads', 'profiles', user.profileImg);
            if (fs.existsSync(oldFilePath)) {
                fs.unlinkSync(oldFilePath);
            }
        }
        const updatedUser = await this.prisma.user.update({
            where: { id: userId },
            data: {
                firstName: dto.firstName,
                lastName: dto.lastName,
                ...(dto.age && { age: dto.age }),
                ...(fileName && { profileImg: fileName }),
            },
        });
        return {
            ...updatedUser,
            profileImg: updatedUser.profileImg ? `${updatedUser.profileImg}` : null,
        };
    }
    async updatePhone(userId, payload) {
        await this.verificationService.checkConfirmOtp({ type: verification_1.EverificationTypes.EDIT_PHONE, email: payload.email, otp: payload.otp });
        const updated = await this.prisma.user.update({
            where: { id: userId },
            data: { email: payload.email },
        });
        return {
            status: true,
            message: "Telefon raqami yangilandi",
            data: updated,
        };
    }
    async updatePassword(userId, payload) {
        const { oldPassword, newPassword } = payload;
        const user = await this.prisma.user.findFirst({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.NotFoundException("User not found");
        }
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            throw new common_1.BadRequestException("Password incorrect");
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const updatedUser = await this.prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword },
        });
        return {
            message: "Succase password updated",
            user: updatedUser,
        };
    }
};
exports.ProfileService = ProfileService;
exports.ProfileService = ProfileService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, verification_service_1.VerificationService])
], ProfileService);
//# sourceMappingURL=profile.service.js.map