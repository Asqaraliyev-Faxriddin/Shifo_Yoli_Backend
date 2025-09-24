import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor() {
    super({
      clientID: 'Ov23linhi55EGdywrBJ8',
      clientSecret: 'afc292f4a5b4ebb30fa53ae2e3e8c86c172260d4',
      callbackURL:'https://faxriddin.bobur-dev.uz/auth/github/callback',
      scope: [
        'user:email' 
      ],
    });
  }

  async validate( accessToken: string,  refreshToken: string,  profile: any,done: VerifyCallback,): Promise<any> {
    const { name, emails, photos, _json } = profile;

    let age: number | null = null;
    if (_json && _json.birthdays && _json.birthdays.length > 0) {
      const birthYear = _json.birthdays[0].date.year;
      if (birthYear) {
        const currentYear = new Date().getFullYear();
        age = currentYear - birthYear;
      }
    }

    const user = {
      email: emails?.[0]?.value,
      firstName: name?.givenName,
      lastName: name?.familyName,
      picture: photos?.[0]?.value, 
      age, 
      accessToken,
    };

    done(null, user);
  }
}
