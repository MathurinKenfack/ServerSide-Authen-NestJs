import {
  Controller,
  Inject,
  Get,
  Post,
  UsePipes,
  Body,
  Param,
  ValidationPipe,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { CreateUserDto } from '../../../users/dto/CreateUser.dto';
import { UsersService } from '../../../users/services/users/users.service';

@Controller('users')
export class UsersController {
  constructor(
    @Inject('USERS_SERVICE') private readonly usersService: UsersService,
  ) {}

  @Get('')
  async getAllCustomers() {
    const customers = await this.usersService.getAllUsers();
    return customers;
  }

  @Get(':email')
  getUser(@Param('email') email: string) {
    const user = this.usersService.getUserByEmail(email);

    if (user) return user;
    else throw new HttpException('Customer Not Found!', HttpStatus.BAD_REQUEST);
  }

  @Post('create')
  @UsePipes(ValidationPipe)
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }
}
