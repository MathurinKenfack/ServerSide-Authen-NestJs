import { Injectable } from '@nestjs/common';
import { UserEntity } from '../../../typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../../dto/CreateUser.dto';
import { encodePassword } from '../../../utils/bcrypt';
import { SerializedUser } from '../../types/User.serialized';
import { CreateGoogleUserDto } from '../../dto/CreateGoogleUser.dto';
import { captitaliseWord } from '../../../utils/helpers';
import { UpdateUserRefreshTokenDto } from '../../dto/UpdateUserRefreshToken.dto';

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
    return this.usersRepository.findOneBy({ id: id }).then((user) => {
      if (user?.id) {
        return new SerializedUser(user);
      }
      return null;
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

  async updateUserRefreshToken(
    id: number,
    updateUserRefreshDto: UpdateUserRefreshTokenDto,
  ) {
    return await this.usersRepository.update({ id: id }, updateUserRefreshDto);
  }

  createUser(user: CreateUserDto) {
    const passwordHashed = encodePassword(user.password);
    const newUser = this.usersRepository.create({
      ...user,
      firstName: captitaliseWord(user.firstName),
      lastName: captitaliseWord(user.lastName),
      password: passwordHashed,
      refreshToken: null,
    });
    return this.usersRepository.save(newUser).then((u) => {
      return new SerializedUser(u);
    });
  }

  createGoogleUser(user: CreateGoogleUserDto) {
    return this.usersRepository.save({
      ...user,
      firstName: captitaliseWord(user.firstName),
      lastName: captitaliseWord(user.lastName),
      refreshToken: null,
    });
  }
}
