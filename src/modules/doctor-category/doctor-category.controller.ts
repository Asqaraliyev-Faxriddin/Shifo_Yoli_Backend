// import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
// import { DoctorCategoryService } from './doctor-category.service';
// import { CreateDoctorCategoryDto } from './dto/create-doctor-category.dto';
// import { UpdateDoctorCategoryDto } from './dto/update-doctor-category.dto';

// @Controller('doctor-category')
// export class DoctorCategoryController {
//   constructor(private readonly doctorCategoryService: DoctorCategoryService) {}

//   @Post()
//   create(@Body() createDoctorCategoryDto: CreateDoctorCategoryDto) {
//     return this.doctorCategoryService.create(createDoctorCategoryDto);
//   }

//   @Get()
//   findAll() {
//     return this.doctorCategoryService.findAll();
//   }

//   @Get(':id')
//   findOne(@Param('id') id: string) {
//     return this.doctorCategoryService.findOne(+id);
//   }

//   @Patch(':id')
//   update(@Param('id') id: string, @Body() updateDoctorCategoryDto: UpdateDoctorCategoryDto) {
//     return this.doctorCategoryService.update(+id, updateDoctorCategoryDto);
//   }

//   @Delete(':id')
//   remove(@Param('id') id: string) {
//     return this.doctorCategoryService.remove(+id);
//   }
// }
