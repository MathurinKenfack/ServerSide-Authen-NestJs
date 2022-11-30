import { Inject, Injectable } from '@nestjs/common';
import { comaparePasswords } from '../../../utils/bcrypt';
import { UsersService } from '../../../users/services/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject('USERS_SERVICE') private readonly usersService: UsersService,
  ) {}

  async validateUser(email: string, password: string) {
    const userDB = await this.usersService.getUserByEmail(email);
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
}
