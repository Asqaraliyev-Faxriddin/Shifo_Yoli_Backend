import { MailerService as MailerServices } from '@nestjs-modules/mailer';
export declare class AppMailerService {
    private mailerService;
    constructor(mailerService: MailerServices);
    sendEmail(email: string, subject: string, code: number): Promise<void>;
    sendContact(contactData: {
        firstname: string;
        lastname: string;
        email: string;
        mur_email: string;
        message: string;
        date: string;
        houseName: string;
        mur_phone: string;
    }): Promise<void>;
}
