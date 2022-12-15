import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from '../../../typeorm';

@Injectable()
export class MailService {
	constructor(private readonly mailerService: MailerService) {}

	async sendUserResetPassword(user: User, token: string) {
		const url =
			process.env.SITE_DOMAIN +
			':' +
			process.env.NEST_PORT +
			`/auth/reset-password?token=${token}`;

		await this.mailerService.sendMail({
			to: user.email,
			subject: 'Auth System',
			template: './resetPassword',
			context: {
				name: (user.firstName + ' ' + user.lastName).toUpperCase(),
				url,
			},
		});
	}
}
