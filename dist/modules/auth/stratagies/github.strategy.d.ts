import { VerifyCallback } from 'passport-github2';
declare const GithubStrategy_base: new (...args: any) => any;
export declare class GithubStrategy extends GithubStrategy_base {
    constructor();
    validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any>;
}
export {};
