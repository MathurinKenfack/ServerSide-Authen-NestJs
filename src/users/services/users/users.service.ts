import { Injectable } from '@nestjs/common';
import { UserEntity } from '../../../typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../../dto/CreateUser.dto';
import { encodePassword } from '../../../utils/bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async getAllUsers() {
    return this.usersRepository.find().then((users) => {
      return users;
    });
  }

  getUserById(id: number) {
    return this.usersRepository.findOneBy({ id });
  }

  getUserByEmail(email: string) {
    return this.usersRepository.findOneBy({ email: email });
  }

  createUser(user: CreateUserDto) {
    const passwordHashed = encodePassword(user.password);
    const newUser = this.usersRepository.create({
      ...user,
      password: passwordHashed,
      googleAuth: false,
    });
    return this.usersRepository.save(newUser);
  }
}
