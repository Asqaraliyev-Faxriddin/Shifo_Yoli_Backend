import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PublicService } from './user.service';
import { SearchUserDto } from 'src/modules/admin/dto/create-admin.dto';

@ApiTags('Public') 
@Controller('User')
export class PublicController {
  constructor(private readonly publicService: PublicService) {}

  @Get('top-doctors')
  @ApiOperation({ summary: 'Top 10 doctor rating bo‘yicha' })
  async getTopDoctors() {
    return this.publicService.getTopDoctors();
  }

  @Get('best-doctor-week')
  @ApiOperation({ summary: 'Haftaning eng yaxshi doctori' })
  async getBestDoctorOfWeek() {
    return this.publicService.getBestDoctorOfWeek();
  }

  @Get('most-reviewed-doctors')
  @ApiOperation({ summary: 'Eng ko‘p review olgan 12 ta doctor' })
  async getMostReviewedDoctors() {
    return this.publicService.getMostReviewedDoctors();
  }

  @Get('categories')
  @ApiOperation({ summary: 'Barcha category va doctorlari' })
  async getCategories() {
    return this.publicService.getCategories();
  }


  @Get("doctors/All")
  @ApiOperation({summary:"Barcha doktorlar publiished true bolganlar"})
  async DoctorsAll(@Query() payload:SearchUserDto){
    return this.publicService.doctorsAll(payload)
  }

  
  @Get("doctorOne/:id")
  @ApiOperation({summary:"Bitta doktorni olish"})
  async DoctorOne(@Param("id",ParseUUIDPipe) id:string ){
    return this.publicService.doctorOne(id)
  }


}
