import { IsEmail, IsNotEmpty, IsNumber, MinLength } from 'class-validator';

export class SendUserMailDto {
	@IsNotEmpty()
	@IsNumber()
	id: number;

	@IsNotEmpty()
	@MinLength(3)
	firstName: string;

	@IsNotEmpty()
	@MinLength(3)
	lastName: string;

	@IsEmail()
	@IsNotEmpty()
	email: string;
}
