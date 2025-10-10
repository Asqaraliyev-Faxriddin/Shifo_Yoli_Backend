import { Controller, Get, Query } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { SearchPaymentDto } from './dto/create-payment.dto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get('search')
  async searchPayments(@Query() query: SearchPaymentDto) {
    return this.paymentService.searchPayments(query);
  }
}
