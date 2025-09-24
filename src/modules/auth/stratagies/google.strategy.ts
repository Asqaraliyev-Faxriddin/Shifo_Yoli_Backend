import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import * as dotenv from 'dotenv';

 
dotenv.config();   

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.CLIENT_ID as string,
      clientSecret: process.env.CLIENT_SECRET as string,
      callbackURL: process.env.GOOGLE_CALLBACK_URL as string,
      scope: [
        'email',
        'profile',
        'https://www.googleapis.com/auth/user.birthday.read', 
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
