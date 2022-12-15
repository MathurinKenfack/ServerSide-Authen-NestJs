import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
	@IsNotEmpty()
	@MinLength(3)
	firstName: string;

	@IsNotEmpty()
	@MinLength(3)
	lastName: string;

	@IsEmail()
	@IsNotEmpty()
	email: string;

	@IsNotEmpty()
	@MinLength(4)
	password: string;
}
