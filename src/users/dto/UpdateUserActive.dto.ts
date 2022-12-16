import { IsNotEmpty } from 'class-validator';

export class UpdateUserActiveDto {
	@IsNotEmpty()
	active: boolean;
}
