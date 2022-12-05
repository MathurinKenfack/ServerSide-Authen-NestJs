import { Injectable } from '@nestjs/common';
import { UserEntity } from '../../../typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../../dto/CreateUser.dto';
import { encodePassword } from '../../../utils/bcrypt';
import { SerializedUser } from '../../types/User.serialized';
import { CreateGoogleUserDto } from '../../dto/CreateGoogleUser.dto';
import { captitaliseWord } from '../../../utils/helpers';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async getAllUsers() {
    return this.usersRepository.find().then((users) => {
      if (users.length === 0) {
        return [];
      }
      return users.map((user) => new SerializedUser(user));
    });
  }

  getUserById(id: number) {
    return this.usersRepository.findOneBy({ id }).then((u) => {
      if (u === null) {
        return null;
      }
      return new SerializedUser(u);
    });
  }

  getUserByEmail(email: string) {
    return this.usersRepository.findOneBy({ email: email }).then((u) => {
      if (u === null) {
        return null;
      }
      return new SerializedUser(u);
    });
  }

  createUser(user: CreateUserDto) {
    const passwordHashed = encodePassword(user.password);
    const newUser = this.usersRepository.create({
      ...user,
      firstName: captitaliseWord(user.firstName),
      lastName: captitaliseWord(user.lastName),
      password: passwordHashed,
    });
    return this.usersRepository.save(newUser);
  }

  createGoogleUser(user: CreateGoogleUserDto) {
    return this.usersRepository.save({
      ...user,
      firstName: captitaliseWord(user.firstName),
      lastName: captitaliseWord(user.lastName),
    });
  }
}
