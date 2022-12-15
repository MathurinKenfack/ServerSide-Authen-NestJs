import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from '../users/services/users/users.service';
import { AuthController } from './controllers/auth/auth.controller';
import { AuthService } from './services/auth/auth.service';
import { LocalStrategy } from './utils/LocalStrategy';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenStrategy, RefreshTokenStrategy } from './utils/JwtStrategy';
import { JwtSerializer } from './utils/JwtSerializer';
import { GoogleStrategy } from './utils/googleStrategy';
import { GoogleRecaptchaModule } from '@nestlab/google-recaptcha';
import { GoogleRecaptchaNetwork } from '@nestlab/google-recaptcha/enums/google-recaptcha-network';
import { LoggerMiddleware } from './middlewares/logger/logger.middleware';
import { MailModule } from '../mail/mail.module';
import { User } from '../typeorm';

@Module({
	imports: [
		MailModule,
		TypeOrmModule.forFeature([User]),
		PassportModule.register({ jwt: true }),
		GoogleRecaptchaModule.forRoot({
			secretKey: process.env.RECAPTCHA_SECRET_KEY_TEST,
			response: (req) => req.body['g-recaptcha-response'],
			network: GoogleRecaptchaNetwork.Recaptcha,
		}),
		JwtModule.register({}),
	],
	controllers: [AuthController],
	providers: [
		{
			provide: 'AUTH_SERVICE',
			useClass: AuthService,
		},
		{
			provide: 'USERS_SERVICE',
			useClass: UsersService,
		},
		LocalStrategy,
		AccessTokenStrategy,
		RefreshTokenStrategy,
		GoogleStrategy,
		JwtSerializer,
	],
})
export class AuthModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(LoggerMiddleware).forRoutes('auth');
	}
}
