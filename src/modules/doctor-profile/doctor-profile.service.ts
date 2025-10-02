// src/modules/doctor-profile/doctor-profile.service.ts

import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
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
import { FindDoctorProfilesDto } from './dto/update-doctor-profile.dto';
import { publish } from 'rxjs';

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

  async update(
    id: string,
    dto: UpdateDoctorProfileDto,
    images?: string[],
    videos?: string[],
  ) {
    const doctor = await this.prisma.doctorProfile.findUnique({ where: { id } });
    if (!doctor) throw new NotFoundException('Doctor profile not found');
  
    // ✅ Faqat mavjud maydonlarni update qilish
    const data: any = {};
    if (dto.bio !== undefined) data.bio = dto.bio;
    if (dto.dailySalary !== undefined) data.dailySalary = dto.dailySalary;
    if (dto.free !== undefined) data.free = dto.free;
    if (dto.categoryId !== undefined) data.categoryId = dto.categoryId;
    if (images && images.length) data.images = images;
    if (videos && videos.length) data.videos = videos;
  
    await this.prisma.doctorProfile.update({
      where: { id },
      data,
    });
  
    // ✅ SuperAdmin’larni olish
    const superAdmins = await this.prisma.user.findMany({
      where: { role: 'SUPERADMIN' },
    });
  
    // 🎯 Har bir SuperAdmin’ga email yuborish
    await Promise.all(
      superAdmins.map((admin) =>
        this.mailerService.sendNotificationEmail(
            admin.email,
          `Manashu doctor Profilini yangiladi email : ${data.email}  ` ,
          `Doctor profili yangilandi: ${id}`,
        ),
      ),
    );
  
    return {
      success: true,
      message: 'Doctor profili muvaffaqiyatli yangilandi va SuperAdmin’larga siz yangilaniz haqida xabar yuborildi',
      data
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

      let olddoctor = await this.prisma.user.findFirst({
        where:{
          role:"DOCTOR",
          id:doctor.doctorId
        }
       })

       if(!olddoctor){

        throw new UnauthorizedException("Bunday doctor mavjud emas")
       }

    await this.prisma.doctorProfile.delete({ where: { id } });

    // ✅ SuperAdmin’larni olish
    const superAdmins = await this.prisma.user.findMany({
      where: { role: 'SUPERADMIN' },
    });
  


   

    // 🎯 Har bir SuperAdmin’ga email yuborish
    await Promise.all(
      superAdmins.map((admin) =>
        this.mailerService.sendNotificationEmail(
            admin.email,
          `Manashu doctor  email : ${olddoctor.email}  ` ,
          `Doctor profilini o'chirdi yangilandi: ${id}`,
        ),
      ),
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
    if (!doctor) throw new NotFoundException('Doctor profile topilmadi');

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
    if (!doctor) throw new NotFoundException('Doctor profile topilmadi');

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
    if (!doctor) throw new NotFoundException('Doctor profile topilmadi');

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



  async doctorProfile(id:string){

    let data  = await this.prisma.doctorProfile.findFirst({
      where:{id},
    })

    if(!data) throw new NotFoundException("Doctor profile topilmadi")

    return {
      success:true,
      message:"Doctor profile muvaffaqiyatli topildi",
      data
    }

  }

  async DoctorProfiles(payload: FindDoctorProfilesDto) {
    const {
      email,
      firstName,
      lastName,
      minAge,
      maxAge,
      categoryName,
      limit = 10,
      offset = 1,
    } = payload;
  
    // filter shartlari
    const where: any = {
      published:true,
      doctor: {
        
        email: email ? { contains: email, mode: "insensitive" } : undefined,
        firstName: firstName ? { contains: firstName, mode: "insensitive" } : undefined,
        lastName: lastName ? { contains: lastName, mode: "insensitive" } : undefined,
        age: {
          gte: minAge ?? undefined,
          lte: maxAge ?? undefined,
        },
      },
      category: categoryName
        ? { name: { contains: categoryName, mode: "insensitive" } }
        : undefined,
    };
  
    const [data, total] = await this.prisma.$transaction([
      this.prisma.doctorProfile.findMany({
        where,
        skip: (offset - 1) * limit,
        take: limit,
        include: {
          category: true,
          doctor: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              age: true,
              phoneNumber: true,
              role: true,
              profileImg: true,
              isActive: true,
              createdAt: true,
              updatedAt: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      this.prisma.doctorProfile.count({ where }),
    ]);
  
    return {
      success: true,
      message: "Doctor profiles muvaffaqiyatli topildi",
      total,
      page: offset,
      limit,
      data,
    };
  }
  

}
