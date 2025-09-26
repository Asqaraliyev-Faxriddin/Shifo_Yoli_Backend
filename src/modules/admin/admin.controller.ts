import {
  Body,
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  UploadedFile,
  UseInterceptors,
  UseGuards,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiTags } from "@nestjs/swagger";
import axios from "axios";
import * as FormData from "form-data";
import { AdminService } from "./admin.service";
import {
  CreateAdminDto,
  UpdateAdminDto,
  BlockUserDto,
  UnblockUserDto,
} from "./dto/create-admin.dto";
import { SearchUserDto } from "./dto/update-admin.dto";
import { Roles } from "src/common/decorators/Roles.decorator";
import { AuthGuard } from "src/common/guards/jwt-auth.guard";
import { UserRole } from "@prisma/client";

@ApiTags("Admin")
@Controller("admin")
@UseGuards(AuthGuard)
@ApiBearerAuth()
@Roles(UserRole.SUPERADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  private readonly imgbbApiKey = "a22840e1237262e2beec1cf469a82155";
  private readonly imgbbUploadUrl = "https://api.imgbb.com/1/upload";

  private async uploadToImgbb(file?: Express.Multer.File): Promise<string | null> {
    if (!file) return "";

    const formData = new FormData();
    formData.append("image", file.buffer.toString("base64"));

    const response = await axios.post(this.imgbbUploadUrl, formData, {
      headers: formData.getHeaders(),
      params: { key: this.imgbbApiKey },
    });

    return response.data?.data?.url ?? null;
  }

  @Post()
@Roles(UserRole.SUPERADMIN)
  @ApiOperation({ summary: "Yangi admin yaratish" })
  @ApiConsumes("multipart/form-data")
  @UseInterceptors(FileInterceptor("profileImg"))
  async create(
    @Body() dto: CreateAdminDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const profileImgUrl = await this.uploadToImgbb(file) || ""
    return this.adminService.create(dto, profileImgUrl);
  }

  @Post("admins")
@Roles(UserRole.SUPERADMIN)
  @ApiOperation({ summary: "Adminlarni qidirish va ro‘yxatlash" })
  findAllAdmins(@Body() dto: SearchUserDto) {
    return this.adminService.findAllAdmins(dto);
  }

  @Post("doctors")
  @ApiOperation({ summary: "Doctorlarni qidirish va ro‘yxatlash" })
  findAllDoctors(@Body() dto: SearchUserDto) {
    return this.adminService.findAllDoctors(dto);
  }

  @Post("patients")
@Roles(UserRole.SUPERADMIN)
  @ApiOperation({ summary: "Bemorlarni qidirish va ro‘yxatlash" })
  findAllPatients(@Body() dto: SearchUserDto) {
    return this.adminService.findAllPatients(dto);
  }

  @Get(":id")
@Roles(UserRole.SUPERADMIN)
  @ApiOperation({ summary: "Bitta adminni topish" })
  findOne(@Param("id") id: string) {
    return this.adminService.findOneAdmin(id);
  }

  @Patch(":id")
@Roles(UserRole.SUPERADMIN)
  @ApiOperation({ summary: "Adminni yangilash" })
  @ApiConsumes("multipart/form-data")
  @UseInterceptors(FileInterceptor("profileImg"))
  async update(
    @Param("id") id: string,
    @Body() dto: UpdateAdminDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const profileImgUrl = await this.uploadToImgbb(file) || ""
    return this.adminService.updateAdmin(id, dto, profileImgUrl);
  }

  @Delete(":id")
@Roles(UserRole.SUPERADMIN)
  @ApiOperation({ summary: "Adminni o‘chirish" })
  remove(@Param("id") id: string) {
    return this.adminService.deleteAdmin(id);
  }

  @Delete("doctor/:id")
@Roles(UserRole.SUPERADMIN)
  @ApiOperation({ summary: "Doctorni o‘chirish" })
  removeDoctor(@Param("id") id: string) {
    return this.adminService.deleteDoctor(id);
  }

  @Delete("bemor/:id")
@Roles(UserRole.SUPERADMIN)
  @ApiOperation({ summary: "Bemorni o‘chirish" })
  removePatient(@Param("id") id: string) {
    return this.adminService.deletePatient(id);
  }

  @Post("block")
@Roles(UserRole.SUPERADMIN)
  @ApiOperation({ summary: "Userni bloklash" })
  blockUser(@Body() dto: BlockUserDto) {
    return this.adminService.blockUser(dto);
  }

  @Post("unblock")
@Roles(UserRole.SUPERADMIN)
  @ApiOperation({ summary: "Userni blokdan chiqarish" })
  unblockUser(@Body() dto: UnblockUserDto) {
    return this.adminService.unblockUser(dto);
  }


  @Get("devices/fret/fdf")
@Roles(UserRole.SUPERADMIN)
  @ApiOperation({ summary: "Barcha qurilmalarni olish" })
  nimadir(){
    return this.adminService.nimadir()
  }
}
