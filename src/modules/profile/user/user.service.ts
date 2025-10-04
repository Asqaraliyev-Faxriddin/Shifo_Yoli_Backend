import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Injectable()
export class PublicService {
  constructor(private readonly prisma: PrismaService) {}

  // 🔟 Top 10 doctor rating bo‘yicha
// 🔟 Top 10 doctor rating bo‘yicha
async getTopDoctors() {

  const ratedDoctors = await this.prisma.review.groupBy({
    by: ['doctorId'],
    _avg: { rating: true },
    orderBy: { _avg: { rating: 'desc' } },
    take: 10,
  });

  const ratedDoctorIds = ratedDoctors.map(d => d.doctorId);

  // 2. Agar baholanganlar soni < 10 bo‘lsa, qolganini baholanmagan DOCTOR lar bilan to‘ldirish
  const remainingCount = 10 - ratedDoctorIds.length;

  let unratedDoctors: any[] = [];
  if (remainingCount > 0) {
    unratedDoctors = await this.prisma.user.findMany({
      where: {
        role: 'DOCTOR',
        NOT: { id: { in: ratedDoctorIds } }, // baholanganlarni chiqarib tashlash
      },
      take: remainingCount,
      orderBy: { createdAt: 'asc' }, // eng eski yaratilganlarni olish
      include: {
        doctorProfile: {
          include: {
            category: true,
            salary: {
              select: { daily: true, weekly: true, monthly: true, yearly: true },
            },
          },
        },
        reviewsReceived: {
          select: {
            id: true,
            rating: true,
            comment: true,
            createdAt: true,
            user: { select: { id: true, firstName: true, lastName: true } },
          },
        },
      },
    });
  }

  // 3. Baholangan DOCTOR larni user bilan olish
  const ratedDoctorUsers = await this.prisma.user.findMany({
    where: { id: { in: ratedDoctorIds } },
    include: {
      doctorProfile: {
        include: {
          category: true,
          salary: {
            select: { daily: true, weekly: true, monthly: true, yearly: true },
          },
        },
      },
      reviewsReceived: {
        select: {
          id: true,
          rating: true,
          comment: true,
          createdAt: true,
          user: { select: { id: true, firstName: true, lastName: true } },
        },
      },
    },
  });

  // 4. Birlashtirib qaytarish
  return [...ratedDoctorUsers, ...unratedDoctors].slice(0, 10);
}

  // 🏆 Haftaning eng zo‘r doctori (oxirgi 7 kunda eng ko‘p review olgan)
  async getBestDoctorOfWeek() {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const doctor = await this.prisma.review.groupBy({
      by: ['doctorId'],
      where: { createdAt: { gte: sevenDaysAgo } },
      _avg: { rating: true },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 1,
    });

    if (doctor.length === 0) return null;

    return this.prisma.doctorProfile.findUnique({
      where: { doctorId: doctor[0].doctorId },
      include: {
        category: true,
        salary: {
          select: { daily: true, weekly: true, monthly: true, yearly: true },
        },
        doctor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            age: true,
            profileImg: true,
            role: true,
            reviewsReceived: {
              select: {
                id: true,
                rating: true,
                comment: true,
                createdAt: true,
                user: { select: { id: true, firstName: true, lastName: true } },
              },
            },
          },
        },
      },
    });
  }

  // ⭐ Eng ko‘p baholangan doctorlar (review soni bo‘yicha – 12 ta)
  async getMostReviewedDoctors() {
    const doctors = await this.prisma.review.groupBy({
      by: ['doctorId'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 12,
    });

    return this.prisma.doctorProfile.findMany({
      where: {
        doctorId: { in: doctors.map((d) => d.doctorId) },
      },
      include: {
        category: true,
        salary: {
          select: { daily: true, weekly: true, monthly: true, yearly: true },
        },
        doctor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            age: true,
            profileImg: true,
            role: true,
            reviewsReceived: {
              select: {
                id: true,
                rating: true,
                comment: true,
                createdAt: true,
                user: { select: { id: true, firstName: true, lastName: true } },
              },
            },
          },
        },
      },
    });
  }

  // 📂 Barcha category larni qaytarish
  async getCategories() {
    return this.prisma.doctorCategory.findMany({
      include: {
        doctors: {
          select: {
            id: true,
            bio: true,
            doctor: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                profileImg: true,
                reviewsReceived: {
                  select: {
                    id: true,
                    rating: true,
                    comment: true,
                    createdAt: true,
                    user: {
                      select: { id: true, firstName: true, lastName: true },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });
  }
}
