import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-http-bearer';
import { AuthService } from './auth.service';

@Injectable()
export class PassportBearerStrategy extends PassportStrategy(
  Strategy,
  'bearer',
) {
  constructor(private authService: AuthService) {
    super();
  }
  async validate(token: string, done: any) {
    const user = await this.authService.verifyTokenReturnUser(token);
    return done(null, user)
  }
}