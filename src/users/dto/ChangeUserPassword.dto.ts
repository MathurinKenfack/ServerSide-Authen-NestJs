import { IsNotEmpty, MinLength } from 'class-validator';

export class ChangeUserPasswordDto {
	@IsNotEmpty()
	@MinLength(4)
	password: string;

	@IsNotEmpty()
	@MinLength(4)
	confirmPassword: string;

	@IsNotEmpty()
	token: string;
}
