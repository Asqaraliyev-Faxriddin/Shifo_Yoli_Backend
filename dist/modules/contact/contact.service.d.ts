import { PrismaService } from 'src/core/prisma/prisma.service';
import { CreateContactDto } from './dto/create-contact.dto';
export declare class ContactService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private readonly TELEGRAM_TOKEN;
    private readonly CHAT_ID;
    create(createContactDto: CreateContactDto, req: any): Promise<{
        success: boolean;
        message: string;
        data: {
            message: string;
            email: string;
            createdAt: Date;
            updatedAt: Date;
            phone: string | null;
            unique: string;
        };
    }>;
    private sendToTelegram;
}
