import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { SendUserMailDto } from '../../../users/dto/sendUserMail.dto';

@Injectable()
export class MailService {
	constructor(private readonly mailerService: MailerService) {}

	async sendUserResetPassword(user: SendUserMailDto, token: string) {
		const resetPasswordUrl =
			process.env.SITE_DOMAIN +
			':' +
			process.env.NEST_PORT +
			`/auth/reset-password?token=${token}`;

		await this.mailerService.sendMail({
			to: user.email,
			subject: 'AuthSystem: Reset your Password',
			template: './resetPassword',
			context: {
				name: (user.firstName + ' ' + user.lastName).toUpperCase(),
				url: resetPasswordUrl,
			},
		});
	}

	async sendUserEmailConfirmation(user: SendUserMailDto, token: string) {
		const confirmEmailUrl =
			process.env.SITE_DOMAIN +
			':' +
			process.env.NEST_PORT +
			`/auth/confirm-email?token=${token}`;

		console.log(confirmEmailUrl);
		const output = await this.mailerService.sendMail({
			to: user.email,
			subject: 'AuthSystem: Please confirm your account.',
			template: './confirmEmail',
			context: {
				name: (user.firstName + ' ' + user.lastName).toUpperCase(),
				url: confirmEmailUrl,
			},
		});
		console.log(output);
	}
}
