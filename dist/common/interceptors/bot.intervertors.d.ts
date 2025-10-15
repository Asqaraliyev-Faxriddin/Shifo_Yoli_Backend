import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
export declare class TelegramInterceptor implements NestInterceptor {
    private readonly jwtService;
    private readonly logger;
    constructor(jwtService: JwtService);
    intercept(context: ExecutionContext, next: CallHandler): Promise<import("rxjs").Observable<any>>;
}
