import { 
  Controller, 
  Post, 
  Delete, 
  Param, 
  UseGuards, 
  UploadedFile, 
  UseInterceptors, 
  HttpException, 
  HttpStatus 
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/Roles.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { promises as fs } from 'fs';

@ApiTags('Upload')
@UseGuards(AuthGuard, RolesGuard)
@Roles('ADMIN', 'SUPERADMIN')
@Controller('upload')
export class UploadController {

  private readonly uploadDir = join(process.cwd(), 'uploads', 'chat');

  constructor() {
    // Papka mavjudligini tekshirib, agar yo'q bo'lsa yaratish
    fs.mkdir(this.uploadDir, { recursive: true }).catch(err => {
      console.error('Upload papkasini yaratishda xatolik:', err);
    });
  }

  @Post()
  @ApiOperation({ summary: 'Fayl upload qilish' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Fayl muvaffaqiyatli yuklandi' })
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: (req, file, cb) => {
        cb(null, join(process.cwd(), 'uploads', 'chat'));
      },
      filename: (req, file, cb) => {
        const randomName = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const fileExt = extname(file.originalname);
        cb(null, `${randomName}${fileExt}`);
      },
    }),
  }))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new HttpException('Fayl yuklanmadi', HttpStatus.BAD_REQUEST);
    }
    const url = `https://faxriddin.bobur-dev.uz/uploads/chat/${file.filename}`;
    return { filename: file.filename, url };
  }

  @Delete(':filename')
  @ApiOperation({ summary: 'Faylni o‘chirish' })
  @ApiResponse({ status: 200, description: 'Fayl muvaffaqiyatli o‘chirildi' })
  @ApiResponse({ status: 404, description: 'Fayl topilmadi' })
  async removeFile(@Param('filename') filename: string) {
    const filePath = join(this.uploadDir, filename);
    try {
      await fs.access(filePath); // fayl mavjudligini tekshirish
      await fs.unlink(filePath);
      return { message: 'Fayl muvaffaqiyatli o‘chirildi' };
    } catch (err) {
      throw new HttpException('Fayl topilmadi', HttpStatus.NOT_FOUND);
    }
  }
}
