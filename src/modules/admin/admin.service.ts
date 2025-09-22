import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "src/core/prisma/prisma.service";
import {
  CreateAdminDto,
  UpdateAdminDto,
  BlockUserDto,
  UnblockUserDto,
  CreateDoctorDto,
  CreatePatientDto,
} from "./dto/create-admin.dto";
import { SearchUserDto } from "./dto/update-admin.dto";
import { UserRole } from "@prisma/client";

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
        password: createAdminDto.password, // ❗ keyinchalik hash qilinsin
        age: createAdminDto.age,
        profileImg: profileImgUrl ?? null,
        role: UserRole.ADMIN,
      },
    });
  }

// ================= SEARCH USERS (universal) =================
private async searchUsers(dto: SearchUserDto, role: UserRole) {
  const { firstName, lastName, email, ageFrom, ageTo, page, limit } = dto;

  const skip = (page - 1) * limit;

  const where: any = { role };

  if (email) {
    where.email = { contains: email, mode: "insensitive" };
  }

  if (firstName) {
    where.firstName = { contains: firstName, mode: "insensitive" };
  }

  if (lastName) {
    where.lastName = { contains: lastName, mode: "insensitive" };
  }

  if (ageFrom || ageTo) {
    where.age = {};
    if (ageFrom) where.age.gte = ageFrom;
    if (ageTo) where.age.lte = ageTo;
  }

  const [data, total] = await Promise.all([
    this.prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        age: true,
        profileImg: true,
        role: true,
        createdAt: true,
      },
    }),
    this.prisma.user.count({ where }),
  ]);

  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}

  async findAllAdmins(dto: SearchUserDto) {
    return this.searchUsers(dto, UserRole.ADMIN);
  }

  async findAllDoctors(dto: SearchUserDto) {
    return this.searchUsers(dto, UserRole.DOCTOR);
  }

  async findAllPatients(dto: SearchUserDto) {
    return this.searchUsers(dto, UserRole.BEMOR);
  }

  async findOneAdmin(id: string) {
    const admin = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!admin || admin.role !== UserRole.ADMIN) {
      throw new NotFoundException("Admin topilmadi");
    }
    return admin;
  }

  async updateAdmin(id: string, dto: UpdateAdminDto, profileImgUrl?: string) {
    const admin = await this.prisma.user.findUnique({ where: { id } });
    if (!admin || admin.role !== UserRole.ADMIN) {
      throw new NotFoundException("Admin topilmadi");
    }

    return this.prisma.user.update({
      where: { id },
      data: {
        firstName: dto.firstName ?? admin.firstName,
        lastName: dto.lastName ?? admin.lastName,
        password: dto.password ?? admin.password,
        age: dto.age ?? admin.age,
        profileImg: profileImgUrl ?? admin.profileImg,
      },
    });
  }

  // ================= DELETE ADMIN =================
  async deleteAdmin(id: string) {
    const admin = await this.prisma.user.findUnique({ where: { id } });
    if (!admin || admin.role !== UserRole.ADMIN) {
      throw new NotFoundException("Admin topilmadi");
    }
    return this.prisma.user.delete({ where: { id } });
  }

  // ================= DELETE DOCTOR =================
  async deleteDoctor(id: string) {
    const doctor = await this.prisma.user.findUnique({ where: { id } });
    if (!doctor || doctor.role !== UserRole.DOCTOR) {
      throw new NotFoundException("Doctor topilmadi");
    }
    return this.prisma.user.delete({ where: { id } });
  }

  // ================= DELETE BEMOR =================
  async deletePatient(id: string) {
    const patient = await this.prisma.user.findUnique({ where: { id } });
    if (!patient || patient.role !== UserRole.BEMOR) {
      throw new NotFoundException("Bemor topilmadi");
    }
    return this.prisma.user.delete({ where: { id } });
  }

  // ================= BLOCK USER =================
  async blockUser(dto: BlockUserDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: dto.userId },
    });
    if (!user) throw new NotFoundException("User topilmadi");

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



  async createDoctor(dto: CreateDoctorDto, profileImgUrl?: string) {
    const exists = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (exists) {
      throw new BadRequestException("Bunday email bilan foydalanuvchi mavjud");
    }

    return this.prisma.user.create({
      data: {
        email: dto.email,
        firstName: dto.firstName,
        lastName: dto.lastName,
        password: dto.password, // ❗ keyinchalik hash qilinsin
        age: dto.age,
        profileImg: profileImgUrl ?? null,
        role: UserRole.DOCTOR,
        doctorProfile: {
          create: {
            category: {
              connect: { id: dto.categoryId }, // doctor kategoriyasini ulash
            },
          },
        },
      },
      include: {
        doctorProfile: {
          include: { category: true },
        },
      },
    });
  }

// ================= CREATE PATIENT =================
async createPatient(dto: CreatePatientDto, profileImgUrl?: string) {
  const exists = await this.prisma.user.findUnique({ where: { email: dto.email } });
  if (exists) {
    throw new BadRequestException("Bunday email bilan foydalanuvchi mavjud");
  }

  return this.prisma.user.create({
    data: {
      email: dto.email,
      firstName: dto.firstName,
      lastName: dto.lastName,
      password: dto.password, // ❗ keyinchalik hash qilinsin
      age: dto.age,
      profileImg: profileImgUrl ?? null,
      role: UserRole.BEMOR,
    },
  });
}



}

