import { Controller, Post, Body, Req } from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Contacts')
@Controller('contacts')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post("create")
  @ApiOperation({ summary: 'Yangi murojaat yuborish' })
  @ApiResponse({ status: 201, description: 'Murojaat muvaffaqiyatli yuborildi.' })
  @ApiResponse({ status: 400, description: 'Xatolik yoki 10 daqiqadan kam vaqt ichida yuborildi.' })
  async create(@Body() createContactDto: CreateContactDto, @Req() req: any) {
    return this.contactService.create(createContactDto, req);
  }
}
