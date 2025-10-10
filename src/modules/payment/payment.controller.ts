import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Search22PaymentDto, SearchPaymentDto } from './dto/create-payment.dto';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Roles } from 'src/common/decorators/Roles.decorator';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @UseGuards(AuthGuard)
  @Roles('SUPERADMIN','ADMIN')
  @Get('search')
  @ApiOperation({ summary: 'SUPERADMIN va ADMIN uchun barcha to‘lovlarni qidirish' })
  @ApiQuery({ name: 'firstName', required: false, type: String })
  @ApiQuery({ name: 'email', required: false, type: String })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'offset', required: false, type: Number, example: 0 })
  @ApiResponse({ status: 200, description: 'To‘lovlar ro‘yxati', type: [Object] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async searchPayments(@Query() query: SearchPaymentDto) {
    return this.paymentService.searchPayments(query);
  }


  @UseGuards(AuthGuard)
  @Get("Payment/user")
  @ApiOperation({ summary: "Foydalanuvchi o'z to'lovlarini ko'radi" })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'offset', required: false, type: Number, example: 0 })
  @ApiResponse({ status: 200, description: 'Foydalanuvchi to‘lovlari', type: [Object] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async userPayment(@Req() req, @Query() query: Search22PaymentDto) {
    return this.paymentService.oldPayment(query, req.user.id);
  }

}