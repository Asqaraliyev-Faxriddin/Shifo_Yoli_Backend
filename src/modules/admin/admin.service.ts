import {
    Injectable,
    NotFoundException,
    BadRequestException,
  } from "@nestjs/common";
  import { PrismaService } from "src/core/prisma/prisma.service";
  import {
    CreateAdminDto,
    CreateDoctorDto,
    CreatePatientDto,
    UpdateUserDto,
    DeleteUserDto,
    SearchUserDto,
    SendNotificationDto,
    BroadcastNotificationDto,
    UserPaymentDto,
    MassPaymentDto,
  } from "./dto/create-admin.dto";
  import { UserRole, TransactionType, PaymentType } from "@prisma/client";
  import { Decimal } from "@prisma/client/runtime/library";
  import * as bcrypt from "bcrypt";
  import { AppMailerService } from "src/common/mailer/mailer.service";
  
  @Injectable()
  export class AdminService {
    constructor(
      private readonly prisma: PrismaService,
      private readonly mailerService: AppMailerService,
    ) {}
  
    async createAdmin(dto: CreateAdminDto, profileImgUrl?: string) {
      await this.ensureEmailUnique(dto.email);
      const hashed = await bcrypt.hash(dto.password, 10);
  
      return this.prisma.user.create({
        data: {
          ...dto,
          password: hashed,
          profileImg: profileImgUrl ?? null,
          role: UserRole.ADMIN,
          wallet: { create: { balance: new Decimal(2000) } },
        },
        include: { wallet: true },
      });
    }
  
    async createDoctor(dto: CreateDoctorDto, profileImgUrl?: string) {
      await this.ensureEmailUnique(dto.email);
      const hashed = await bcrypt.hash(dto.password, 10);
  
      return this.prisma.user.create({
        data: {
          ...dto,
          password: hashed,
          profileImg: profileImgUrl ?? null,
          role: UserRole.DOCTOR,
          doctorProfile: {
            create: {
              categoryId: dto.categoryId,
              bioUz: dto.bio,
              images: dto.images ? JSON.stringify(dto.images) : "[]",
              videos: dto.videos ? JSON.stringify(dto.videos) : "[]",
              salary: {
                create: {
                  daily: new Decimal(dto.dailySalary),
                  weekly: new Decimal(Number(dto.dailySalary) * 7),
                  monthly: new Decimal(Number(dto.dailySalary) * 30),
                  yearly: new Decimal(Number(dto.dailySalary) * 365),
                },
              },
            },
          },
          wallet: { create: { balance: new Decimal(2000) } },
        },
        include: {
          doctorProfile: { include: { salary: true, category: true } },
          wallet: true,
        },
      });
    }
  
    async createPatient(dto: CreatePatientDto, profileImgUrl?: string) {
      await this.ensureEmailUnique(dto.email);
      const hashed = await bcrypt.hash(dto.password, 10);
  
      return this.prisma.user.create({
        data: {
          ...dto,
          password: hashed,
          profileImg: profileImgUrl ?? null,
          role: UserRole.BEMOR,
          wallet: { create: { balance: new Decimal(2000) } },
        },
        include: { wallet: true },
      });
    }
  
    private async searchUsers(dto: SearchUserDto, role: UserRole) {
      const { firstName, lastName, email, ageFrom, ageTo, categoryId, page, limit } = dto;
      const skip = (page - 1) * limit;
      const where: any = { role };
  
      if (email) where.email = { contains: email, mode: "insensitive" };
      if (firstName) where.firstName = { contains: firstName, mode: "insensitive" };
      if (lastName) where.lastName = { contains: lastName, mode: "insensitive" };
      if (ageFrom || ageTo) {
        where.age = {};
        if (ageFrom) where.age.gte = ageFrom;
        if (ageTo) where.age.lte = ageTo;
      }
      if (role === UserRole.DOCTOR && categoryId) {
        where.doctorProfile = { categoryId };
      }
  
      const [data, total] = await Promise.all([
        this.prisma.user.findMany({
          where,
          skip,
          take: limit,

          orderBy: { createdAt: "desc" },
          include: { blockedUser:true,devices:true,doctorProfile: { include: { category: true } }, wallet: true,  },
        }),
        this.prisma.user.count({ where }),
      ]);
  
      return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
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
  
    async updateUser(id: string, dto: UpdateUserDto, profileImgUrl?: string) {
      const user = await this.prisma.user.findUnique({ where: { id } });
      if (!user) throw new NotFoundException("User topilmadi");
  
      return this.prisma.user.update({
        where: { id },
        data: { ...dto, profileImg: profileImgUrl ?? user.profileImg },
      });
    }
  
    async deleteUser(dto: DeleteUserDto) {
      const user = await this.prisma.user.findUnique({
        where: { id: dto.userId },
        include: { doctorProfile: true },
      });
      if (!user) throw new NotFoundException("User topilmadi");
  
      if (user.role === UserRole.DOCTOR && user.doctorProfile) {
        await this.prisma.doctorProfile.delete({ where: { doctorId: user.id } });
      }
  
      return this.prisma.user.delete({ where: { id: dto.userId } });
    }
  
    async addFunds(dto: UserPaymentDto) {
      return this.updateWallet(dto.userId, dto.amount, TransactionType.CREDIT);
    }
  
    async deductFunds(dto: UserPaymentDto) {
      return this.updateWallet(dto.userId, -dto.amount, TransactionType.DEBIT);
    }
  
    async massPayment(dto: MassPaymentDto) {
      const users = await this.prisma.user.findMany({ where: { role: dto.role as UserRole } });
  
      await Promise.all(users.map((u) => this.updateWallet(u.id, dto.amount, TransactionType.CREDIT)));
  
      return { success: true, count: users.length };
    }
  
    async massDeduction(dto: MassPaymentDto) {
      const users = await this.prisma.user.findMany({ where: { role: dto.role as UserRole } });
      console.log(users);
      
      if(dto.amount > 0) throw new BadRequestException("Miqdor manfiy bo'lishi kerak")
      
      await Promise.all(
        users.map(u => {
          if (u.email) {
            return this.updateWallet(u.id, dto.amount, TransactionType.DEBIT);
          } else {
            console.warn(`User ${u.id} uchun email yo'q, pul hisoblandi, lekin email yuborilmadi.`);
            return this.updateWallet(u.id, dto.amount, TransactionType.DEBIT);
          }
        })
      );
      
      return { success: true, count: users.length };
    }
  
    private async updateWallet(userId: string, amount: number, type: TransactionType) {
      let wallet = await this.prisma.wallet.findUnique({ where: { userId } });
      if (!wallet) {
        wallet = await this.prisma.wallet.create({ data: { userId, balance: new Decimal(0) } });
      }
  
      const newBalance = new Decimal(wallet.balance).plus(amount);
  
      await this.prisma.wallet.update({ where: { id: wallet.id }, data: { balance: newBalance } });
  
      await this.prisma.walletTransaction.create({
        data: {
          walletId: wallet.id,
          type,
          amount: new Decimal(Math.abs(amount)),
          source: PaymentType.COMPANY,
        },
      });
  
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      console.log("user",user);
      
      if (user && user.email) {
        const subject =
          type === TransactionType.CREDIT ? "Hisobingiz to‘ldirildi" : "Hisobingizdan mablag‘ yechildi";
        const message =
          type === TransactionType.CREDIT
            ? `Hisobingizga ${amount} so‘m tushdi. Yangi balans: ${newBalance.toNumber()} so‘m.`
            : `Hisobingizdan ${Math.abs(amount)} so‘m ayrildi. Yangi balans: ${newBalance.toNumber()} so‘m.`;
  
        await this.mailerService.sendNotificationEmail(user.email, subject, message);

        return  {message:"succase"}
      }
  
      return { userId, balance: newBalance.toNumber() };
    }
  
    // ===================== NOTIFICATIONS =====================
    async sendNotification(dto: SendNotificationDto) {
      const user = await this.prisma.user.findUnique({ where: { id: dto.userId } });
      if (!user) throw new NotFoundException("User topilmadi");
  
      return this.prisma.userNotification.create({
        data: { userId: dto.userId, message: dto.message },
      });
    }
  
    async broadcastNotification(dto: BroadcastNotificationDto) {
      const users = await this.prisma.user.findMany();
      if (!users.length) throw new NotFoundException("Hech qanday user topilmadi");
  
      await this.prisma.userNotification.createMany({
        data: users.map((u) => ({ userId: u.id, message: dto.message })),
      });
  
      return { success: true, count: users.length };
    }
  
    async blockUser(userId: string, reason?: string) {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      if (!user) throw new NotFoundException("User topilmadi");
  
      await this.prisma.blockedUsers.create({
        data: { userId, reason },
      });
  
      await this.prisma.user.update({ where: { id: userId }, data: { isActive: false } });
  
      await this.sendNotificationEmail(user.email, "Profilingiz bloklandi", reason ?? "Sizning profilingiz bloklandi.");
  
      return { success: true };
    }
  
    async unblockUser(userId: string) {
      const blocked = await this.prisma.blockedUsers.findUnique({ where: { userId } });
      if (!blocked) throw new NotFoundException("User bloklanmagan");
  
      await this.prisma.blockedUsers.delete({ where: { userId } });
  
      await this.prisma.user.update({ where: { id: userId }, data: { isActive: true } });
  
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      if (user) {
        await this.sendNotificationEmail(user.email, "Profilingiz faollashtirildi", "Profilingiz blokdan chiqarildi.");
      }
  
      return { success: true };
    }
  
    async blockDevice(deviceId: string, reason?: string) {
      const device = await this.prisma.device.findUnique({ where: { deviceId } });
      if (!device) throw new NotFoundException("Device topilmadi");
  
      await this.prisma.blockedUsers.create({
        data: { deviceId, reason, userId: device.userId },
      });
  
      const user = await this.prisma.user.findUnique({ where: { id: device.userId } });
      if (user) {
        await this.sendNotificationEmail(
          user.email,
          "Qurilmangiz bloklandi",
          reason ?? "Sizning qurilmangiz bloklandi."
        );
      }
  
      return { success: true };
    }
  
    async unblockDevice(deviceId: string) {
      const blocked = await this.prisma.blockedUsers.findFirst({ where: { deviceId } });
      if (!blocked) throw new NotFoundException("Device bloklanmagan");
  
      await this.prisma.blockedUsers.delete({ where: { id: blocked.id } });
  
      const device = await this.prisma.device.findUnique({ where: { deviceId } });
      if (device) {
        const user = await this.prisma.user.findUnique({ where: { id: device.userId } });
        if (user) {
          await this.sendNotificationEmail(user.email, "Qurilmangiz blokdan chiqarildi", "Qurilmangiz endi faol.");
        }
      }
  
      return { success: true };
    }
  
    async toggleDoctorPublish(doctorId: string, published: boolean) {
      const doctor = await this.prisma.doctorProfile.findUnique({ where: { doctorId } });
      if (!doctor) throw new NotFoundException("Doktor topilmadi");
  
      return this.prisma.doctorProfile.update({ where: { doctorId }, data: { published } });
    }
  
    private async ensureEmailUnique(email: string): Promise<boolean> {
      const exists = await this.prisma.user.findUnique({ where: { email } });
      if (exists) throw new BadRequestException("Bunday email mavjud");
      return true;
    }
  
    private async sendNotificationEmail(to: string, subject: string,message: string,date: Date = new Date(), ) {
      await this.mailerService.sendNotificationEmail(to, subject, message, date);
   return    
  }


  async BlokdeviceAll(){
    let data = await this.prisma.blockedUsers.findMany({include:{user:true,device:true}})

    return {
        status:true,
        message:"Barcha bloklangan qurilmalar",
        data
    }
  }
  


  async BlokuserAll(){

    let data = await this.prisma.device.findMany({include:{user:true,blockedUsers:true}})

    return {
        status:true,
        message:"Barcha devicelar",
        data
    }

  }

}