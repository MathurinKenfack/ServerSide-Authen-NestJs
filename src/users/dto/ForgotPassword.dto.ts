import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ForgotPasswordDto {
	@IsNotEmpty()
	@IsEmail()
	email: string;
}
