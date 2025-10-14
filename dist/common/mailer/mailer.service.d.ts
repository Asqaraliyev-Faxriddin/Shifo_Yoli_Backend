import { MailerService as MailerServices } from '@nestjs-modules/mailer';
export declare class AppMailerService {
    private mailerService;
    constructor(mailerService: MailerServices);
    sendEmail(email: string, subject: string, code: number): Promise<void>;
    sendNotificationEmail(to: string, subject: string, message: string, date?: Date): Promise<void>;
    adminsms(to: string, subject: string, message: string, date?: Date): Promise<void>;
}
