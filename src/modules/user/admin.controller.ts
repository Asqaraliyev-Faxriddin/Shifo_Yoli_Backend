// import {
//   BadRequestException,
//   Body,
//   Controller,
//   Delete,
//   Get,
//   Param,
//   ParseUUIDPipe,
//   Patch,
//   Post,
//   UploadedFile,
//   UseGuards,
//   UseInterceptors,
// } from '@nestjs/common';
// import { UserService } from './admin.service';
// import {
//   CreateAdminDto,
//   CreateBuyerDto,
//   CreateSellerDto,
//   UpdateUserDto,
//   UpdateSellerPortfolioDto,
// } from './dto/create-user.dto';
// import {
//   ApiTags,
//   ApiOperation,
//   ApiParam,
//   ApiBearerAuth,
//   ApiBody,
// } from '@nestjs/swagger';
// import axios from "axios";
// import * as FormData from "form-data";

// import { UserType } from '@prisma/client';
// import { Roles } from 'src/common/decorators/Roles.decorator';
// import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
// import { RolesGuard } from 'src/common/guards/roles.guard';
// import { FileInterceptor } from '@nestjs/platform-express';

// @ApiTags('Users')
// @ApiBearerAuth()
// @Controller('api/users')
// @UseGuards(AuthGuard, RolesGuard)
// export class UserController {
//   constructor(private readonly userService: UserService) {}

//   private async uploadToImgBB(file: Express.Multer.File): Promise<string> {
//     try {
//       const form = new FormData();
//       form.append('image', file.buffer.toString('base64'));

//       const response = await axios.post(
//         `https://api.imgbb.com/1/upload?key=7b80af0a58ffc5ed794b3d3955d402c0`,
//         form,
//         { headers: form.getHeaders() },
//       );

//       return response.data.data.url as string;
//     } catch (err) {
//       throw new BadRequestException('ImgBB upload failed: ' + err.message);
//     }
//   }

//   @Post('create/admin')
//   @Roles(UserType.ADMIN)
//   @ApiOperation({ summary: 'Yangi admin yaratish (faqat ADMIN)' })
//   @UseInterceptors(FileInterceptor('profileImg'))
//   async createAdmin(
//     @Body() payload: CreateAdminDto,
//     @UploadedFile() profileImg?: Express.Multer.File,
//   ) {
//     let imageUrl: string | undefined;
//     if (profileImg) imageUrl = await this.uploadToImgBB(profileImg);

//     return this.userService.createAdmin({ ...payload,  },imageUrl );
//   }

//   @Post('create/seller')
//   @Roles(UserType.ADMIN)
//   @ApiOperation({ summary: 'Yangi sotuvchi yaratish (faqat ADMIN)' })
//   @UseInterceptors(FileInterceptor('profileImg'))
//   async createSeller(
//     @Body() payload: CreateSellerDto,
//     @UploadedFile() profileImg?: Express.Multer.File,
//   ) {
//     let imageUrl: string | undefined;
//     if (profileImg) imageUrl = await this.uploadToImgBB(profileImg);

//     return this.userService.createSeller({ ...payload,  },imageUrl);
//   }

//   @Post('create/buyer')
//   @Roles(UserType.ADMIN)
//   @ApiOperation({ summary: 'Yangi xaridor yaratish (faqat ADMIN)' })
//   @UseInterceptors(FileInterceptor('profileImg'))
//   async createBuyer(
//     @Body() payload: CreateBuyerDto,
//     @UploadedFile() profileImg?: Express.Multer.File,
//   ) {
//     let imageUrl: string | undefined;
//     if (profileImg) imageUrl = await this.uploadToImgBB(profileImg);

//     return this.userService.createBuyer({ ...payload, },imageUrl );
//   }

//   @Get('all')
//   @Roles(UserType.ADMIN)
//   @ApiOperation({ summary: 'Barcha foydalanuvchilarni olish (faqat ADMIN)' })
//   getAllUsers() {
//     return this.userService.getAllUsers();
//   }

//   @Get(':id')
//   @Roles(UserType.ADMIN)
//   @ApiOperation({ summary: 'Foydalanuvchini ID orqali olish (faqat ADMIN)' })
//   @ApiParam({ name: 'id', description: 'User ID' })
//   getUserById(@Param('id', ParseUUIDPipe) id: string) {
//     return this.userService.getUserById(id);
//   }

// // Controller
// @Patch('update/:id')
// @Roles(UserType.ADMIN)
// @ApiOperation({ summary: 'Foydalanuvchini yangilash (faqat ADMIN)' })
// @UseInterceptors(FileInterceptor('profileImg'))
// async updateUser(
//   @Param('id', ParseUUIDPipe) id: string,
//   @Body() payload: UpdateUserDto,
//   @UploadedFile() file?: Express.Multer.File,
// ) {
//   let uploadedUrl: string | undefined;

//   if (file) {
//     const form = new FormData();
//     form.append("image", file.buffer.toString("base64"));

//     const response = await axios.post(
//       `https://api.imgbb.com/1/upload?key=7b80af0a58ffc5ed794b3d3955d402c0`,
//       form,
//       { headers: form.getHeaders() }
//     );

//     uploadedUrl = response.data.data.url; 
//   }

//   return this.userService.updateUser(
//     { ...payload, userId: id },
//     uploadedUrl, 
//   );
// }


//   @Delete('delete/:id')
//   @Roles(UserType.ADMIN)
//   @ApiOperation({ summary: 'Foydalanuvchini o‘chirish (faqat ADMIN)' })
//   @ApiParam({ name: 'id', description: 'User ID' })
//   deleteUser(@Param('id', ParseUUIDPipe) id: string) {
//     return this.userService.deleteUser(id);
//   }

//   @Patch('seller/update/:id')
//   @Roles(UserType.ADMIN)
//   @ApiOperation({ summary: 'Seller portfolioni yangilash' })
//   @UseInterceptors(FileInterceptor('file'))
//   updateSellerPortfolio(
//     @Param('id', ParseUUIDPipe) id: string,
//     @Body() payload: UpdateSellerPortfolioDto,
//     @UploadedFile() file?: Express.Multer.File,
//   ) {
//     return this.userService.updateSellerPortfolio(
//       { ...payload, userId: id },
//       file?.filename,
//     );
//   }


// }
