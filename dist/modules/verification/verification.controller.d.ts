import { SendOtpDto, VerifyOtpDto } from './dto/verification.dto';
import { VerificationService } from './verification.service';
export declare class VerificationController {
    private readonly verificationservice;
    constructor(verificationservice: VerificationService);
    sendOtp(body: SendOtpDto): Promise<{
        message: string;
    }>;
    verifyOtp(body: VerifyOtpDto): Promise<{
        status: boolean;
        message: string;
    }>;
}
