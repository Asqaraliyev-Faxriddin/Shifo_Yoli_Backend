import { OnModuleInit } from '@nestjs/common';
export declare class RedisService implements OnModuleInit {
    private client;
    onModuleInit(): Promise<void>;
    set(key: string, value: string, seconds: number): Promise<void>;
    get(key: string): Promise<string | null>;
    del(key: string): Promise<void>;
}
