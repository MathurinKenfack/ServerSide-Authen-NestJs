import { Injectable } from '@nestjs/common';
import { UserEntity } from '../../../typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../../dto/CreateUser.dto';
import { encodePassword } from '../../../utils/bcrypt';
import { SerializedUser } from '../../types/User.serialized';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async getAllUsers() {
    return this.usersRepository.find().then((users) => {
      return users.map((user) => new SerializedUser(user));
    });
  }

  getUserById(id: number) {
    return this.usersRepository.findOneBy({ id }).then((u) => {
      return new SerializedUser(u);
    });
  }

  getUserByEmail(email: string) {
    return this.usersRepository.findOneBy({ email: email }).then((u) => {
      return new SerializedUser(u);
    });
  }

  createUser(user: CreateUserDto) {
    const passwordHashed = encodePassword(user.password);
    const newUser = this.usersRepository.create({
      ...user,
      password: passwordHashed,
    });
    return this.usersRepository.save(newUser);
  }
}
