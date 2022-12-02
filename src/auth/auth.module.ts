import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../typeorm';
import { UsersService } from '../users/services/users/users.service';
import { AuthController } from './controllers/auth/auth.controller';
import { AuthService } from './services/auth/auth.service';
import { LocalStrategy } from './utils/LocalStrategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './utils/JwtStrategy';
import { JwtSerializer } from './utils/JwtSerializer';
import { SessionSerializer } from './utils/SessionSerializer';
import { GoogleStrategy } from './utils/googleStrategy';

const Jwt = JwtModule.register({
  secret: process.env.JWT_KEY,
  signOptions: { expiresIn: '5h' },
});
@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    PassportModule.register({ jwt: true }),
    Jwt,
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
    JwtStrategy,
    GoogleStrategy,
    JwtSerializer,
  ],
  exports: [Jwt],
})
export class AuthModule {}
