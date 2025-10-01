// src/modules/doctor-profile/doctor-profile.controller.ts

import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  UploadedFiles,
  UseInterceptors,
  UploadedFile,
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
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@ApiTags('Doctor Profile')
@Controller('doctor-profile')
export class DoctorProfileController {
  constructor(private readonly doctorProfileService: DoctorProfileService) {}

  // ✅ Profil yaratish
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
    }),
  )
  async createProfile(
    @Param('userId') userId: string,
    @Body() dto: CreateDoctorProfileDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const images = files ? files.map((f) => `images/${f.filename}`) : [];
    return this.doctorProfileService.create(userId, dto, images);
  }

  // ✅ Profil yangilash
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
    }),
  )
  async updateProfile(
    @Param('id') id: string,
    @Body() dto: UpdateDoctorProfileDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const images = files ? files.map((f) => `images/${f.filename}`) : [];
    return this.doctorProfileService.update(id, dto, images);
  }

  // ✅ Profil o‘chirish
  @Delete('delete/:id')
  @ApiOperation({ summary: 'Doctor profilini o‘chirish' })
  async deleteProfile(@Param('id') id: string) {
    return this.doctorProfileService.remove(id);
  }

  // ✅ Rasm qo‘shish
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
    }),
  )
  async addImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const dto: AddImageDto = { image: `images/${file.filename}` };
    return this.doctorProfileService.addImage(id, dto);
  }

  // ✅ Rasm o‘chirish
  @Delete('remove-image/:id')
  @ApiOperation({ summary: 'Profil rasmini o‘chirish' })
  async removeImage(@Param('id') id: string, @Body() dto: RemoveImageDto) {
    return this.doctorProfileService.removeImage(id, dto);
  }

  // ✅ Video qo‘shish
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
    }),
  )
  async addVideo(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const dto: AddVideoDto = { video: `videos/${file.filename}` };
    return this.doctorProfileService.addVideo(id, dto);
  }

  // ✅ Video o‘chirish
  @Delete('remove-video/:id')
  @ApiOperation({ summary: 'Profil videosini o‘chirish' })
  async removeVideo(@Param('id') id: string, @Body() dto: RemoveVideoDto) {
    return this.doctorProfileService.removeVideo(id, dto);
  }
}
