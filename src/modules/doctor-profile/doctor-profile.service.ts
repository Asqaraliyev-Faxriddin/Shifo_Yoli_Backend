// src/modules/doctor-profile/doctor-profile.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import {
  CreateDoctorProfileDto,
  UpdateDoctorProfileDto,
  AddImageDto,
  RemoveImageDto,
  AddVideoDto,
  RemoveVideoDto,
} from './dto/create-doctor-profile.dto';
import * as fs from 'fs';
import * as path from 'path';
import { AppMailerService } from 'src/common/mailer/mailer.service';

@Injectable()
export class DoctorProfileService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailerService: AppMailerService,
  ) {}

  private deleteFileFromUploads(filePath: string) {
    try {
      const fullPath = path.join(process.cwd(), 'uploads', filePath);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    } catch (err) {
      console.error('❌ File delete error:', err.message);
    }
  }


  async create(userId: string,dto: CreateDoctorProfileDto,images?: string[], videos?: string[],) {
    await this.prisma.doctorProfile.create({
      data: {
        bio: dto.bio,
        categoryId: dto.categoryId,
        images: images ?? [],
        videos: videos ?? [],
        doctorId: userId,
      },
    });

    // 🎯 Email yuborish
    await this.mailerService.sendNotificationEmail(
      'admin@example.com',
      'Yangi Doctor Profile',
      `Yangi doctor profili yaratildi: ${dto.bio || 'Bio kiritilmagan'}`,
    );

    return {
      success: true,
      message: 'Doctor profili muvaffaqiyatli yaratildi',
    };
  }

  // ✅ Profilni yangilash
  async update(
    id: string,
    dto: UpdateDoctorProfileDto,
    images?: string[],
    videos?: string[],
  ) {
    const doctor = await this.prisma.doctorProfile.findUnique({ where: { id } });
    if (!doctor) throw new NotFoundException('Doctor profile not found');

    await this.prisma.doctorProfile.update({
      where: { id },
      data: {
        ...dto,
        ...(images ? { images } : {}),
        ...(videos ? { videos } : {}),
      },
    });

    // 🎯 Email yuborish
    await this.mailerService.sendNotificationEmail(
      'admin@example.com',
      'Doctor Profile yangilandi',
      `Doctor profili yangilandi: ${id}`,
    );

    return {
      success: true,
      message: 'Doctor profili muvaffaqiyatli yangilandi',
    };
  }

  // ✅ Profilni o‘chirish
  async remove(id: string) {
    const doctor = await this.prisma.doctorProfile.findUnique({ where: { id } });
    if (!doctor) throw new NotFoundException('Doctor profile not found');

    (Array.isArray(doctor.images) ? doctor.images : [])
      .filter((img): img is string => typeof img === 'string')
      .forEach((img) => this.deleteFileFromUploads(img));

    (Array.isArray(doctor.videos) ? doctor.videos : [])
      .filter((vid): vid is string => typeof vid === 'string')
      .forEach((vid) => this.deleteFileFromUploads(vid));

    await this.prisma.doctorProfile.delete({ where: { id } });

    // 🎯 Email yuborish
    await this.mailerService.sendNotificationEmail(
      'admin@example.com',
      'Doctor Profile o‘chirildi',
      `Doctor profili o‘chirildi: ${id}`,
    );

    return {
      success: true,
      message: 'Doctor profili muvaffaqiyatli o‘chirildi',
    };
  }

  // ✅ Rasm qo‘shish
  async addImage(id: string, dto: AddImageDto) {
    const doctor = await this.prisma.doctorProfile.findUnique({ where: { id } });
    if (!doctor) throw new NotFoundException('Doctor profile not found');

    const updatedImages = [
      ...(Array.isArray(doctor.images) ? doctor.images : []),
      dto.image,
    ];

    await this.prisma.doctorProfile.update({
      where: { id },
      data: { images: updatedImages },
    });

    return {
      success: true,
      message: 'Rasm muvaffaqiyatli qo‘shildi',
    };
  }

  // ✅ Rasm o‘chirish
  async removeImage(id: string, dto: RemoveImageDto) {
    const doctor = await this.prisma.doctorProfile.findUnique({ where: { id } });
    if (!doctor) throw new NotFoundException('Doctor profile not found');

    this.deleteFileFromUploads(dto.image);

    const updatedImages = (Array.isArray(doctor.images) ? doctor.images : []).filter(
      (img) => img !== dto.image,
    );

    await this.prisma.doctorProfile.update({
      where: { id },
      data: { images: updatedImages },
    });

    return {
      success: true,
      message: 'Rasm muvaffaqiyatli o‘chirildi',
    };
  }

  // ✅ Video qo‘shish
  async addVideo(id: string, dto: AddVideoDto) {
    const doctor = await this.prisma.doctorProfile.findUnique({ where: { id } });
    if (!doctor) throw new NotFoundException('Doctor profile not found');

    const updatedVideos = [
      ...(Array.isArray(doctor.videos) ? doctor.videos : []),
      dto.video,
    ];

    await this.prisma.doctorProfile.update({
      where: { id },
      data: { videos: updatedVideos },
    });

    return {
      success: true,
      message: 'Video muvaffaqiyatli qo‘shildi',
    };
  }

  // ✅ Video o‘chirish
  async removeVideo(id: string, dto: RemoveVideoDto) {
    const doctor = await this.prisma.doctorProfile.findUnique({ where: { id } });
    if (!doctor) throw new NotFoundException('Doctor profile not found');

    this.deleteFileFromUploads(dto.video);

    const updatedVideos = (Array.isArray(doctor.videos) ? doctor.videos : []).filter(
      (vid) => vid !== dto.video,
    );

    await this.prisma.doctorProfile.update({
      where: { id },
      data: { videos: updatedVideos },
    });

    return {
      success: true,
      message: 'Video muvaffaqiyatli o‘chirildi',
    };
  }
}
