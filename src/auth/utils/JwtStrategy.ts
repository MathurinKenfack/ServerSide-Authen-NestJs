import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { AccessPayload, RefreshPayload } from '../types/JWTPayload';
import { accessTokenExtractor, refreshTokenExtractor } from './jwtExtrator';
import { Request as RequestExp } from 'express';
import { UsersService } from '../../users/services/users/users.service';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @Inject('USERS_SERVICE') private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: accessTokenExtractor,
      ignoreExpiration: false,
      secretOrKey: process.env.ACCESS_TOKEN_SECRET,
    });
  }

  async validate(payload: AccessPayload) {
    console.log('In validation of access token');
    console.log(payload);
    const userInfo = await this.usersService.getUserById(payload.id);
    return {
      username: userInfo.firstName + ' ' + userInfo.lastName,
      ...payload,
    };
  }
}

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    @Inject('USERS_SERVICE') private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: refreshTokenExtractor,
      ignoreExpiration: false,
      secretOrKey: process.env.REFRESH_TOKEN_SECRET,
      passReqToCallback: true,
    });
  }

  validate(req: RequestExp, payload: RefreshPayload) {
    console.log(payload);
    console.log('In validation of refresh token');
    const refreshToken = req.cookies['auth-token'];
    return { ...payload, refreshToken: refreshToken };
  }
}
