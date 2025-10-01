import {
    Controller,
    Post,
    Get,
    Put,
    Delete,
    Param,
    Body,
    Query,
    UseGuards,
    Req,
    ParseIntPipe,
    ParseUUIDPipe,
  } from "@nestjs/common";
  import { ReviewService } from "./rating.service";
  import { CreateReviewDto, UpdateReviewDto } from "./dto/create-rating.dto";
  import { Roles } from "src/common/decorators/Roles.decorator";
  import { RolesGuard } from "src/common/guards/roles.guard";
  import { AuthGuard } from "src/common/guards/jwt-auth.guard";
  import { UserRole } from "@prisma/client";
  
  import {
    ApiTags,
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiQuery,
  } from "@nestjs/swagger";
  
  @ApiTags("Reviews")
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Controller("reviews")
  export class ReviewController {
    constructor(private readonly reviewService: ReviewService) {}
  
    // ✅ Review yaratish
    @Post()
    @ApiOperation({ summary: "Doktorga review qo‘shish" })
    @ApiResponse({ status: 201, description: "Review muvaffaqiyatli qo‘shildi" })
    async create(@Req() req, @Body() dto: CreateReviewDto) {
      return this.reviewService.create(req.user.id, dto);
    }
  
    // ✅ Doktor bo‘yicha review lar
    @Get("doctor/:doctorId")
    @ApiOperation({ summary: "Doktorning review larini olish" })
    @ApiQuery({ name: "offset", required: false, example: 0 })
    @ApiQuery({ name: "limit", required: false, example: 10 })
    @ApiResponse({ status: 200, description: "Doktor reviewlari ro‘yxati" })
    async findAllByDoctor(
      @Param("doctorId", ParseUUIDPipe) doctorId: string,
      @Query("offset", ParseIntPipe) offset = 0,
      @Query("limit", ParseIntPipe) limit = 10,
    ) {
      return this.reviewService.findAllByDoctor(doctorId, offset, limit);
    }
  
    // ✅ Doktor review analitikasi
    @Get("analytics/:doctorId")
    @ApiOperation({ summary: "Doktor review analitikasi" })
    @ApiResponse({
      status: 200,
      description:
        "O‘rtacha baho, umumiy soni, taqsimot, eng zo‘r va eng yomon review lar",
    })
    async getAnalytics(@Param("doctorId", ParseUUIDPipe) doctorId: string) {
      return this.reviewService.getAnalytics(doctorId);
    }
  
    // ✅ Review update (faqat egasi)
    @Put(":id")
    @ApiOperation({ summary: "Review ni yangilash (faqat egasi)" })
    @ApiResponse({ status: 200, description: "Review muvaffaqiyatli yangilandi" })
    async update(
      @Req() req,
      @Param("id", ParseUUIDPipe) id: string,
      @Body() dto: UpdateReviewDto,
    ) {
      return this.reviewService.update(req.user.id, id, dto);
    }
  
    // ✅ Review o‘chirish (egasi yoki ADMIN/SUPERADMIN)
    @Delete(":id")
    @ApiOperation({ summary: "Review o‘chirish (egasi yoki ADMIN/SUPERADMIN)" })
    @ApiResponse({ status: 200, description: "Review muvaffaqiyatli o‘chirildi" })
    async remove(@Req() req, @Param("id", ParseUUIDPipe) id: string) {
      return this.reviewService.remove(req.user.id, id);
    }
  }
  