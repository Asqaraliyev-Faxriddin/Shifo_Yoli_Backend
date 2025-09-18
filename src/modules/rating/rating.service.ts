// reviews.service.ts
import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CreateReviewDto } from './dto/create-rating.dto'; 

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateReviewDto) {
    // Doctor mavjudligini tekshirish
    const doctor = await this.prisma.user.findUnique({
      where: { id: dto.doctorId },
    });
    if (!doctor) throw new NotFoundException('Doctor topilmadi');

    // Oldin baho berganmi?
    const existing = await this.prisma.review.findFirst({
      where: { userId, doctorId: dto.doctorId },
    });
    if (existing) throw new ForbiddenException('Siz allaqachon baho bergansiz, update qiling');

    const review = await this.prisma.review.create({
      data: {
        userId,
        doctorId: dto.doctorId,
        rating: dto.rating,
        comment: dto.comment,
      },
    });

    await this.recalculateDoctorRating(dto.doctorId);
    return review;
  }

  async update(userId: string, id: string, dto: CreateReviewDto) {
    const review = await this.prisma.review.findUnique({ where: { id } });
    if (!review) throw new NotFoundException('Review topilmadi');
    if (review.userId !== userId) throw new ForbiddenException('Siz faqat o‘zingizning reviewni update qilasiz');

    const updated = await this.prisma.review.update({
      where: { id },
      data: {
        rating: dto.rating,
        comment: dto.comment,
      },
    });

    await this.recalculateDoctorRating(updated.doctorId);
    return updated;
  }

  async remove(userId: string, id: string) {
    const review = await this.prisma.review.findUnique({ where: { id } });
    if (!review) throw new NotFoundException('Review topilmadi');
    if (review.userId !== userId) throw new ForbiddenException('Siz faqat o‘zingizning reviewni o‘chira olasiz');

    await this.prisma.review.delete({ where: { id } });
    await this.recalculateDoctorRating(review.doctorId);
    return { message: 'O‘chirildi' };
  }

  /// Doctor ratingni qayta hisoblash
  private async recalculateDoctorRating(doctorId: string) {
    const reviews = await this.prisma.review.findMany({
      where: { doctorId },
    });

    const avg = reviews.length
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

    await this.prisma.doctorProfile.update({
      where: { doctorId },
      data: { rating: avg },
    });
  }

  /// Top 10 doktor
  async getTop10() {
    return this.prisma.doctorProfile.findMany({
      orderBy: { rating: 'desc' },
      take: 10,
      include: { doctor: true },
    });
  }

  /// Eng yuqori rating doktor (1 ta)
  async getBestDoctor() {
    return this.prisma.doctorProfile.findFirst({
      orderBy: { rating: 'desc' },
      include: { doctor: true },
    });
  }
}
