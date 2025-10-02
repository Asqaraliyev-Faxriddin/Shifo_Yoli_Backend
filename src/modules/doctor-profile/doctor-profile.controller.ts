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
import { ApiTags, ApiOperation, ApiConsumes, ApiBearerAuth } from '@nestjs/swagger';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/Roles.decorator';
import { UserRole } from '@prisma/client';

@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Roles(UserRole.DOCTOR, UserRole.SUPERADMIN, UserRole.ADMIN)
@ApiTags('Doctor Profile')
@Controller('doctor-profile')
export class DoctorProfileController {
  constructor(private readonly doctorProfileService: DoctorProfileService) {}

  // ===================== Helper functions =====================
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

  // ===================== CREATE PROFILE =====================
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
  async createProfile(
    @Param('userId') userId: string,
    @Body() dto: CreateDoctorProfileDto,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    const images = (files ?? []).map((f) => f?.filename ? `images/${f.filename}` : "");
    return this.doctorProfileService.create(userId, dto, images);
  }

  // ===================== UPDATE PROFILE =====================
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
      limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
    }),
  )
  async addVideo(@Param('id') id: string, @UploadedFile() file?: Express.Multer.File) {
    const dto: AddVideoDto = { video: file?.filename ? `videos/${file.filename}` : "" };
    return this.doctorProfileService.addVideo(id, dto);
  }

  // ===================== REMOVE IMAGE =====================
  @Delete('remove-image/:id')
  @ApiOperation({ summary: 'Profil rasmini o‘chirish' })
  async removeImage(@Param('id') id: string, @Body() dto: RemoveImageDto) {
    return this.doctorProfileService.removeImage(id, dto);
  }

  // ===================== REMOVE VIDEO =====================
  @Delete('remove-video/:id')
  @ApiOperation({ summary: 'Profil videosini o‘chirish' })
  async removeVideo(@Param('id') id: string, @Body() dto: RemoveVideoDto) {
    return this.doctorProfileService.removeVideo(id, dto);
  }
}
