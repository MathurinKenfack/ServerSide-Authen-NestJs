import { IsNotEmpty } from 'class-validator';

export class UpdateUserLastLoginDto {
	@IsNotEmpty()
	lastLogin: Date;
}
