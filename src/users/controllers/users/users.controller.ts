import {
	Controller,
	Inject,
	Get,
	Post,
	Body,
	Param,
	HttpStatus,
	HttpException,
	ClassSerializerInterceptor,
	UseInterceptors,
	Res,
} from '@nestjs/common';
import { SerializedUser } from '../../types/User.serialized';
import { CreateUserDto } from '../../dto/CreateUser.dto';
import { UsersService } from '../../services/users/users.service';
import { Csrf } from 'ncsrf';
import { SignupDto } from '../../dto/Signup.dto';
import { Response as ResponseExp } from 'express';
import { AUH_URL } from '../../../utils/formActions';
import { SendUserMailDto } from '../../dto/sendUserMail.dto';

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
	createUser(@Body() createUserDto: CreateUserDto) {
		return this.usersService.createUser(createUserDto);
	}

	@Csrf()
	@UseInterceptors(ClassSerializerInterceptor)
	@Post('signup')
	async signup(@Body() signupDto: SignupDto, @Res() response: ResponseExp) {
		const { password, confirmPassword } = signupDto;
		if (password === confirmPassword) {
			const { confirmPassword, ...createUserDto } = signupDto;
			const newUser = await this.usersService.createUser(createUserDto);
			if (newUser?.email) {
				const {
					password,
					lastLogin,
					refreshToken,
					active,
					...userPayLoad
				} = newUser;
				await this.usersService.sendMailConfirmation(userPayLoad);
				response.render('confirm', {
					title: 'sign up Confirmation',
					message:
						'Your have successfully registered to our system. Please check your email and confirm your account.',
					homeUrl: AUH_URL,
				});
			}
		} else {
			throw new HttpException(
				'password mismatched.',
				HttpStatus.BAD_REQUEST,
			);
		}
	}
}
