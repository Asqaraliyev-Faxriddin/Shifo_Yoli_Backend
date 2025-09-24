import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-github2';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor() {
    super({

      clientID: 'Ov23linhi55EGdywrBJ8',
      clientSecret: 'afc292f4a5b4ebb30fa53ae2e3e8c86c172260d4',
      callbackURL: 'https://faxriddin.bobur-dev.uz/auth/github/callback',
      scope: ['user:email'], // faqat email olish uchun yetarli
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { username, emails, photos } = profile;

    const user = {
      email: emails?.[0]?.value,
      username,
      picture: photos?.[0]?.value,
      accessToken,
    };

    done(null, user);
  }
}
