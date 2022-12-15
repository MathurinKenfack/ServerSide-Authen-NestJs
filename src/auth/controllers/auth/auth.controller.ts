import {
	Controller,
	UseGuards,
	Post,
	Get,
	Req,
	Res,
	Inject,
	Body,
	HttpException,
	HttpStatus,
} from '@nestjs/common';
import { Request as RequestExp, Response as ResponseExp } from 'express';
import {
	GoogleOauthGuard,
	AccessTokenGuard,
	RefreshTokenGuard,
	LocalAuthGuard,
} from '../../utils/LocalGuards';
import { AuthService } from '../../services/auth/auth.service';
import { Recaptcha } from '@nestlab/google-recaptcha';
import { Csrf } from 'ncsrf';
import {
	AUH_URL,
	HOME_URL,
	RESET_PASSWORD_URL,
} from '../../../utils/formActions';
import { ForgotPasswordDto } from '../../../users/dto/forgotPassword.dto';
import { QueryRequired } from '../../../decorators/Query.decorator';
import { ChangeUserPasswordDto } from '../../../users/dto/ChangeUserPassword.dto';

@Controller('auth')
export class AuthController {
	constructor(
		@Inject('AUTH_SERVICE') private readonly authService: AuthService,
	) {}

	@UseGuards(LocalAuthGuard)
	@Recaptcha()
	@Csrf()
	@Post('login')
	async login(@Req() req: RequestExp, @Res() response: ResponseExp) {
		const token = await this.authService.loginUser(req.user);
		response
			.cookie('api-token', token.accessToken, {
				httpOnly: true,
				secure: false,
			})
			.cookie('auth-token', token.refreshToken, {
				httpOnly: true,
				secure: false,
			})
			.redirect(303, HOME_URL);
	}

	@Csrf()
	@Post('forgot_password')
	async forgotPasswordMail(
		@Body() forgotPasswordDto: ForgotPasswordDto,
		@Res() response: ResponseExp,
	) {
		const { email } = forgotPasswordDto;
		await this.authService.createResetPasswordToken(email);
		return response.render('confirm', {
			title: 'Confirmation',
			message: 'A message was sent to your mail, to reset your password.',
			homeUrl: AUH_URL,
		});
	}

	@Get('reset-password')
	async resetPassword(
		@QueryRequired('token') token: string,
		@Req() request,
		@Res() response: ResponseExp,
	) {
		const tokenExistence = await this.authService.verifyResetPasswordToken(
			token,
		);
		if (!tokenExistence.result) {
			throw new HttpException(
				tokenExistence.error,
				HttpStatus.BAD_REQUEST,
			);
		} else {
			response.render('resetPassword', {
				csrf: request.csrfToken(),
				token: token,
				actionUrl: RESET_PASSWORD_URL,
			});
		}
	}

	@Csrf()
	@Post('user/reset_password')
	async changeUserPassword(
		@Body() changeUserPasswordDto: ChangeUserPasswordDto,
		@Res() response: ResponseExp,
	) {
		const reset = await this.authService.resetUserPassword(
			changeUserPasswordDto,
		);
		if (reset.result) {
			return response.render('confirm', {
				title: 'Confirmation',
				message: 'Your password was updated successfully.',
				homeUrl: AUH_URL,
			});
		} else {
			if (reset.error === 'Internal Error') {
				throw new HttpException(
					reset.error,
					HttpStatus.INTERNAL_SERVER_ERROR,
				);
			} else {
				throw new HttpException(reset.error, HttpStatus.BAD_REQUEST);
			}
		}
	}

	@Get('google')
	@UseGuards(GoogleOauthGuard)
	async googleAuth(@Req() req: RequestExp) {}

	@Get('google/callback')
	@UseGuards(GoogleOauthGuard)
	async googleAuthRedirect(@Req() req, @Res() response: ResponseExp) {
		const token = await this.authService.googleLoginUser(req);

		response
			.cookie('api-token', token.accessToken, {
				httpOnly: true,
				secure: false,
			})
			.cookie('auth-token', token.refreshToken, {
				httpOnly: true,
				secure: false,
			})
			.redirect(303, HOME_URL);
	}

	@UseGuards(RefreshTokenGuard)
	@Get('refresh')
	async refreshAccessToken(
		@Req() req: RequestExp,
		@Res() response: ResponseExp,
	) {
		const refreshToken = req.user['refreshToken'];
		const newAccessToken =
			await this.authService.createAccessTokenFromRefreshToken(
				refreshToken,
			);
		response
			.cookie('api-token', newAccessToken, {
				httpOnly: true,
				secure: false,
			})
			.redirect(303, HOME_URL);
	}

	@UseGuards(AccessTokenGuard)
	@Get('status')
	async getAuthStatus(@Req() req: RequestExp) {
		return req.user;
	}

	@UseGuards(AccessTokenGuard)
	@Get('logout')
	async logout(@Req() req: RequestExp, @Res() response: ResponseExp) {
		await this.authService.logout(req.user['id']);
		response.clearCookie('api-token');
		response.clearCookie('auth-token');
		response.redirect(303, AUH_URL);
	}
}
