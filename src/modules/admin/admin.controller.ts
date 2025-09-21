import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto, UpdateAdminDto } from './dto/create-admin.dto';
import { BlockUserDto, UnblockUserDto } from './dto/create-admin.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // ================= CREATE ADMIN =================
  @Post()
  create(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.create(createAdminDto);
  }

  // ================= FIND ALL =================
  @Get()
  findAll() {
    return this.adminService.findAll();
  }

  // ================= FIND ONE =================
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adminService.findOne(id); // ID string sifatida qoldirildi
  }

  // ================= UPDATE =================
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto) {
    return this.adminService.update(id, updateAdminDto);
  }

  // ================= REMOVE =================
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adminService.remove(id);
  }

  // ================= BLOCK USER =================
  @Post('block')
  blockUser(@Body() dto: BlockUserDto) {
    return this.adminService.blockUser(dto);
  }

  // ================= UNBLOCK USER =================
  @Post('unblock')
  unblockUser(@Body() dto: UnblockUserDto) {
    return this.adminService.unblockUser(dto);
  }
}
