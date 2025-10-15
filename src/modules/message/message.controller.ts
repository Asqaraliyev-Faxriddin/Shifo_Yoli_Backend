import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiConsumes, ApiBearerAuth } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { MessageService } from './message.service';
import {
  SendMessageDto,
  CreateChatDto,
  UpdateMessageDto,
  DeleteMessageDto,
  ReadMessageDto,
  GetMessagesDto,
  GetChatsDto,
} from './dto/create-message.dto';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';


@ApiTags('Chat va Xabarlar')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post('create-chat')
  @ApiOperation({ summary: 'Yangi chat yaratish yoki mavjudini olish' })
  async createChat(@Req() req, @Body() dto: CreateChatDto) {
    return this.messageService.createChat(req.user.id, dto);
  }

  @Post('send')
  @ApiOperation({ summary: 'Xabar yuborish (matn, fayl yoki video)' })
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  async sendMessage(
    @Req() req,
    @Body() dto: SendMessageDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.messageService.sendMessage(req.user.id, dto, file);
  }

  @Patch('update')
  @ApiOperation({ summary: 'Xabar matnini yangilash (faqat o‘z xabari)' })
  async updateMessage(@Req() req, @Body() dto: UpdateMessageDto) {
    return this.messageService.updateMessage(req.user.id, dto);
  }

  // 🔹 Xabar o‘chirish
  @Delete('delete')
  @ApiOperation({ summary: 'Xabarni o‘chirish (faqat o‘z xabari)' })
  async deleteMessage(@Req() req, @Body() dto: DeleteMessageDto) {
    return this.messageService.deleteMessage(req.user.id, dto);
  }

  // 🔹 Xabarlarni o‘qilgan deb belgilash
  @Patch('read')
  @ApiOperation({ summary: 'Xabarlarni o‘qilgan deb belgilash' })
  async readMessages(@Req() req, @Body() dto: ReadMessageDto) {
    return this.messageService.readMessages(req.user.id, dto);
  }

  // 🔹 Chatdagi xabarlarni olish
  @Get('list')
  @ApiOperation({ summary: 'Chatdagi xabarlarni olish (pagination bilan)' })
  async getMessages(@Req() req, @Query() dto: GetMessagesDto) {
    return this.messageService.getMessages(req.user.id, dto);
  }

  // 🔹 Foydalanuvchining barcha chatlarini olish
  @Get('chats')
  @ApiOperation({ summary: 'Foydalanuvchining barcha chatlarini olish' })
  async getChats(@Req() req, @Query() dto: GetChatsDto) {
    return this.messageService.getChats(req.user.id, dto);
  }
}
