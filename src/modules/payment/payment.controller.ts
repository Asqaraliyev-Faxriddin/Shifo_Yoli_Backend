import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { SearchPaymentDto } from './dto/create-payment.dto';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get('search')
  async searchPayments(@Query() query: SearchPaymentDto) {
    return this.paymentService.searchPayments(query);
  }

          
  @UseGuards(AuthGuard)
  @Get("Payment/user")
  async userPayment(@Req() req) {
    return this.paymentService.oldPayment(req.user.id);
  }
}
