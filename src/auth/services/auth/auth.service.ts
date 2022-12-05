import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { comaparePasswords } from '../../../utils/bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Request as RequestExp } from 'express';
import { UsersService } from '../../../users/services/users/users.service';
import { UserI } from '../../../users/types/User.interface';
import { SerializedUser } from '../../../users/types/User.serialized';
import { JWTPayload } from '../../types/JWTPayload';
import { GooglePayload } from '../../types/GooglePayload';
import { GoogleRecaptchaValidator } from '@nestlab/google-recaptcha';

@Injectable()
export class AuthService {
  constructor(
    @Inject('USERS_SERVICE') private readonly usersService: UsersService,
    private jwtService: JwtService,
    private readonly recaptchaValidator: GoogleRecaptchaValidator,
  ) {}

  async validateUser(email: string, password: string) {
    const userDB = await this.usersService.getUserByEmail(email);
    console.log('validate user');
    if (userDB) {
      const matched = comaparePasswords(password, userDB.password);

      if (matched) {
        return userDB;
      } else {
        return null;
      }
    }
    return null;
  }

  async loginUser(user: any) {
    const payload = {
      email: user.email,
      username: user.firstName + ' ' + user.lastName,
    };
    const jwt = {
      access_token: this.jwtService.sign(payload),
    };
    return jwt;
  }

  async googleLoginUser(req: RequestExp) {
    if (!req.user) {
      throw new BadRequestException('Unauthenticated');
    }
    const user = <GooglePayload>req.user;
    const userExists = await this.usersService.getUserByEmail(user.email);

    if (!userExists) {
      const [firstName, lastName] = user.username.split(' ');
      const newUser = await this.usersService.createGoogleUser({
        firstName: firstName,
        lastName: lastName,
        email: user.email,
      });
      return this.jwtService.sign({
        email: newUser.email,
        username: newUser.firstName + ' ' + newUser.lastName,
      });
    }

    return this.jwtService.sign({
      email: userExists.email,
      username: userExists.firstName + ' ' + userExists.lastName,
    });
  }
}
