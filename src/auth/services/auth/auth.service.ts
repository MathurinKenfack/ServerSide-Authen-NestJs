import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { comaparePasswords } from '../../../utils/bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../../users/services/users/users.service';
import { UserI } from '../../../users/types/User.interface';
import { SerializedUser } from '../../../users/types/User.serialized';

@Injectable()
export class AuthService {
  constructor(
    @Inject('USERS_SERVICE') private readonly usersService: UsersService,
    private jwtService: JwtService,
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

  async googleLoginUser(user: any) {
    if (!user) {
      throw new BadRequestException('Unauthenticated');
    }

    const userExists = await this.usersService.getUserByEmail(user.email);

    if (!userExists) {
      const newUser = await this.usersService.createUser(user);
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
