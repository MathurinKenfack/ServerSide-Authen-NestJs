import { Inject } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { UsersService } from '../../users/services/users/users.service';
import { UserEntity } from '../../typeorm';

export class JwtSerializer extends PassportSerializer {
  constructor(
    @Inject('USERS_SERVICE')
    private readonly usersService: UsersService,
  ) {
    super();
  }

  serializeUser(user: UserEntity, done: (err, user: UserEntity) => void) {
    console.log('Serialized User');
    done(null, user);
  }

  async deserializeUser(
    user: UserEntity,
    done: (err, user: UserEntity) => void,
  ) {
    console.log('Deserialize User');
    const userDB = await this.usersService.getUserById(user.id);
    return userDB ? done(null, userDB) : done(null, null);
  }
}
