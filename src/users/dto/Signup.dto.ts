import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class SignupDto {
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

	@IsNotEmpty()
	@MinLength(4)
	confirmPassword: string;
}
