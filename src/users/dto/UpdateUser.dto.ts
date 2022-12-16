import { UpdateUserActiveDto } from './UpdateUserActive.dto';
import { UpdateUserLastLoginDto } from './updateUserLastLogin.dto';
import { UpdateUserPasswordDto } from './UpdateUserPassword.dto';
import { UpdateUserRefreshTokenDto } from './UpdateUserRefreshToken.dto';

export type UpdateUserDto =
	| UpdateUserLastLoginDto
	| UpdateUserPasswordDto
	| UpdateUserRefreshTokenDto
	| UpdateUserActiveDto;
