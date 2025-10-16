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
import * as multer from 'multer';
import { extname, join } from 'path';
import axios from 'axios';
import * as FormData from 'form-data';
import { promises as fs } from 'fs';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/Roles.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiBody } from '@nestjs/swagger';

const IMGBB_API_KEY = '7b80af0a58ffc5ed794b3d3955d402c0';
const IMGBB_UPLOAD_URL = 'https://api.imgbb.com/1/upload';

@ApiTags('Upload')
@UseGuards(AuthGuard, RolesGuard)
@Controller('upload')
export class UploadController {

  private readonly uploadDir = join(process.cwd(), 'uploads', 'chat');

  constructor() {
    // Papka mavjudligini tekshirish va yaratish
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
    storage: multer.memoryStorage(), // dastlab bufferda saqlaymiz
  }))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new HttpException('Fayl yuklanmadi', HttpStatus.BAD_REQUEST);
    }

    const isImage = file.mimetype.startsWith('image/');
    if (isImage) {
      // Agar rasm bo'lsa imgbb ga yuborish
      try {
        const form = new FormData();
        form.append('image', file.buffer.toString('base64'));
        form.append('key', IMGBB_API_KEY);

        const response = await axios.post(IMGBB_UPLOAD_URL, form, {
          headers: form.getHeaders(),
        });

        if (response.data && response.data.success) {
          return {
            filename: response.data.data.image.filename,
            url: response.data.data.url,
            display_url: response.data.data.display_url,
            delete_url: response.data.data.delete_url,
          };
        } else {
          throw new HttpException('Fayl imgbb ga yuklanmadi', HttpStatus.INTERNAL_SERVER_ERROR);
        }
      } catch (err) {
        console.error(err);
        throw new HttpException('Fayl imgbb ga yuklanmadi', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    } else {
      // Agar rasm bo'lmasa, server papkasiga saqlash
      const fileExt = extname(file.originalname);
      const randomName = Date.now() + '-' + Math.round(Math.random() * 1e9) + fileExt;
      const savePath = join(this.uploadDir, randomName);

      try {
        await fs.writeFile(savePath, file.buffer);
        const url = `https://your-domain.com/uploads/chat/${randomName}`; // o'zingiz domen bilan almashtiring
        return { filename: randomName, url };
      } catch (err) {
        console.error(err);
        throw new HttpException('Fayl serverga saqlanmadi', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  @Delete(':filename')
  @ApiOperation({ summary: 'Faylni o‘chirish (server)' })
  @ApiResponse({ status: 200, description: 'Fayl muvaffaqiyatli o‘chirildi' })
  @ApiResponse({ status: 404, description: 'Fayl topilmadi' })
  async removeFile(@Param('filename') filename: string) {
    const filePath = join(this.uploadDir, filename);
    try {
      await fs.access(filePath);
      await fs.unlink(filePath);
      return { message: 'Fayl muvaffaqiyatli o‘chirildi' };
    } catch (err) {
      throw new HttpException('Fayl topilmadi', HttpStatus.NOT_FOUND);
    }
  }
}
