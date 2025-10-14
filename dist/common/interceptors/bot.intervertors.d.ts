import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
export declare class TelegramInterceptor implements NestInterceptor {
    private readonly botToken;
    private readonly chatId;
    private readonly prisma;
    private loger;
    private jwtService;
    intercept(context: ExecutionContext, next: CallHandler): Promise<import("rxjs").Observable<any>>;
}
