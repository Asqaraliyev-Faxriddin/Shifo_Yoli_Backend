import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { SearchUserDto } from 'src/modules/admin/dto/create-admin.dto';

@Injectable()
export class PublicService {
  constructor(private readonly prisma: PrismaService) {}

  // 🔟 Top 10 doctor rating bo‘yicha
// 🔟 Top 10 doctor rating bo‘yicha (faqat doctorProfile mavjud va published=true)
async getTopDoctors() {
  // 1. Baholangan doktorlarni olish
  const ratedDoctors = await this.prisma.review.groupBy({
    by: ['doctorId'],
    _avg: { rating: true },
    orderBy: { _avg: { rating: 'desc' } },
    take: 10,
  });

  const ratedDoctorIds = ratedDoctors.map((d) => d.doctorId);

  // 2. Baholangan doktorlarni olish (faqat doctorProfile bor va published=true)
  const ratedDoctorUsers = await this.prisma.user.findMany({
    where: {
      id: { in: ratedDoctorIds },
      role: 'DOCTOR',
      doctorProfile: {
        is: {
          published: true, // faqat doctorProfile mavjud va published = true
        },
      },
    },
    
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

  const remainingCount = 10 - ratedDoctorUsers.length;

  // 3. Yetishmagan joyni baholanmagan DOCTOR lar bilan to‘ldirish
  let unratedDoctors: any[] = [];
  if (remainingCount > 0) {
    unratedDoctors = await this.prisma.user.findMany({
      where: {
        role: 'DOCTOR',
        doctorProfile: {
          is: {
            published: true,   // faqat doctorProfile mavjud va published = true
          },
        },
         // 🔥 faqat doctorProfile bor va published
        NOT: { id: { in: ratedDoctorIds } }, // baholanganlarni chiqarib tashlash
      },
      take: remainingCount,
      orderBy: { createdAt: 'asc' }, // eski ro‘yxatdan olish (xohlasa o‘zgartirish mumkin)
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

    if(role == UserRole.DOCTOR){
      where.doctorProfile = {published:true}
    }

    if (role === UserRole.DOCTOR && categoryId) {
      where.doctorProfile = { categoryId, };
    }

    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,

        orderBy: { createdAt: "desc" },
        include: { doctorProfile: { include: { category: true ,salary:true} }, wallet: true,  },
      }),
      this.prisma.user.count({ where }),
    ]);

    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }


  async doctorsAll(dto:SearchUserDto){
    return this.searchUsers(dto,UserRole.DOCTOR)

  }


  async doctorOne(id:string){
    let olddoctor = await this.prisma.user.findFirst({
      where:{
        role:"DOCTOR",
        id
      },
      include:{
        doctorProfile:{
          include:{
            category:true,
            salary:true
          }
        },

        

      }
    })

    if(!olddoctor) throw new NotFoundException("Doktor Topilmadi")
      

      return {
        data:olddoctor
      }

  
  
    }

}
