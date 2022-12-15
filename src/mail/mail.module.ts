import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { MailService } from './services/mail/mail.service';
import { join } from 'path';

@Module({
	imports: [
		MailerModule.forRoot({
			transport: {
				host: process.env.MAILER_HOST,
				secure: false,
				auth: {
					user: process.env.MAILER_AUTH_USER,
					pass: process.env.MAILER_AUTH_PASSWORD,
				},
			},
			defaults: {
				from: `"No Reply" <${process.env.MAILER_FROM_ADDRESS}>`,
			},
			template: {
				dir: join(__dirname, '..', '..', 'templates'),
				adapter: new HandlebarsAdapter(),

				options: {
					strict: true,
				},
			},
		}),
	],
	providers: [MailService],
	exports: [MailService],
})
export class MailModule {}
