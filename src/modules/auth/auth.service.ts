import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { JwtAccesToken, JwtRefreshToken } from "src/common/config/jwt";
import { Token_activate } from "src/common/types/token";
import { PrismaService } from "src/core/prisma/prisma.service";
import { RegisterDto } from "./dto/register.dto";
import { GooglePass, LoginDto } from "./dto/login.dto";
import { VerificationService } from "../verification/verification.service";
import { EverificationTypes } from "src/common/types/verification";
import * as bcrypt from "bcrypt";
import { RefreshTokenDto } from "./dto/refresh.token.dto";
import { Reset_Password } from "./dto/reset-password";
import { UserRole, DeviceType } from "@prisma/client";
import { randomBytes, randomUUID } from "crypto";
import { Request } from "express";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtServise: JwtService,
    private verificationService: VerificationService
  ) {}

  async generateToken(payload: Token_activate, onlyAccess = false) {
    const AccessToken = await this.jwtServise.signAsync(payload, JwtAccesToken);
    const RefreshToken = await this.jwtServise.signAsync(payload, JwtRefreshToken);

    if (onlyAccess) {
      return {AccessToken};
    } else {
      return {
        AccessToken,
        RefreshToken,
      };
    }
  }

  async register(payload: Required<RegisterDto>, req: Request) {
    const { firstName, lastName, otp, email, password, age } = payload;

    await this.verificationService.checkConfirmOtp({
      email,
      type: EverificationTypes.REGISTER,
      otp,
    });

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        firstName,
        lastName,
        age,
        email,
        role: UserRole.BEMOR,
        password: hashPassword,
      },
    });


      
    await this.saveDevice(user.id, req, DeviceType.register);

    const tokens = await this.generateToken({ id: user.id, role: user.role });

    return {
      status: true,
      message: "User successfully registered",
      data: user,
      tokens,
    };
  }

  async login(payload: LoginDto, req: Request) {
    const user = await this.PhoneAndPasswordCheck(payload.password, payload.email);

    await this.saveDevice(user.id, req, DeviceType.login);

    const tokens = await this.generateToken({ id: user.id, role: user.role });

    return {
      status: true,
      message: "Login successful",
      tokens,
    };
  }

  async RefresholdAcces(token: RefreshTokenDto) {
    try {
      const oldId = await this.jwtServise.verifyAsync(token.token, JwtRefreshToken);
      
      if (!oldId) throw new UnauthorizedException();
      
      const checkUser = await this.prisma.user.findFirst({ where: { id: oldId.id } });
      if (!checkUser) throw new UnauthorizedException();
      
      const AccessToken = await this.generateToken(
        { id: checkUser.id, role: checkUser.role },
        true
      );
      
      return { AccessToken };
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }
  
  async reset_password(payload: Required<Reset_Password>) {
    
    const { otp, email, password } = payload;

    await this.verificationService.checkConfirmOtp({
      email,
      type: EverificationTypes.RESET_PASSWORD,
      otp,
    });

    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new NotFoundException("User not found");

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

  async googleLogin(user: any, req: Request) {
    if (!user) {
      throw new UnauthorizedException();
    }
  
    const randomPassword = randomBytes(16).toString("hex");
  
    let existingUser = await this.prisma.user.findUnique({
      where: { email: user.email },
    });
  
    if (!existingUser) {
      existingUser = await this.prisma.user.create({
        data: {
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          age: user.age ?? 10, 
          profileImg: user.picture ?? "",
          role: UserRole.BEMOR,
          password: randomPassword,
        },
      });
    } else {
      existingUser = await this.prisma.user.update({
        where: { id: existingUser.id },
        data: {
          profileImg: user.picture ?? existingUser.profileImg,
          age: user.age ?? existingUser.age,
        },
      });
    }
  
    await this.saveDevice(existingUser.id, req, DeviceType.login);
  
    const tokens = await this.generateToken({
      id: existingUser.id,
      role: existingUser.role,
    });
  
    return {
      status: true,
      message: 'Google login successful',
      data: existingUser,
      tokens,
    };
  }
  

  async PhoneAndPasswordCheck(password: string, email: string) {
    const oldUser = await this.prisma.user.findUnique({ where: { email } });

    if (!oldUser) throw new NotFoundException("Email not found");

    let checkPassword: boolean;
    if (oldUser.password.startsWith("$2b$")) {
      checkPassword = await bcrypt.compare(password, oldUser.password);
    } else {
      checkPassword = password === oldUser.password;
    }

    if (!checkPassword) {
      throw new BadRequestException("Password Incorrect or Email not found");
    }

    return oldUser;
  }

  async googlePassword(payload:GooglePass, userId:string) {

    let data = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!data) throw new NotFoundException("User topilmadi");

    let hashPassword = await bcrypt.hash(payload.password, 10);

    data = await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashPassword,age:payload.age },
    });

    return {
      status: true,
      message: "Parol muvaffaqiyatli o'zgartirildi",
      data,
    };


  }




  private async saveDevice(userId: string, req: Request, type: DeviceType) {
   
    if (!req) return console.log("Request object is not available");
    ;                                     
   
    const userAgent = req.headers["user-agent"] || "unknown";
    const ip =  req.ip || (req.headers["x-forwarded-for"] as string) || "unknown";


      const existingDevice = await this.prisma.device.findFirst({
        where: {
          userId,
      
             address: ip ,
             name: userAgent ,
          
        },
      });
      
      if (existingDevice) {
        console.log(existingDevice);
        
        return console.log("Device already exists, not saving a new one.");
        
      }
    await this.prisma.device.create({
      data: {
        userId,
        deviceId: randomUUID(),
        name: userAgent,
        platform: this.detectPlatform(userAgent),
        address: ip,
        deviceType: type,
      },
    });
  }

  private detectPlatform(userAgent: string): string {
    userAgent = userAgent.toLowerCase();
  
    if (/android/i.test(userAgent)) return "android";
    if (/iphone|ipad|ipod/i.test(userAgent)) return "ios";
  
    if (/windows nt/i.test(userAgent)) return "windows";
    if (/mac os x/i.test(userAgent)) return "macos";
    if (/ubuntu/i.test(userAgent)) return "ubuntu";
    if (/debian/i.test(userAgent)) return "debian";
    if (/fedora/i.test(userAgent)) return "fedora";
    if (/centos/i.test(userAgent)) return "centos";
    if (/red hat/i.test(userAgent)) return "redhat";
    if (/linux/i.test(userAgent)) return "linux"; 
  
    if (/googlebot/i.test(userAgent)) return "googlebot";
    if (/bingbot/i.test(userAgent)) return "bingbot";
    if (/duckduckbot/i.test(userAgent)) return "duckduckbot";
  
    return "web";
  }
  
}
