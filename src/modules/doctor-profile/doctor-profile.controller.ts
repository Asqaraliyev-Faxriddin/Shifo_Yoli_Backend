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
  Req,
  UnsupportedMediaTypeException,
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
import { FileFieldsInterceptor, FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
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
  @ApiOperation({ summary: 'Doctor profili yaratish (Admin)' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        {
          name: 'images',
          maxCount: 10,
        },
        {
          name: 'videos',
          maxCount: 5,
        },
      ],
      {
        storage: diskStorage({
          destination: (req, file, cb) => {
            if (file.fieldname === 'images') cb(null, './uploads/images');
            else if (file.fieldname === 'videos') cb(null, './uploads/videos');
          },
          filename: (req, file, cb) => {
            const uniqueSuffix =
              Date.now() + '-' + Math.round(Math.random() * 1e9);
            cb(
              null,
              `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`,
            );
          },
        }),
        fileFilter: (req, file, cb) => {
          if (file.fieldname === 'images') {
            if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
              return cb(
                new UnsupportedMediaTypeException(
                  'Faqat rasm fayllar yuklash mumkin',
                ),
                false,
              );
            }
          }
          if (file.fieldname === 'videos') {
            if (!file.mimetype.match(/\/(mp4|avi|mov|mkv)$/)) {
              return cb(
                new UnsupportedMediaTypeException(
                  'Faqat video fayllar yuklash mumkin',
                ),
                false,
              );
            }
          }
          cb(null, true);
        },
        limits: { fileSize: 150 * 1024 * 1024 }, // 150MB
      },
    ),
  )
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  async createProfile(
    @Param('userId') userId: string,
    @Body() dto: CreateDoctorProfileDto,
    @UploadedFiles()
    files: {
      images?: Express.Multer.File[];
      videos?: Express.Multer.File[];
    },
  ) {
    const images = (files?.images ?? []).map((f) =>
      f?.filename ? `images/${f.filename}` : '',
    );
    const videos = (files?.videos ?? []).map((f) =>
      f?.filename ? `videos/${f.filename}` : '',
    );

    return this.doctorProfileService.create(userId, dto, images, videos);
  }

  // ===================== UPDATE PROFILE =====================
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
  @Patch('update/:id')
  @ApiOperation({ summary: 'Doctor profilini yangilash (Admin)' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'images', maxCount: 10 },
        { name: 'videos', maxCount: 5 },
        { name: 'files', maxCount: 3 },
      ],
      {
        storage: diskStorage({
          destination: (req, file, cb) => {
            if (file.fieldname === 'images') cb(null, './uploads/images');
            else if (file.fieldname === 'videos') cb(null, './uploads/videos');
            else if (file.fieldname === 'files') cb(null, './uploads/files');
          },
          filename: (req, file, cb) => {
            const uniqueSuffix =
              Date.now() + '-' + Math.round(Math.random() * 1e9);
            cb(
              null,
              `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`,
            );
          },
        }),
        fileFilter: (req, file, cb) => {
          if (file.fieldname === 'images') {
            if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
              return cb(
                new UnsupportedMediaTypeException('Faqat rasm fayllar yuklash mumkin'),
                false,
              );
            }
          } else if (file.fieldname === 'videos') {
            if (!file.mimetype.match(/\/(mp4|avi|mov|mkv)$/)) {
              return cb(
                new UnsupportedMediaTypeException('Faqat video fayllar yuklash mumkin'),
                false,
              );
            }
          } else if (file.fieldname === 'files') {
            if (!file.mimetype.match(/\/(pdf|docx?|txt)$/)) {
              return cb(
                new UnsupportedMediaTypeException('Faqat hujjat fayllar yuklash mumkin (pdf, docx, txt)'),
                false,
              );
            }
          }
          cb(null, true);
        },
        limits: { fileSize: 150 * 1024 * 1024 }, // 150MB
      },
    ),
  )
  async updateProfile(
    @Param('id') id: string,
    @Body() dto: UpdateDoctorProfileDto,
    @UploadedFiles()
    files: {
      images?: Express.Multer.File[];
      videos?: Express.Multer.File[];
      files?: Express.Multer.File[];
    },
  ) {
    const images = (files?.images ?? []).map((f) =>
      f?.filename ? `images/${f.filename}` : '',
    );
    const videos = (files?.videos ?? []).map((f) =>
      f?.filename ? `videos/${f.filename}` : '',
    );
    const docs = (files?.files ?? []).map((f) =>
      f?.filename ? `files/${f.filename}` : '',
    );
  
    return this.doctorProfileService.update(id, dto, images, videos, docs);
  }
  
  


  @Post('create/doctor')
  @ApiOperation({ summary: 'Doctor profili yaratish (Admin)' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        {
          name: 'images',
          maxCount: 10,
        },
        {
          name: 'videos',
          maxCount: 5,
        },
      ],
      {
        storage: diskStorage({
          destination: (req, file, cb) => {
            if (file.fieldname === 'images') cb(null, './uploads/images');
            else if (file.fieldname === 'videos') cb(null, './uploads/videos');
          },
          filename: (req, file, cb) => {
            const uniqueSuffix =
              Date.now() + '-' + Math.round(Math.random() * 1e9);
            cb(
              null,
              `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`,
            );
          },
        }),
        fileFilter: (req, file, cb) => {
          if (file.fieldname === 'images') {
            if (!file.mimetype.match(/image\/(jpg|jpeg|png|gif|webp)$/)) {
              return cb(
                new UnsupportedMediaTypeException(
                  'Faqat rasm fayllar yuklash mumkin',
                ),
                false,
              );
            }
          }
          if (file.fieldname === 'videos') {
            if (!file.mimetype.match(/\/(mp4|avi|mov|mkv)$/)) {
              return cb(
                new UnsupportedMediaTypeException(
                  'Faqat video fayllar yuklash mumkin',
                ),
                false,
              );
            }
          }
          cb(null, true);
        },
        limits: { fileSize: 150 * 1024 * 1024 }, // 150MB
      },
    ),
  )
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  async createProfileDoctor(
    @Req() req,
    @Body() dto: CreateDoctorProfileDto,
    @UploadedFiles()
    files: {
      images?: Express.Multer.File[];
      videos?: Express.Multer.File[];
    },
  ) {
    const images = (files?.images ?? []).map((f) =>
      f?.filename ? `images/${f.filename}` : '',
    );
    const videos = (files?.videos ?? []).map((f) =>
      f?.filename ? `videos/${f.filename}` : '',
    );

    return this.doctorProfileService.create2(req.user.id, dto, images, videos);
  }

  // ===================== UPDATE PROFILE =====================
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.SUPERADMIN, UserRole.DOCTOR, UserRole.ADMIN)
  @Patch('update/doctor/profile')
  @ApiOperation({ summary: 'Doctor profilini yangilash (Admin)' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'images', maxCount: 10 },
        { name: 'videos', maxCount: 5 },
        { name: 'files', maxCount: 3 },
      ],
      {
        storage: diskStorage({
          destination: (req, file, cb) => {
            if (file.fieldname === 'images') cb(null, './uploads/images');
            else if (file.fieldname === 'videos') cb(null, './uploads/videos');
            else if (file.fieldname === 'files') cb(null, './uploads/files');
          },
          filename: (req, file, cb) => {
            const uniqueSuffix =
              Date.now() + '-' + Math.round(Math.random() * 1e9);
            cb(
              null,
              `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`,
            );
          },
        }),
        fileFilter: (req, file, cb) => {
          if (file.fieldname === 'images') {
            if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
              return cb(
                new UnsupportedMediaTypeException('Faqat rasm fayllar yuklash mumkin'),
                false,
              );
            }
          } else if (file.fieldname === 'videos') {
            if (!file.mimetype.match(/\/(mp4|avi|mov|mkv)$/)) {
              return cb(
                new UnsupportedMediaTypeException('Faqat video fayllar yuklash mumkin'),
                false,
              );
            }
          } else if (file.fieldname === 'files') {
            if (!file.mimetype.match(/\/(pdf|docx?|txt)$/)) {
              return cb(
                new UnsupportedMediaTypeException('Faqat hujjat fayllar yuklash mumkin (pdf, docx, txt)'),
                false,
              );
            }
          }
          cb(null, true);
        },
        limits: { fileSize: 150 * 1024 * 1024 }, // 150MB
      },
    ),
  )
  async updateProfileDoctor(
    @Req() req,
    @Body() dto: UpdateDoctorProfileDto,
    @UploadedFiles()
    files: {
      images?: Express.Multer.File[];
      videos?: Express.Multer.File[];
      files?: Express.Multer.File[];
    },
  ) {
    const images = (files?.images ?? []).map((f) =>
      f?.filename ? `images/${f.filename}` : '',
    );
    const videos = (files?.videos ?? []).map((f) =>
      f?.filename ? `videos/${f.filename}` : '',
    );
    const docs = (files?.files ?? []).map((f) =>
      f?.filename ? `files/${f.filename}` : '',
    );
  
    return this.doctorProfileService.update2(req.user.id, dto, images, videos, docs);
  }
  



  // ===================== UPDATE PROFILE =====================


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



  @Roles(UserRole.DOCTOR, UserRole.ADMIN, UserRole.SUPERADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({ summary: "Doktorning bemorlarini olish" })
  @Get('doctor/patients')
  async DocktorProfileBemors(@Req() req) {
    return this.doctorProfileService.getDoctorPatients(req.user.id)
  }


  @Roles(UserRole.DOCTOR, UserRole.ADMIN, UserRole.SUPERADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({ summary: "Doktor Bemorni profili haqida ma'lumot olish" })
  @Get('doctor/patient/profile/:id')
  async DoctorByBemor(@Param('id') id: string) {
    return this.doctorProfileService.GetByUser(id)

  }

}
