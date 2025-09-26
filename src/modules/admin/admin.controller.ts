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
import { ApiConsumes, ApiOperation, ApiTags } from "@nestjs/swagger";
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
import { AuthGuard } from "@nestjs/passport";
import { Roles } from "src/common/decorators/Roles.decorator";

@ApiTags("Admin")
@Controller("admin")
@UseGuards(AuthGuard)
@Roles("ADMIN")
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
  @ApiOperation({ summary: "Bemorlarni qidirish va ro‘yxatlash" })
  findAllPatients(@Body() dto: SearchUserDto) {
    return this.adminService.findAllPatients(dto);
  }

  @Get(":id")
  @ApiOperation({ summary: "Bitta adminni topish" })
  findOne(@Param("id") id: string) {
    return this.adminService.findOneAdmin(id);
  }

  @Patch(":id")
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
  @ApiOperation({ summary: "Adminni o‘chirish" })
  remove(@Param("id") id: string) {
    return this.adminService.deleteAdmin(id);
  }

  @Delete("doctor/:id")
  @ApiOperation({ summary: "Doctorni o‘chirish" })
  removeDoctor(@Param("id") id: string) {
    return this.adminService.deleteDoctor(id);
  }

  @Delete("bemor/:id")
  @ApiOperation({ summary: "Bemorni o‘chirish" })
  removePatient(@Param("id") id: string) {
    return this.adminService.deletePatient(id);
  }

  @Post("block")
  @ApiOperation({ summary: "Userni bloklash" })
  blockUser(@Body() dto: BlockUserDto) {
    return this.adminService.blockUser(dto);
  }

  @Post("unblock")
  @ApiOperation({ summary: "Userni blokdan chiqarish" })
  unblockUser(@Body() dto: UnblockUserDto) {
    return this.adminService.unblockUser(dto);
  }


  @Get("devices/fret/fdf")
  @ApiOperation({ summary: "Barcha qurilmalarni olish" })
  nimadir(){
    return this.adminService.nimadir()
  }
}
