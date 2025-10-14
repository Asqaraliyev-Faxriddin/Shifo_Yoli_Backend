import { EverificationTypes } from "src/common/types/verification";
export declare class SendOtpDto {
    type: EverificationTypes;
    email: string;
}
export declare class VerificationOtpDto {
    code: string;
}
export declare class VerifyOtpDto {
    type: string;
    email: string;
    otp: string;
}
export declare class IChekOtp {
    type: string;
    email: string;
    otp: string;
}
