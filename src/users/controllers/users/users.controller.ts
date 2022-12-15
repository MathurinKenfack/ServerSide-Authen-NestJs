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
	ClassSerializerInterceptor,
	UseInterceptors,
	Logger,
} from '@nestjs/common';
import { SerializedUser } from '../../types/User.serialized';
import { CreateUserDto } from '../../dto/CreateUser.dto';
import { UsersService } from '../../services/users/users.service';

@Controller('users')
export class UsersController {
	constructor(
		@Inject('USERS_SERVICE') private readonly usersService: UsersService,
	) {}

	@UseInterceptors(ClassSerializerInterceptor)
	@Get('')
	async getUsers() {
		const customers = await this.usersService.getAllUsers();

		return customers;
	}

	@UseInterceptors(ClassSerializerInterceptor)
	@Get(':email')
	async getUserByEmail(@Param('email') email: string) {
		const user = await this.usersService.getUserByEmail(email);

		if (user) return new SerializedUser(user);
		else
			throw new HttpException(
				'Customer Not Found!',
				HttpStatus.BAD_REQUEST,
			);
	}

	@UseInterceptors(ClassSerializerInterceptor)
	@Post('create')
	@UsePipes(ValidationPipe)
	createUser(@Body() createUserDto: CreateUserDto) {
		return this.usersService.createUser(createUserDto);
	}
}
