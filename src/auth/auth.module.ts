import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../typeorm';
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

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    PassportModule.register({ jwt: true }),
    GoogleRecaptchaModule.forRoot({
      secretKey: process.env.RECAPTCHA_SECRET_KEY,
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
export class AuthModule {}
