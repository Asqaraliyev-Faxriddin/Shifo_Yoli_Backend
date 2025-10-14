import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
export declare class ContactController {
    private readonly contactService;
    constructor(contactService: ContactService);
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
}
