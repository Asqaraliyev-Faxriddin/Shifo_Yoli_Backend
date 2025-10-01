import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    Patch,
    Query,
    UploadedFile,
    UseInterceptors,
    UseGuards,
  } from '@nestjs/common';
  import { DoctorCategoryService } from './doctor-category.service';
  import {
    CreateCategory,
    CategoryAllDto,
    UpdateCategory,
  } from './dto/create-doctor-category.dto';
  import { FileInterceptor } from '@nestjs/platform-express';
  import axios from 'axios';
  import * as FormData from 'form-data';
  import { Express } from 'express';
  import {
    ApiTags,
    ApiOperation,
    ApiConsumes,
    ApiBody,
    ApiResponse,
  } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/Roles.decorator';
  
  @ApiTags('Doctor Categories')
  @Controller('doctor-category')
  @UseGuards(AuthGuard,RolesGuard)
  @Roles('ADMIN','SUPERADMIN')
  export class DoctorCategoryController {
    constructor(private readonly service: DoctorCategoryService) {}
  
    // CREATE CATEGORY + IMG UPLOAD
    @Post("create")
    @UseInterceptors(FileInterceptor('img'))
    @ApiOperation({ summary: 'Yangi kategoriya yaratish (rasm bilan)' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
      schema: {
        type: 'object',
        properties: {
          name: { type: 'string', example: 'Kardiologiya' },
          img: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    })
    @ApiResponse({ status: 201, description: 'Kategoriya yaratildi' })
    async create(
      @Body() dto: CreateCategory,
      @UploadedFile() file?: Express.Multer.File,
    ) {
      let imgUrl: string | undefined;
  
      if (file) {
        const form = new FormData();
        form.append('image', file.buffer.toString('base64'));
  
        const response = await axios.post(
          `https://api.imgbb.com/1/upload?key=7b80af0a58ffc5ed794b3d3955d402c0`,
          form,
          { headers: form.getHeaders() },
        );
  
        imgUrl = response.data.data.url;
      }
  
      return this.service.create(dto, imgUrl);
    }
  
    // GET ALL
    @Get("all")
    @ApiOperation({ summary: 'Barcha kategoriyalarni olish' })
    async findAll(@Query() query: CategoryAllDto) {
      return this.service.findAll(query);
    }
  
    // GET ONE
    @Get('one/:id')
    @ApiOperation({ summary: 'Bitta kategoriya olish' })
    async findOne(@Param('id') id: string) {
      return this.service.findOne(id);
    }
  
    // UPDATE CATEGORY + IMG UPLOAD
    @Patch(':id')
    @UseInterceptors(FileInterceptor('img'))
    @ApiOperation({ summary: 'Kategoriya yangilash (rasm bilan)' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
      schema: {
        type: 'object',
        properties: {
          name: { type: 'string', example: 'Nevrologiya' },
          img: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    })
    @ApiResponse({ status: 200, description: 'Kategoriya yangilandi' })
    async update(
      @Param('id') id: string,
      @Body() dto: UpdateCategory,
      @UploadedFile() file?: Express.Multer.File,
    ) {
      let imgUrl: string | undefined;
  
      if (file) {
        const form = new FormData();
        form.append('image', file.buffer.toString('base64'));
  
        const response = await axios.post(
          `https://api.imgbb.com/1/upload?key=7b80af0a58ffc5ed794b3d3955d402c0`,
          form,
          { headers: form.getHeaders() },
        );
  
        imgUrl = response.data.data.url;
      }
  
      return this.service.update(id, dto, imgUrl);
    }
  
    // DELETE
    @Delete('delete/:id')
    @ApiOperation({ summary: 'Kategoriya o‘chirish' })
    @ApiResponse({ status: 200, description: 'Kategoriya o‘chirildi' })
    async remove(@Param('id') id: string) {
      return this.service.remove(id);
    }
  }
  