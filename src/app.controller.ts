import { Controller, Get, Res, Req, UseGuards, Query } from '@nestjs/common';
import { Response, Request } from 'express';
import { AccessTokenGuard } from './auth/utils/LocalGuards';
import {
	AUH_URL,
	loginAction,
	logoutAction,
	SEND_RESET_MAIL,
	SIGN_UP_URL,
} from './utils/formActions';

@Controller()
export class AppController {
	@Get()
	root(@Req() request, @Res() response: Response) {
		return response.render('login', {
			...loginAction,
			csrf: request.csrfToken(),
		});
	}

	@Get('signup')
	signup(@Req() request, @Res() response: Response) {
		return response.render('signup', {
			actionUrl: SIGN_UP_URL,
			csrf: request.csrfToken(),
		});
	}

	@Get('forgot_password')
	forgotPassword(@Req() request, @Res() response: Response) {
		return response.render('forgotPassword', {
			actionUrl: SEND_RESET_MAIL,
			login: AUH_URL,
			csrf: request.csrfToken(),
		});
	}

	@UseGuards(AccessTokenGuard)
	@Get('welcome')
	welcomePage(
		@Query('auth') auth: string,
		@Req() request: Request,
		@Res() response: Response,
	) {
		const user = request.user;

		return response
			.append('authorization', auth)
			.render('index', { ...user, ...logoutAction });
	}
}
