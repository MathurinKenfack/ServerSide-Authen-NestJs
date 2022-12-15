import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import * as passport from 'passport';
import * as cookieParser from 'cookie-parser';
import 'dotenv/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { nestCsrf } from 'ncsrf';
import { AppModule } from './app.module';
import { ErrorFilter } from './filters/error.filter';
import { GoogleRecaptchaFilter } from './filters/google-recaptcha.filter';

async function bootstrap() {
	const port = parseInt(process.env.NEST_PORT) || 3000;
	const app = await NestFactory.create<NestExpressApplication>(AppModule, {
		logger: ['error', 'warn', 'log', 'debug'],
	});
	app.use(passport.initialize());
	app.use(cookieParser());
	app.enableCors({
		origin:
			process.env.SITE_DOMAIN +
			':' +
			(process.env.NEST_PORT ? process.env.NEST_PORT : '3000'),
		credentials: true,
	});
	app.useGlobalPipes(new ValidationPipe());
	app.useGlobalFilters(new ErrorFilter(), new GoogleRecaptchaFilter());
	app.use(nestCsrf());
	app.useStaticAssets(join(__dirname, '..', 'public'));
	app.setBaseViewsDir(join(__dirname, '..', 'views'));
	app.setViewEngine('hbs');
	await app.listen(port);
}

bootstrap();
