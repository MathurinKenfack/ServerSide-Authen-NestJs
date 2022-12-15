import { IsNotEmpty } from 'class-validator';

export class UpdateUserRefreshTokenDto {
	@IsNotEmpty()
	refreshToken: string;
}
