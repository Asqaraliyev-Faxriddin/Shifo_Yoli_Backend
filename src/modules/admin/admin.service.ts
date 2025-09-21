import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from "@nestjs/common";
import { PrismaService } from "src/core/prisma/prisma.service";
import {
  CreateAdminDto,
  UpdateAdminDto,
  BlockUserDto,
  UnblockUserDto,
} from "./dto/create-admin.dto";
import { UserRole } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  // ================= CREATE ADMIN =================
  async create(createAdminDto: CreateAdminDto, profileImgUrl?: string) {
    const exists = await this.prisma.user.findUnique({
      where: { email: createAdminDto.email },
    });
    if (exists) {
      throw new BadRequestException("Bunday email bilan foydalanuvchi mavjud");
    }

    return this.prisma.user.create({
      data: {
        email: createAdminDto.email,
        firstName: createAdminDto.firstName,
        lastName: createAdminDto.lastName,
        password: createAdminDto.password, // ❗parol keyin hash qilinishi kerak
        age: createAdminDto.age,
        profileImg: profileImgUrl ?? null,
        role: UserRole.ADMIN,
      },
    });
  }

  // ================= FIND ALL =================
  async findAll() {
    return this.prisma.user.findMany({
      where: { role: UserRole.ADMIN },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        age: true,
        profileImg: true,
        role: true,
      },
    });
  }

  // ================= FIND ONE =================
  async findOne(id: string) {
    const admin = await this.prisma.user.findUnique({
      where: { id, role: UserRole.ADMIN },
    });
    if (!admin) throw new NotFoundException("Admin topilmadi");
    return admin;
  }

  // ================= UPDATE =================
  async update(id: string, dto: UpdateAdminDto, profileImgUrl?: string) {
    const admin = await this.prisma.user.findUnique({ where: { id } });
    if (!admin || admin.role !== UserRole.ADMIN) {
      throw new NotFoundException("Admin topilmadi");
    }

    return this.prisma.user.update({
      where: { id },
      data: {
        firstName: dto.firstName ?? admin.firstName,
        lastName: dto.lastName ?? admin.lastName,
        password: dto.password ?? admin.password, // ❗hash qilish kerak
        age: dto.age ?? admin.age,
        profileImg: profileImgUrl ?? admin.profileImg,
      },
    });
  }

  // ================= REMOVE =================
  async remove(id: string) {
    const admin = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!admin || admin.role !== UserRole.ADMIN) {
      throw new NotFoundException("Admin topilmadi");
    }

    return this.prisma.user.delete({ where: { id } });
  }

  // ================= BLOCK USER =================
  async blockUser(dto: BlockUserDto) {
    // User mavjudligini tekshiramiz
    const user = await this.prisma.user.findUnique({
      where: { id: dto.userId },
    });
    if (!user) throw new NotFoundException("User topilmadi");

    // Agar allaqachon block bo‘lsa
    const blocked = await this.prisma.blockedUsers.findUnique({
      where: { userId: dto.userId },
    });
    if (blocked) {
      throw new BadRequestException("Bu user allaqachon block qilingan");
    }

    return this.prisma.blockedUsers.create({
      data: {
        userId: dto.userId,
        reason: dto.reason ?? null,
      },
    });
  }

  // ================= UNBLOCK USER =================
  async unblockUser(dto: UnblockUserDto) {
    const blocked = await this.prisma.blockedUsers.findUnique({
      where: { userId: dto.userId },
    });
    if (!blocked) throw new NotFoundException("User block qilinmagan");

    return this.prisma.blockedUsers.delete({
      where: { userId: dto.userId },
    });
  }
}
