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
import * as multer from 'multer';
import axios from 'axios';
import * as FormData from 'form-data';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/Roles.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiBody } from '@nestjs/swagger';

const IMGBB_API_KEY = '7b80af0a58ffc5ed794b3d3955d402c0';
const IMGBB_UPLOAD_URL = 'https://api.imgbb.com/1/upload';

@ApiTags('Upload')
@UseGuards(AuthGuard, RolesGuard)
@Roles('ADMIN', 'SUPERADMIN')
@Controller('upload')
export class UploadController {

  @Post()
  @ApiOperation({ summary: 'Fayl upload qilish (imgbb)' })
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
    storage: multer.memoryStorage(), // <-- diskga saqlamaymiz
  }))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new HttpException('Fayl yuklanmadi', HttpStatus.BAD_REQUEST);
    }

    try {
      // FormData tayyorlash
      const form = new FormData();
      form.append('image', file.buffer.toString('base64')); // imgbb base64 formatni qabul qiladi
      form.append('key', IMGBB_API_KEY);

      // imgbb ga POST qilish
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
  }

  @Delete(':deleteUrl')
  @ApiOperation({ summary: 'Faylni o‘chirish (imgbb)' })
  @ApiResponse({ status: 200, description: 'Fayl muvaffaqiyatli o‘chirildi' })
  @ApiResponse({ status: 404, description: 'Fayl topilmadi' })
  async removeFile(@Param('deleteUrl') deleteUrl: string) {
    try {
      const response = await axios.get(deleteUrl);
      if (response.status === 200) {
        return { message: 'Fayl muvaffaqiyatli o‘chirildi' };
      } else {
        throw new HttpException('Fayl topilmadi', HttpStatus.NOT_FOUND);
      }
    } catch (err) {
      console.error(err);
      throw new HttpException('Fayl topilmadi', HttpStatus.NOT_FOUND);
    }
  }
}
