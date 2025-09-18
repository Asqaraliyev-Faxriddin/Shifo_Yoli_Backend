import { AppMailerService } from '../mailer/mailer.service';
export declare class SmsService {
    private readonly mailerService;
    constructor(mailerService: AppMailerService);
    sendSms(subject: string, to: string, code: number): Promise<boolean>;
}
