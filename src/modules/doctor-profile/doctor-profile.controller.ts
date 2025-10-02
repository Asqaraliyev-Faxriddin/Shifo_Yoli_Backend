import {
  Controller,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
  UseGuards,
  BadRequestException,
  Query,
  Get,
} from '@nestjs/common';
import { DoctorProfileService } from './doctor-profile.service';
import {
  CreateDoctorProfileDto,
  UpdateDoctorProfileDto,
  AddImageDto,
  RemoveImageDto,
  AddVideoDto,
  RemoveVideoDto,
} from './dto/create-doctor-profile.dto';
import { ApiTags, ApiOperation, ApiConsumes, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/Roles.decorator';
import { UserRole } from '@prisma/client';
import { FindDoctorProfilesDto } from './dto/update-doctor-profile.dto';

@ApiBearerAuth()
@ApiTags('Doctor Profile')
@Controller('doctor-profile')
export class DoctorProfileController {
  constructor(private readonly doctorProfileService: DoctorProfileService) { }

  private static imageFileFilter = (req: any, file: Express.Multer.File, cb: Function) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new BadRequestException('Faqat rasm fayllar qabul qilinadi!'), false);
    }
    cb(null, true);
  };

  private static videoFileFilter = (req: any, file: Express.Multer.File, cb: Function) => {
    if (!file.mimetype.startsWith('video/')) {
      return cb(new BadRequestException('Faqat video fayllar qabul qilinadi!'), false);
    }
    cb(null, true);
  };

  @Post('create/:userId')
  @ApiOperation({ summary: 'Doctor profili yaratish' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage: diskStorage({
        destination: './uploads/images',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
      fileFilter: DoctorProfileController.imageFileFilter,
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    }),
  )
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.DOCTOR, UserRole.ADMIN, UserRole.SUPERADMIN)
  async createProfile(
    @Param('userId') userId: string,
    @Body() dto: CreateDoctorProfileDto,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    const images = (files ?? []).map((f) => f?.filename ? `images/${f.filename}` : "");
    return this.doctorProfileService.create(userId, dto, images);
  }

  // ===================== UPDATE PROFILE =====================
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.DOCTOR, UserRole.ADMIN, UserRole.SUPERADMIN)
  @Patch('update/:id')
  @ApiOperation({ summary: 'Doctor profilini yangilash' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage: diskStorage({
        destination: './uploads/images',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
      fileFilter: DoctorProfileController.imageFileFilter,
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    }),
  )
  async updateProfile(
    @Param('id') id: string,
    @Body() dto: UpdateDoctorProfileDto,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    const images = (files ?? []).map((f) => f?.filename ? `images/${f.filename}` : "");
    return this.doctorProfileService.update(id, dto, images);
  }

  // ===================== ADD IMAGE =====================
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.DOCTOR, UserRole.ADMIN, UserRole.SUPERADMIN)
  @Post('add-image/:id')
  @ApiOperation({ summary: 'Profilga rasm qo‘shish' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/images',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
      fileFilter: DoctorProfileController.imageFileFilter,
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    }),
  )
  async addImage(@Param('id') id: string, @UploadedFile() file?: Express.Multer.File) {
    const dto: AddImageDto = { image: file?.filename ? `images/${file.filename}` : "" };
    return this.doctorProfileService.addImage(id, dto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.DOCTOR, UserRole.ADMIN, UserRole.SUPERADMIN)
  @Post('add-video/:id')
  @ApiOperation({ summary: 'Profilga video qo‘shish' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('video', {
      storage: diskStorage({
        destination: './uploads/videos',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
      fileFilter: DoctorProfileController.videoFileFilter,
      limits: { fileSize: 100 * 1024 * 1024 }, 
    }),
  )
  async addVideo(@Param('id') id: string, @UploadedFile() file?: Express.Multer.File) {
    const dto: AddVideoDto = { video: file?.filename ? `videos/${file.filename}` : "" };
    return this.doctorProfileService.addVideo(id, dto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.DOCTOR, UserRole.ADMIN, UserRole.SUPERADMIN)
  @Delete('remove-image/:id')
  @ApiOperation({ summary: 'Profil rasmini o‘chirish' })
  async removeImage(@Param('id') id: string, @Body() dto: RemoveImageDto) {
    return this.doctorProfileService.removeImage(id, dto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.DOCTOR, UserRole.ADMIN, UserRole.SUPERADMIN)
  @Delete('remove-video/:id')
  @ApiOperation({ summary: 'Profil videosini o‘chirish' })
  async removeVideo(@Param('id') id: string, @Body() dto: RemoveVideoDto) {
    return this.doctorProfileService.removeVideo(id, dto);
  }


  @Get()
  @ApiOperation({ summary: 'Doctor profillarni qidirish va olish' })
  @ApiResponse({
    status: 200,
    description: 'Doctor profillar muvaffaqiyatli olindi',
    schema: {
      example: {
        success: true,
        message: 'Doctor profiles muvaffaqiyatli topildi',
        total: 25,
        page: 1,
        limit: 10,
        data: [
          {
            id: 'uuid',
            bio: 'Experienced cardiologist',
            published: true,
            createdAt: '2025-10-02T12:00:00.000Z',
            updatedAt: '2025-10-02T12:00:00.000Z',
            category: {
              id: 'uuid',
              name: 'Cardiology',
              img: 'category.png',
            },
            doctor: {
              id: 'uuid',
              email: 'doctor@example.com',
              firstName: 'Ali',
              lastName: 'Valiyev',
              age: 35,
              phoneNumber: '+998901234567',
              role: 'DOCTOR',
              profileImg: 'doctor.png',
              isActive: true,
              createdAt: '2025-10-02T12:00:00.000Z',
              updatedAt: '2025-10-02T12:00:00.000Z',
            },
          },
        ],
      },
    },
  })
  async DoctorProfiles(@Query() query: FindDoctorProfilesDto) {
    return this.doctorProfileService.DoctorProfiles(query);
  }
}
