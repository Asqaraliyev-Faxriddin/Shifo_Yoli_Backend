import { IChekOtp, SendOtpDto, VerifyOtpDto } from './dto/verification.dto';
import { SmsService } from 'src/common/services/sms.service';
import { RedisService } from 'src/core/prisma/redis/redis.service';
import { PrismaService } from 'src/core/prisma/prisma.service';
export declare class VerificationService {
    private prismaService;
    private smsService;
    private redis;
    constructor(prismaService: PrismaService, smsService: SmsService, redis: RedisService);
    getKey(type: string, email: string, confirmation?: boolean): any;
    private throwIFUserExist;
    private throwIFUserNotExist;
    sendOtp(payload: SendOtpDto): Promise<{
        message: string;
    }>;
    verifyOtp(payload: VerifyOtpDto): Promise<{
        status: boolean;
        message: string;
    }>;
    checkConfirmOtp(payload: IChekOtp): Promise<boolean>;
}
