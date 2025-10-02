import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PublicService } from './user.service';

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
}
