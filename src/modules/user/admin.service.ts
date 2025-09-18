// import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
// import { PrismaService } from 'src/core/prisma/prisma.service';
// import * as bcrypt from 'bcrypt';
// import * as fs from 'fs';
// import * as path from 'path';
// import {
//   CreateAdminDto,
//   CreateSellerDto,
//   CreateBuyerDto,
//   UpdateUserDto,
//   UpdateSellerPortfolioDto,
// } from './dto/create-user.dto';
// import { UserType as PrismaUserType } from '@prisma/client';

// @Injectable()
// export class UserService {
//   constructor(private prisma: PrismaService) {}

//   async createAdmin(dto: CreateAdminDto, imageUrl?: string) {
//     const exists = await this.prisma.users.findUnique({
//       where: { email: dto.email },
//     });
//     if (exists) throw new ConflictException('Email already in use');

//     const hashed = await bcrypt.hash(dto.password, 10);

//     const user = await this.prisma.users.create({
//       data: {
//         firstName: dto.firstName,
//         lastName: dto.lastName,
//         email: dto.email,
//         password: hashed,
//         role: PrismaUserType.ADMIN,
//         profileImg: imageUrl ?? null,
//       },
//       select: {
//         id: true,
//         firstName: true,
//         lastName: true,
//         email: true,
//         role: true,
//         profileImg: true,
//       },
//     });

//     return user;
//   }

//   async createSeller(dto: CreateSellerDto, imageUrl?: string) {
//     const exists = await this.prisma.users.findUnique({
//       where: { email: dto.email },
//     });
//     if (exists) throw new ConflictException('Email already in use');

//     const hashed = await bcrypt.hash(dto.password, 10);

//     const user = await this.prisma.users.create({
//       data: {
//         firstName: dto.firstName,
//         lastName: dto.lastName,
//         email: dto.email,
//         password: hashed,
//         role: PrismaUserType.SELL,
//         profileImg: imageUrl ?? null,
//       },
//       select: {
//         id: true,
//         firstName: true,
//         lastName: true,
//         email: true,
//         role: true,
//         profileImg: true,
//       },
//     });

//     return user;
//   }

//   async createBuyer(dto: CreateBuyerDto, imageUrl?: string) {
//     const exists = await this.prisma.users.findUnique({
//       where: { email: dto.email },
//     });
//     if (exists) throw new ConflictException('Email already in use');

//     const hashed = await bcrypt.hash(dto.password, 10);

//     const user = await this.prisma.users.create({
//       data: {
//         firstName: dto.firstName,
//         lastName: dto.lastName,
//         email: dto.email,
//         password: hashed,
//         role: PrismaUserType.BUY,
//         profileImg: imageUrl ?? null,
//       },
//       select: {
//         id: true,
//         firstName: true,
//         lastName: true,
//         email: true,
//         role: true,
//         profileImg: true,
//       },
//     });

//     return user;
//   }

//   async getAllUsers() {
//     const users = await this.prisma.users.findMany({
//       select: { id: true, firstName: true, lastName: true, email: true, role: true, profileImg: true },
//       orderBy: { firstName: 'asc' },
//     });
//     return users;
//   }

//   async getUserById(userId: string) {
//     const user = await this.prisma.users.findUnique({
//       where: { id: userId },
//       select: { id: true, firstName: true, lastName: true, email: true, role: true, profileImg: true },
//     });
//     if (!user) throw new NotFoundException('User not found');
//     return user;
//   }

//   async updateUser(dto: UpdateUserDto, fileName?: string) {
//     const user = await this.prisma.users.findUnique({ where: { id: dto.userId } });
//     if (!user) throw new NotFoundException('User not found');
  
//     // emailni tekshirish
//     if (dto.email && dto.email !== user.email) {
//       const emailExists = await this.prisma.users.findUnique({ where: { email: dto.email } });
//       if (emailExists && emailExists.id !== user.id) {
//         throw new ConflictException('Email already in use');
//       }
//     }
  
//     // role ADMIN qilib qo‘yishni bloklash
//     if (dto.role && dto.role === 'ADMIN') {
//       throw new ConflictException('Setting role to ADMIN is not allowed');
//     }
  
//     // eski profil rasmini o‘chirish
//     if (fileName && user.profileImg) {
//       const oldFilePath = path.join(process.cwd(), 'uploads', 'profiles', user.profileImg);
//       if (fs.existsSync(oldFilePath)) fs.unlinkSync(oldFilePath);
//     }
  
//     // parol yangilansa hash qilish
//     let hashedPassword: string | undefined;
//     if (dto.password) {
//       const bcrypt = await import('bcrypt');
//       hashedPassword = await bcrypt.hash(dto.password, 10);
//     }
  
//     const updated = await this.prisma.users.update({
//       where: { id: dto.userId },
//       data: {
//         ...(dto.firstName !== undefined ? { firstName: dto.firstName } : {}),
//         ...(dto.lastName !== undefined ? { lastName: dto.lastName } : {}),
//         ...(dto.email !== undefined ? { email: dto.email } : {}),
//         ...(dto.role !== undefined ? { role: dto.role as PrismaUserType } : {}),
//         ...(fileName ? { profileImg: fileName } : {}),
//         ...(hashedPassword ? { password: hashedPassword } : {}), // ✅ parolni yangilash
//       },
//       select: {
//         id: true,
//         firstName: true,
//         lastName: true,
//         email: true,
//         role: true,
//         profileImg: true,
//       },
//     });
  
//     return updated;
//   }
  

//   async deleteUser(userId: string) {
//     const user = await this.prisma.users.findUnique({ where: { id: userId } });
//     if (!user) throw new NotFoundException('User not found');

//     if (user.profileImg) {
//       const filePath = path.join(process.cwd(), 'uploads', 'profiles', user.profileImg);
//       if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
//     }

//     const deleted = await this.prisma.users.delete({ where: { id: userId } });

//     return deleted;
//   }

//   async updateSellerPortfolio(dto: UpdateSellerPortfolioDto, fileName?: string) {
//     const user = await this.prisma.users.findUnique({ where: { id: dto.userId } });
//     if (!user) throw new NotFoundException('User not found');
//     if (user.role !== PrismaUserType.SELL) throw new BadRequestException('User is not a seller');

//     if (dto.email && dto.email !== user.email) {
//       const emailExists = await this.prisma.users.findUnique({ where: { email: dto.email } });
//       if (emailExists && emailExists.id !== user.id) throw new ConflictException('Email already in use');
//     }

//     if (fileName && user.profileImg) {
//       const oldFilePath = path.join(process.cwd(), 'uploads', 'profiles', user.profileImg);
//       if (fs.existsSync(oldFilePath)) fs.unlinkSync(oldFilePath);
//     }

//     const updated = await this.prisma.users.update({
//       where: { id: dto.userId },
//       data: {
//         ...(dto.email !== undefined ? { email: dto.email } : {}),
//         ...(fileName ? { profileImg: fileName } : {}),
//       },
//       select: { id: true, firstName: true, lastName: true, email: true, role: true, profileImg: true },
//     });

//     return updated;
//   }

 


  

// }
