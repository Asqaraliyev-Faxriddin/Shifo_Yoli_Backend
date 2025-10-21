import { Injectable, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { UserRole, DeviceType } from '@prisma/client'; // Prisma enum import

@Injectable()
export class SeaderService {
  private readonly logger = new Logger(SeaderService.name);

  constructor(private prisma: PrismaService) {}

  async CreateSuperadmin() {
    const password = await bcrypt.hash('11201123', 10);

    const usersData = [
      {
        firstName: 'Faxriddin',
        lastName: 'Asqaraliyev',
        age: 15,
        email: 'asqaraliyevfaxriddin2011@gmail.com',
        role: UserRole.SUPERADMIN,
        password,
      },
      {
        firstName: 'Biror',
        lastName: 'Kim',
        age: 25,
        email: 'asqaraliyevfaxriddin2009@gmail.com',
        role: UserRole.DOCTOR,
        password,
      },
      {
        firstName: 'Sayfiddin',
        lastName: "G'ulomov",
        age: 24,
        email: 'asqaraliyevfaxriddin001@gmail.com',
        role: UserRole.DOCTOR,
        password,
      },
      {
        firstName: 'Men',
        lastName: 'Sen',
        age: 24,
        email: 'asqaraliyevfaxriddin222@gmail.com',
        role: UserRole.BEMOR,
        password,
      },
    ];

    // 🔹 1. Foydalanuvchilarni yaratamiz
    await this.prisma.user.createMany({
      data: usersData,
      skipDuplicates: true,
    });

    // 🔹 2. Har bir user uchun device yaratamiz
    const users = await this.prisma.user.findMany({
      where: { email: { in: usersData.map((u) => u.email) } },
    });

    for (const user of users) {
      // agar oldin device yozuv mavjud bo‘lsa, o‘tkazib yuboramiz
      const existing = await this.prisma.device.findFirst({
        where: { userId: user.id },
      });

      if (!existing) {
        await this.prisma.device.create({
          data: {
            userId: user.id,
            deviceId: `reg-${user.id}`, // deviceId unikal bo‘lishi kerak
            name: `${user.firstName}'s device`,
            platform: 'seed-script',
            deviceType: DeviceType.register,
          },
        });
      }
    }

    this.logger.log('✅ SUPERADMIN, DOCTOR, BEMOR va ularning DEVICE yozuvlari yaratildi.');
  }
}
