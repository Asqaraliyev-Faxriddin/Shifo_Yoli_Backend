import {
  Injectable,
  BadRequestException,
  NotFoundException, 
  ForbiddenException,
} from "@nestjs/common";
import { PrismaService } from "src/core/prisma/prisma.service";
import { CreateReviewDto, UpdateReviewDto } from "./dto/create-rating.dto";
import { UserRole } from "@prisma/client";

@Injectable()
export class ReviewService {
  constructor(private readonly prisma: PrismaService) {}

  // ✅ Create review
  async create(userId: string, dto: CreateReviewDto) {
    // 1. User mavjudmi?
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException("Foydalanuvchi topilmadi");

    // 2. Doctor mavjudmi va role = DOCTORmi?
    const doctor = await this.prisma.user.findUnique({
      where: { id: dto.doctorId },
    });
    if (!doctor || doctor.role !== UserRole.DOCTOR) {
      throw new BadRequestException("Doktor topilmadi yoki noto‘g‘ri role");
    }

    // ❌ O‘zini o‘zi baholash mumkin emas
    if (userId === dto.doctorId) {
      throw new ForbiddenException("O‘zingizni baholay olmaysiz");
    }

    // 3. Oldin baholanganmi?
    const existing = await this.prisma.review.findFirst({
      where: { userId, doctorId: dto.doctorId },
    });
    if (existing) {
      throw new BadRequestException("Siz bu doktorga allaqachon baho qo‘yganingiz");
    }

    // 4. Rating validatsiyasi (1-5)
    if (dto.rating < 1 || dto.rating > 5) {
      throw new BadRequestException("Reyting 1 dan 5 gacha bo‘lishi kerak");
    }

    return this.prisma.review.create({
      data: {
        userId,
        doctorId: dto.doctorId,
        rating: dto.rating,
        comment: dto.comment,
      },
    });
  }

  // ✅ Doktor bo‘yicha review lar (pagination + total count)
  async findAllByDoctor(doctorId: string, offset = 0, limit = 10) {
    const [items, total] = await this.prisma.$transaction([
      this.prisma.review.findMany({
        where: { doctorId },
        skip: offset,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { id: true, firstName: true, lastName: true } },
        },
      }),
      this.prisma.review.count({ where: { doctorId } }),
    ]);

    return {
      total,
      offset,
      limit,
      items,
    };
  }

  // ✅ Analitika (average, total, distribution, eng zo‘r 10 ta review, min/max rating)
  async getAnalytics(doctorId: string) {
    const reviews = await this.prisma.review.findMany({
      where: { doctorId },
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { id: true, firstName: true, lastName: true } },
      },
    });

    if (reviews.length === 0) {
      return {
        average: 0,
        total: 0,
        distribution: {},
        top10: [],
        best: null,
        worst: null,
      };
    }

    const total = reviews.length;
    const average =
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    const distribution: Record<number, number> = {};
    for (let i = 1; i <= 5; i++) {
      distribution[i] = reviews.filter((r) => r.rating === i).length;
    }

    const sortedByRating = [...reviews].sort((a, b) => b.rating - a.rating);
    const best = sortedByRating[0];
    const worst = sortedByRating[sortedByRating.length - 1];
    const top10 = sortedByRating.slice(0, 10);

    return { average, total, distribution, top10, best, worst };
  }

  // ✅ Review update (faqat egasi)
  async update(userId: string, reviewId: string, dto: UpdateReviewDto) {
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
    });
    if (!review) throw new NotFoundException("Review topilmadi");

    if (review.userId !== userId) {
      throw new ForbiddenException("Siz faqat o‘zingizning review ingizni tahrirlay olasiz");
    }

    if (dto.rating && (dto.rating < 1 || dto.rating > 5)) {
      throw new BadRequestException("Reyting 1 dan 5 gacha bo‘lishi kerak");
    }

    return this.prisma.review.update({
      where: { id: reviewId },
      data: {
        rating: dto.rating ?? review.rating,
        comment: dto.comment ?? review.comment,
      },
    });
  }

  // ✅ Delete (admin/superadmin)
// ✅ Delete (egasi yoki ADMIN/SUPERADMIN)
async remove(userId: string, reviewId: string) {
  const review = await this.prisma.review.findUnique({ where: { id: reviewId } });
  if (!review) throw new NotFoundException("Review topilmadi");

  // User’ni olish (role uchun)
  const user = await this.prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });
  if (!user) throw new NotFoundException("Foydalanuvchi topilmadi");

  // ❗ Tekshiruv:
  // - Agar o‘zi qo‘shgan bo‘lsa → ruxsat
  // - Yoki ADMIN/SUPERADMIN bo‘lsa → ruxsat
  // @ts-ignore
  if (review.userId !== userId && !["ADMIN", "SUPERADMIN"].includes(user.role)) {
    throw new ForbiddenException("Siz bu reviewni o‘chira olmaysiz");
  }

  return this.prisma.review.delete({ where: { id: reviewId } });
}

}
