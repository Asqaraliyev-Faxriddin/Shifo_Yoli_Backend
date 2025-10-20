// src/modules/doctor-profile/doctor-profile.service.ts

import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
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


  private  parseBoolean = (val: any) => {
    if (val === "true" || val === true) return true;
    if (val === "false" || val === false) return false;
    return undefined; // yoki null
  };


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
   
    let oldtr = await this.prisma.doctorProfile.findFirst({
      where:{
        doctorId:userId
      }
     })

     if(oldtr){

      throw new UnauthorizedException("Sizda allaqachon doctor profile mavjud")
     }

     let user = await this.prisma.user.findFirst({
      where:{
        role:"DOCTOR",
        id:userId
      }
     })

     if(!user){

      throw new UnauthorizedException("Bunday doctor mavjud emas")
    }

    
    let olduser = await this.prisma.doctorProfile.create({
      data: {
        bio: dto.bio,
        categoryId: dto.categoryId,
        images: images ?? [],
        videos: videos ?? [],
        doctorId: userId,
        futures:dto.futures,
        

    
      },

    });

    if(dto.dailySalary){

      await this.prisma.doctorSalary.create({
        data:{
          daily:dto.dailySalary,
          weekly:dto.dailySalary * 7,
          monthly:dto.dailySalary * 30,
          yearly:dto.dailySalary * 365,
          doctorId:olduser.id
        }
      })
    }

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
    files?:string[]
  ) {
    const doctor = await this.prisma.doctorProfile.findUnique({ where: { id } });
    if (!doctor) throw new NotFoundException('Doctor profile not found');
  
    const data: any = {};
  
    // ✅ Bio
    if (dto.bio !== undefined) {
      data.bio = dto.bio;
    }
  
    // ✅ CategoryId bo‘lsa — tekshir
    if (dto.categoryId !== undefined) {
      if (dto.categoryId.trim()) {
        const categoryExists = await this.prisma.doctorCategory.findUnique({
          where: { id: dto.categoryId },
        });
        if (!categoryExists) {
          throw new BadRequestException('Bunday kategoriya mavjud emas');
        }
        data.categoryId = dto.categoryId;
      } else {
        data.categoryId = doctor.categoryId;
      }
    }
  
    // ✅ Images
    if (images && images.length) {
      data.images = images;
    }

    if (files && files.length) {
      data.files = files;
    }
  
    // ✅ Videos
    if (videos && videos.length) {
      data.videos = videos;
    }
  
    // ✅ Futures
    if (dto.futures !== undefined) {
      data.futures = dto.futures;
    }
  
    // ✅ DoctorProfile ni yangilash
    await this.prisma.doctorProfile.update({
      where: { id },
      data,
    });
  
    // ✅ Maoshni tekshir va yangilash
    if (dto.dailySalary !== undefined || dto.free !== undefined) {
      const existingSalary = await this.prisma.doctorSalary.findFirst({
        where: { doctorId: id },
      });
  
      const salaryData: any = {};
      if (dto.dailySalary !== undefined) {
        salaryData.daily = dto.dailySalary;
        salaryData.weekly = dto.dailySalary * 7;
        salaryData.monthly = dto.dailySalary * 30;
        salaryData.yearly = dto.dailySalary * 365;
      }
  
      if (dto.free !== undefined) {
        salaryData.free = this.parseBoolean(dto.free);
      }
  
      if (existingSalary) {
        await this.prisma.doctorSalary.update({
          where: { id: existingSalary.id },
          data: salaryData,
        });
      } else {
        await this.prisma.doctorSalary.create({
          data: {
            ...salaryData,
            doctorId: id,
          },
        });
      }
    }
  
    // ✅ SuperAdminlarga email yuborish
    const superAdmins = await this.prisma.user.findMany({
      where: { role: 'SUPERADMIN' },
    });
  
    await Promise.all(
      superAdmins.map((admin) =>
        this.mailerService.sendNotificationEmail(
          admin.email,
          `Doktor profili yangilandi`,
          `Doctor profili yangilandi: ${id}`,
        ),
      ),
    );
  
    return {
      success: true,
      message:
        'Doctor profili muvaffaqiyatli yangilandi va SuperAdmin’larga xabar yuborildi',
      data,
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
  

  async getDoctorPatients(doctorId: string) {
    // 1️⃣ Doctor mavjudligini tekshiramiz
    const doctor = await this.prisma.user.findUnique({
      where: { id: doctorId },
    });
  
    if (!doctor) throw new NotFoundException('Doctor topilmadi');
    if (doctor.role === 'BEMOR') {
      throw new BadRequestException('Siz Shifokor emassiz');
    }
  
    // 2️⃣ To‘lov qilgan bemorlarni topamiz
    const paidPatients = await this.prisma.dailyDoctorAccess.findMany({
      where: { doctorId },
      include: { patient: true },
    });
  
    // 3️⃣ Chat orqali yozishgan bemorlar
    const chatPatients = await this.prisma.chat.findMany({
      where: {
        participants: {
          some: { userId: doctorId },
        },
      },
      include: {
        participants: {
          include: {
            user: true,
          },
        },
      },
    });
  
    // 4️⃣ Chatdagi foydalanuvchilarni chiqaramiz (faqat bemorlar, lekin o‘zini emas)
    const chattedPatients = chatPatients
      .flatMap((chat) => chat.participants.map((p) => p.user))
      .filter(
        (u) =>
          u.id !== doctorId && // 🔥 o‘zini chiqarib tashlash
          (u.role === 'BEMOR' || u.role === 'SUPERADMIN' || u.role === 'ADMIN')
      );
  
    // 5️⃣ To‘lov qilgan bemorlar
    const paidPatientUsers = paidPatients
      .map((p) => p.patient)
      .filter((p) => p.id !== doctorId); // 🔥 o‘zini chiqarib tashlash
  
    // 6️⃣ Birlashtirib, dublikatlarni olib tashlash
    const allPatientsMap = new Map<string, any>();
    [...paidPatientUsers, ...chattedPatients].forEach((p) => {
      allPatientsMap.set(p.id, p);
    });
  
    const allPatients = Array.from(allPatientsMap.values());
    const total = allPatients.length;
  
    return {
      message: 'Doctor bemorlari olindi.',
      total,
      data: allPatients,
    };
  }
  
  

  async GetByUser(userId:string){
    let olduser = await this.prisma.user.findFirst({
      where:{id:userId,role:"BEMOR"},
      select:{
        id:true,
        email:true,
        firstName:true,
        lastName:true,
        age:true,
        phoneNumber:true,
        role:true,
        profileImg:true,
        isActive:true,
        createdAt:true,
      }
    })

    if(!olduser){

      throw new UnauthorizedException("Bunday bemor mavjud emas")
     }

     return {
      data:olduser
     }

  }

  

}
