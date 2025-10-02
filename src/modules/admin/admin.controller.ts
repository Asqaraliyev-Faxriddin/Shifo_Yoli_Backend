import {
    Controller,
    Post,
    Put,
    Delete,
    Get,
    Body,
    Param,
    Query,
    UploadedFile,
    UseInterceptors,
    UseGuards,
    Req,
  } from "@nestjs/common";
  import { FileInterceptor } from "@nestjs/platform-express";
  import axios from "axios";
  import * as FormData from "form-data"; // ✅ Node.js uchun
  import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiConsumes, ApiParam, ApiBearerAuth } from "@nestjs/swagger";
  import { AdminService } from "./admin.service";
  import {
    CreateAdminDto,
    CreateDoctorDto,
    CreatePatientDto,
    UpdateUserDto,
    DeleteUserDto,
    BlockUserDto,
    UnblockUserDto,
    SearchUserDto,
    SendNotificationDto,
    BroadcastNotificationDto,
    UserPaymentDto,
    MassPaymentDto,
  } from "./dto/create-admin.dto";
import { AuthGuard } from "src/common/guards/jwt-auth.guard";
import { RolesGuard } from "src/common/guards/roles.guard";
import { Roles } from "src/common/decorators/Roles.decorator";
import { UserRole } from "@prisma/client";
  
  @ApiBearerAuth()
  @ApiTags("Admin") // ✅ Swagger gruppa nomi
  @Controller("admin")
  // @UseGuards(AuthGuard,RolesGuard)
  // @Roles(UserRole.SUPERADMIN)
  export class AdminController {
    constructor(private readonly adminService: AdminService) {}
  
    private readonly imgbbApiKey = "a22840e1237262e2beec1cf469a82155";
    private readonly imgbbUploadUrl = "https://api.imgbb.com/1/upload";
  
    // 📤 Image upload helper
    private async uploadImage(
      file?: Express.Multer.File,
    ): Promise<string | undefined> {
      if (!file) return undefined;
  
      const formData = new FormData();
      formData.append("image", file.buffer.toString("base64"));
  
      const res = await axios.post(
        `${this.imgbbUploadUrl}?key=${this.imgbbApiKey}`,
        formData,
        {
          headers: {
            ...formData.getHeaders(),
          },
        },
      );
  
      return res.data?.data?.url as string | undefined;
    }
  
    // ===================== CREATE =====================
    @Post("create/admin")
    @ApiOperation({ summary: "Create Admin" })
    @ApiConsumes("multipart/form-data")
    @ApiBody({ type: CreateAdminDto })
    async createAdmin(
      @Body() dto: CreateAdminDto,
      @UploadedFile() file?: Express.Multer.File,
    ) {

      console.log("fwwe",file);
      

      const profileImgUrl = file ? await this.uploadImage(file) : undefined;
      return this.adminService.createAdmin(dto, profileImgUrl);
    }
  
    @Post("create/doctor")
@ApiOperation({ summary: "Create Doctor" })
@ApiConsumes("multipart/form-data")
@ApiBody({ type: CreateDoctorDto })
@UseInterceptors(FileInterceptor("profileImg"))
async createDoctor(
  @UploadedFile() file: Express.Multer.File,
  @Body() body: any, // DTO ga to‘g‘ridan-to‘g‘ri parse bo‘lmaydi
) {
  const dto: CreateDoctorDto = {
    ...body,
    dailySalary: Number(body.dailySalary),
    email: body.email,
    firstName: body.firstName,
    lastName: body.lastName,
    age: Number(body.age),
    categoryId: body.categoryId,
    bio: body.bio,
    images: body.images,
    videos: body.videos,
    password: body.password,
  };

  const profileImgUrl = file ? await this.uploadImage(file) : undefined;

  return this.adminService.createDoctor(dto, profileImgUrl);
}

  
    @Post("create/patient")
    @ApiOperation({ summary: "Create Patient" })
    @ApiConsumes("multipart/form-data")
    @ApiBody({ type: CreatePatientDto })
    async createPatient(@Body() dto: CreatePatientDto,@Req() req,@UploadedFile() file?: Express.Multer.File ) {

      // console.log();
      
      const profileImgUrl = file ? await this.uploadImage(file) : undefined;
      return this.adminService.createPatient(dto, profileImgUrl);

      return req.body
    }
  
    @Get("admins")
    @ApiOperation({ summary: "Get all admins" })
    async findAllAdmins(@Query() dto: SearchUserDto) {
      return this.adminService.findAllAdmins(dto);
    }
  
    @Get("doctors")
    @ApiOperation({ summary: "Get all doctors" })
    async findAllDoctors(@Query() dto: SearchUserDto) {

      
      return this.adminService.findAllDoctors(dto);
    }
  
    @Get("patients")
    @ApiOperation({ summary: "Get all patients" })
    async findAllPatients(@Query() dto: SearchUserDto) {
      return this.adminService.findAllPatients(dto);
    }
  
    @Put("update/:id")
    @ApiOperation({ summary: "Update user" })
    @ApiParam({ name: "id", description: "User ID" })
    async updateUser(
      @Param("id") id: string,
      @Body() dto: UpdateUserDto,
      @UploadedFile() file?: Express.Multer.File,
    ) {
      const profileImgUrl = file ? await this.uploadImage(file) : undefined;
      return this.adminService.updateUser(id, dto, profileImgUrl);
    }
  
    @Delete("delete")
    @ApiOperation({ summary: "Delete user" })
    async deleteUser(@Body() dto: DeleteUserDto) {
      return this.adminService.deleteUser(dto);
    }
  
    @Post("wallet/add")
    @ApiOperation({ summary: "Add funds to wallet" })
    async addFunds(@Body() dto: UserPaymentDto) {
      return this.adminService.addFunds(dto);
    }
  
    @Post("wallet/deduct")
    @ApiOperation({ summary: "Deduct funds from wallet" })
    async deductFunds(@Body() dto: UserPaymentDto) {
      return this.adminService.deductFunds(dto);
    }
  
    @Post("wallet/mass/add")
    @ApiOperation({ summary: "Mass add funds" })
    async massPayment(@Body() dto: MassPaymentDto) {
      return this.adminService.massPayment(dto);
    }
  
    @Post("wallet/mass/deduct")
    @ApiOperation({ summary: "Mass deduct funds" })
    async massDeduction(@Body() dto: MassPaymentDto) {
      return this.adminService.massDeduction(dto);
    }
  
    // ===================== NOTIFICATIONS =====================
    @Post("notification/send")
    @ApiOperation({ summary: "Send notification to one user" })
    async sendNotification(@Body() dto: SendNotificationDto) {
      return this.adminService.sendNotification(dto);
    }
  
    @Post("notification/broadcast")
    @ApiOperation({ summary: "Broadcast notification to all users" })
    async broadcastNotification(@Body() dto: BroadcastNotificationDto) {
      return this.adminService.broadcastNotification(dto);
    }
  
    // ===================== USER BLOCK =====================
    @Post("block/user")
    @ApiOperation({ summary: "Block user" })
    async blockUser(@Body() dto: BlockUserDto) {
      return this.adminService.blockUser(dto.userId, dto.reason);
    }
  
    @Post("unblock/user")
    @ApiOperation({ summary: "Unblock user" })
    async unblockUser(@Body() dto: UnblockUserDto) {
      return this.adminService.unblockUser(dto.userId);
    }
  
    // ===================== DEVICE BLOCK =====================
    @Post("block/device/:id")
    @ApiOperation({ summary: "Block device" })
    @ApiParam({ name: "id", description: "Device ID" })
    async blockDevice(
      @Param("id") deviceId: string,
      @Body("reason") reason?: string,
    ) {
      return this.adminService.blockDevice(deviceId, reason);
    }
  
    @Post("unblock/device/:id")
    @ApiOperation({ summary: "Unblock device" })
    @ApiParam({ name: "id", description: "Device ID" })
    async unblockDevice(@Param("id") deviceId: string) {
      return this.adminService.unblockDevice(deviceId);
    }
  
    // ===================== DOCTOR PROFILE PUBLISH =====================
    @Put("doctor/:id/publish/:status")
    @ApiOperation({ summary: "Toggle doctor profile publish status" })
    @ApiParam({ name: "id", description: "Doctor ID" })
    @ApiParam({ name: "status", description: "Publish status (true/false)" })
    async toggleDoctorPublish(
      @Param("id") doctorId: string,
      @Param("status") status: string,
    ) {
      return this.adminService.toggleDoctorPublish(doctorId, status === "true");
    }



    @Get("device/all")
    async allDevices() {

        return this.adminService.BlokuserAll();
    }


    
    @Get("block/users/all")
    async blobkusers() {

        return this.adminService.BlokdeviceAll();
    }
  }
  