import {
	BadRequestException,
	ForbiddenException,
	Inject,
	Injectable,
	Logger,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common';

import {
	comapareData,
	comaparePasswords,
	encodeData,
	encodePassword,
} from '../../../utils/bcrypt';

import { JwtService } from '@nestjs/jwt';
import { Request as RequestExp } from 'express';
import { UsersService } from '../../../users/services/users/users.service';
import { GooglePayload } from '../../types/GooglePayload';
import { JwtPayload } from '../../types/JWTPayload';
import { MailService } from '../../../mail/services/mail/mail.service';
import { ChangeUserPasswordDto } from 'src/users/dto/ChangeUserPassword.dto';
import { env } from 'process';

@Injectable()
export class AuthService {
	constructor(
		@Inject('USERS_SERVICE') private readonly usersService: UsersService,
		private jwtService: JwtService,
		private mailService: MailService,
	) {}

	private readonly logger = new Logger(AuthService.name);

	async validateUser(email: string, password: string) {
		this.logger.log({ email: email }, this.validateUser.name);
		const userDB = await this.usersService.getUserByEmail(email);
		if (userDB) {
			this.logger.log(
				{ email: email, report: 'User was found' },
				this.validateUser.name,
			);
			const matched = comaparePasswords(password, userDB.password);
			if (matched) {
				this.logger.log(
					{ email: email, report: 'Valid password' },
					this.validateUser.name,
				);

				return userDB;
			} else {
				this.logger.error(
					{ email: email, report: 'Invalid password' },
					this.validateUser.name,
				);
				throw new BadRequestException('Password is incorrect.');
			}
		}
		this.logger.error(
			{ email: email, report: 'User does not exist.' },
			this.validateUser.name,
		);
		throw new BadRequestException('User does not exist.');
	}

	async getTokens(payload: { id: number }) {
		this.logger.log({ payload: payload }, this.getTokens.name);
		const [accessToken, refreshToken] = await Promise.all([
			this.jwtService.signAsync(payload, {
				secret: process.env.ACCESS_TOKEN_SECRET,
				expiresIn: process.env.ACCESS_TOKEN_EXPIRATION,
			}),
			this.jwtService.signAsync(payload, {
				secret: process.env.REFRESH_TOKEN_SECRET,
				expiresIn: process.env.REFRESH_TOKEN_EXPIRATION,
			}),
		]);

		this.logger.log(
			{ payload: payload, report: 'Success' },
			this.getTokens.name,
		);
		return { accessToken, refreshToken };
	}

	async updateRefreshToken(id: number, refreshToken: string) {
		this.logger.log({ id: id }, this.updateRefreshToken.name);
		let hashedRefreshToken = null;
		if (refreshToken) {
			this.logger.log(
				{ id: id, report: 'Refresh token not null, hashing it...' },
				this.updateRefreshToken.name,
			);
			hashedRefreshToken = encodeData(refreshToken);
			this.logger.log(
				{ id: id, report: 'Refresh token successfully hashed.' },
				this.updateRefreshToken.name,
			);
		}
		this.logger.log(
			{ id: id, report: 'Storing the token in DB.' },
			this.updateRefreshToken.name,
		);
		const updateResult = await this.usersService.updateUser(id, {
			refreshToken: hashedRefreshToken,
		});
		this.logger.log(
			{ id: id, report: 'Success' },
			this.updateRefreshToken.name,
		);
	}

	async updateLastLogin(id: number) {
		const date = new Date();
		this.logger.log(
			{ id: id, report: 'updating the last login.' },
			this.updateLastLogin.name,
		);
		const updateResult = await this.usersService.updateUser(id, {
			lastLogin: date,
		});
		this.logger.log(
			{ id: id, date: date.toLocaleDateString, report: 'Success' },
			this.updateLastLogin.name,
		);
	}

	async createAccessTokenFromRefreshToken(refreshToken: string) {
		try {
			this.logger.log(
				{ report: 'create Access Token' },
				this.createAccessTokenFromRefreshToken.name,
			);
			const decodedRefresh = (await this.jwtService.verifyAsync(
				refreshToken,
				{ secret: process.env.REFRESH_TOKEN_SECRET },
			)) as JwtPayload;
			if (!decodedRefresh) {
				this.logger.error(
					{ report: 'Refresh token expired.' },
					this.createAccessTokenFromRefreshToken.name,
				);
				throw new UnauthorizedException('Expired Session.');
			}
			this.logger.log(
				{ report: 'Refresh token decoded.' },
				this.createAccessTokenFromRefreshToken.name,
			);
			this.logger.log(
				{ report: 'Look for a User.' },
				this.createAccessTokenFromRefreshToken.name,
			);
			const user = await this.usersService.getUserById(decodedRefresh.id);

			if (!user) {
				this.logger.log(
					{ report: 'User not found.' },
					this.createAccessTokenFromRefreshToken.name,
				);
				throw new NotFoundException('User does not exist.');
			} else if (!user.refreshToken) {
				this.logger.log(
					{ report: 'User found but not Logged In.' },
					this.createAccessTokenFromRefreshToken.name,
				);
				throw new ForbiddenException('Access Denied.');
			}
			const isRefreshTokenMatching = comapareData(
				refreshToken,
				user.refreshToken,
			);

			if (!isRefreshTokenMatching) {
				this.logger.log(
					{ report: 'Refresh Tokens does not match.' },
					this.createAccessTokenFromRefreshToken.name,
				);
				throw new UnauthorizedException('Invalid Token');
			}

			this.logger.log(
				{ report: 'Refresh Tokens match.' },
				this.createAccessTokenFromRefreshToken.name,
			);
			this.logger.log(
				{ report: 'Refresh LastLogin.' },
				this.createAccessTokenFromRefreshToken.name,
			);
			await this.updateLastLogin(user.id);
			this.logger.log(
				{ report: 'Generate Access Token.' },
				this.createAccessTokenFromRefreshToken.name,
			);
			return await this.jwtService.signAsync(
				{ id: user.id },
				{
					secret: process.env.ACCESS_TOKEN_SECRET,
					expiresIn: process.env.ACCESS_TOKEN_EXPIRATION,
				},
			);
		} catch {
			this.logger.error(
				{ report: 'Invalid Refresh Token.' },
				this.createAccessTokenFromRefreshToken.name,
			);
			throw new UnauthorizedException('Invalid token.');
		}
	}

	async loginUser(user: any) {
		this.logger.log(
			{
				id: user.id,
				report: 'Verified User...create, store and return his tokens.',
			},
			this.loginUser.name,
		);
		const payload = {
			id: user.id,
		};
		const tokens = await this.getTokens(payload);
		await this.updateRefreshToken(user.id, tokens.refreshToken);
		await this.updateLastLogin(user.id);

		return tokens;
	}

	async googleLoginUser(req: RequestExp) {
		this.logger.error(
			{
				report: 'Create, store and return tokens for google authenticated user.',
			},
			this.googleLoginUser.name,
		);
		if (!req.user) {
			this.logger.error(
				{
					report: 'User unauthenticated.',
				},
				this.googleLoginUser.name,
			);
			throw new BadRequestException('Unauthenticated');
		}

		const user = <GooglePayload>req.user;
		this.logger.log(
			{
				email: user.email,
				report: 'Check if User exists in the database.',
			},
			this.googleLoginUser.name,
		);
		const userExists = await this.usersService.getUserByEmail(user.email);

		if (!userExists) {
			this.logger.log(
				{
					email: user.email,
					report: 'User does not exist, register the user.',
				},
				this.googleLoginUser.name,
			);
			const [firstName, lastName] = user.username.split(' ');
			const newUser = await this.usersService.createGoogleUser({
				firstName: firstName,
				lastName: lastName,
				email: user.email,
			});
			this.logger.log(
				{
					email: user.email,
					report: 'User has been registered, generating the tokens',
				},
				this.googleLoginUser.name,
			);
			const tokens = await this.getTokens({ id: newUser.id });
			this.logger.log(
				{
					email: user.email,
					report: 'Updating the refresh token in DB.',
				},
				this.googleLoginUser.name,
			);
			await this.updateRefreshToken(newUser.id, tokens.refreshToken);
			await this.updateLastLogin(newUser.id);

			this.logger.log(
				{
					email: user.email,
					report: 'Refresh token successfully updated.',
				},
				this.googleLoginUser.name,
			);
			return tokens;
		}

		this.logger.log(
			{
				email: user.email,
				report: 'User exist in DB, generating the tokens.',
			},
			this.googleLoginUser.name,
		);
		const tokens = await this.getTokens({ id: userExists.id });
		this.logger.log(
			{
				email: user.email,
				report: 'Updating the refresh token in DB.',
			},
			this.googleLoginUser.name,
		);
		await this.updateRefreshToken(userExists.id, tokens.refreshToken);
		await this.updateLastLogin(userExists.id);

		this.logger.log(
			{
				email: user.email,
				report: 'Refresh token successfully updated.',
			},
			this.googleLoginUser.name,
		);
		return tokens;
	}

	async createResetPasswordToken(userEmail: string) {
		this.logger.log(
			{
				email: userEmail,
			},
			this.createResetPasswordToken.name,
		);
		const user = await this.usersService.getUserByEmail(userEmail);
		if (user?.id) {
			this.logger.log(
				{
					email: userEmail,
					report: 'User with email found, generating the reset password token.',
				},
				this.createResetPasswordToken.name,
			);
			const token = await this.jwtService.signAsync(
				{ id: user.id },
				{
					secret: process.env.RESET_PASSWORD_SECRET,
					expiresIn: process.env.RESET_PASSWORD_EXPIRATION,
				},
			);
			this.logger.log(
				{
					email: userEmail,
					report: 'Reset password token generated.',
				},
				this.createResetPasswordToken.name,
			);

			this.logger.log(
				{
					email: userEmail,
					report: 'Sending the mail...',
				},
				this.createResetPasswordToken.name,
			);
			await this.mailService.sendUserResetPassword(user, token);
			this.logger.log(
				{
					email: userEmail,
					report: 'Mail sent successfully.',
				},
				this.createResetPasswordToken.name,
			);
			return { result: true, report: 'success' };
		} else {
			this.logger.error(
				{
					email: userEmail,
					report: 'User with email not found.',
				},
				this.createResetPasswordToken.name,
			);
			return { result: false, error: 'user' };
		}
	}

	async verifyResetPasswordToken(token: string) {
		this.logger.log(
			{
				token: token,
			},
			this.verifyResetPasswordToken.name,
		);

		const payLoad = <JwtPayload>await this.jwtService.verifyAsync(token, {
			secret: process.env.RESET_PASSWORD_SECRET,
		});

		if (payLoad?.id) {
			this.logger.log(
				{
					token: token,
					userId: payLoad.id,
					report: 'Token decoded successfully.',
				},
				this.verifyResetPasswordToken.name,
			);
			const user = await this.usersService.getUserById(payLoad.id);

			if (user.id) {
				this.logger.log(
					{
						token: token,
						userId: user.id,
						report: 'User found.',
					},
					this.verifyResetPasswordToken.name,
				);
				return { result: true };
			} else {
				this.logger.error(
					{
						token: token,
						payloadId: payLoad.id,
						report: 'User not found.',
					},
					this.verifyResetPasswordToken.name,
				);
				return { result: false, report: 'User not found.' };
			}
		}
		this.logger.error(
			{
				token: token,
				report: 'Invalid token.',
			},
			this.verifyResetPasswordToken.name,
		);
		return { result: false, error: 'Invalid token.' };
	}

	async resetUserPassword(changeUserPasswordDto: ChangeUserPasswordDto) {
		this.logger.log(
			{
				token: changeUserPasswordDto.token,
				report: 'compare password and confirm password....',
			},
			this.resetUserPassword.name,
		);
		const { password, confirmPassword, token } = changeUserPasswordDto;
		if (password === confirmPassword) {
			this.logger.log(
				{
					token: changeUserPasswordDto.token,
					report: 'Password and confirm password matched. Decode token...',
				},
				this.resetUserPassword.name,
			);
			const jwtPayload = <JwtPayload>await this.jwtService.verifyAsync(
				token,
				{
					secret: process.env.RESET_PASSWORD_SECRET,
				},
			);

			if (jwtPayload?.id) {
				this.logger.log(
					{
						token: changeUserPasswordDto.token,
						userId: jwtPayload.id,
						report: 'Token decoded successfully. Updating user password...',
					},
					this.resetUserPassword.name,
				);
				const resetResult = await this.usersService.updateUser(
					jwtPayload.id,
					{ password: encodePassword(password) },
				);
				if (resetResult.affected > 0) {
					this.logger.log(
						{
							token: changeUserPasswordDto.token,
							userId: jwtPayload.id,
							report: 'User password updated successfully.',
						},
						this.resetUserPassword.name,
					);

					return { result: true };
				} else {
					this.logger.error(
						{
							token: changeUserPasswordDto.token,
							userId: jwtPayload.id,
							report: 'Internal Error, could not update password',
						},
						this.resetUserPassword.name,
					);

					return { result: false, error: 'Internal Error.' };
				}
			} else {
				this.logger.error(
					{
						token: changeUserPasswordDto.token,
						report: 'Invalid token.',
					},
					this.resetUserPassword.name,
				);

				return { result: false, error: 'Invalid token.' };
			}
		} else {
			this.logger.error(
				{
					token: changeUserPasswordDto.token,
					report: 'password and confirm password not equal.',
				},
				this.resetUserPassword.name,
			);
			return {
				result: false,
				error: 'unmatched password.',
			};
		}
	}

	async logout(id: number) {
		this.logger.log(
			{
				id: id,
			},
			this.logout.name,
		);
		await this.updateRefreshToken(id, null);
	}
}
