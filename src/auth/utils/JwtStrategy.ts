import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { JWTPayload } from '../types/JWTPayload';
import { cookieExtractor } from './jwtExtrator';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt2') {
  constructor() {
    super({
      jwtFromRequest: cookieExtractor,
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_KEY,
    });
  }

  async validate(payload: JWTPayload) {
    return payload;
  }
}
