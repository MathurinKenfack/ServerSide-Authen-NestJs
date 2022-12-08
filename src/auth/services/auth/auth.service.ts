import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  comapareData,
  comaparePasswords,
  encodeData,
} from '../../../utils/bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Request as RequestExp } from 'express';
import { UsersService } from '../../../users/services/users/users.service';
import { GooglePayload } from '../../types/GooglePayload';
import { GoogleRecaptchaValidator } from '@nestlab/google-recaptcha';
import { RefreshPayload } from 'src/auth/types/JWTPayload';

@Injectable()
export class AuthService {
  constructor(
    @Inject('USERS_SERVICE') private readonly usersService: UsersService,
    private jwtService: JwtService,
    private readonly recaptchaValidator: GoogleRecaptchaValidator,
  ) {}

  async validateUser(email: string, password: string) {
    const userDB = await this.usersService.getUserByEmail(email);
    if (userDB) {
      const matched = comaparePasswords(password, userDB.password);
      if (matched) {
        return userDB;
      } else {
        throw new BadRequestException('Password is incorrect.');
      }
    }
    throw new BadRequestException('User does not exist.');
  }

  async getTokens(payload: { id: number }) {
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

    return { accessToken, refreshToken };
  }

  async updateRefreshToken(id: number, refreshToken: string) {
    const hashedRefreshToken = encodeData(refreshToken);
    await this.usersService.updateUserRefreshToken(id, {
      refreshToken: hashedRefreshToken,
    });
  }

  async createAccessTokenFromRefreshToken(refreshToken: string) {
    try {
      const decodedRefresh = this.jwtService.decode(
        refreshToken,
      ) as RefreshPayload;
      if (!decodedRefresh) {
        throw new UnauthorizedException('Expired Session.');
      }
      const user = await this.usersService.getUserById(decodedRefresh.id);

      if (!user) {
        console.error('User not found.');
        throw new NotFoundException('User does not exist.');
      } else if (!user.refreshToken) {
        console.error('Access denied');
        throw new ForbiddenException('Access Denied.');
      }
      const isRefreshTokenMatching = comapareData(
        refreshToken,
        user.refreshToken,
      );

      if (!isRefreshTokenMatching) {
        throw new UnauthorizedException('Invalid Token');
      }

      await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.REFRESH_TOKEN_SECRET,
      });

      return await this.jwtService.signAsync(
        { id: user.id },
        {
          secret: process.env.ACCESS_TOKEN_SECRET,
          expiresIn: process.env.ACCESS_TOKEN_EXPIRATION,
        },
      );
    } catch {
      throw new UnauthorizedException('Invalid token.');
    }
  }

  async loginUser(user: any) {
    console.log('In Login user');
    const payload = {
      id: user.id,
    };
    const tokens = await this.getTokens(payload);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async googleLoginUser(req: RequestExp) {
    if (!req.user) {
      throw new BadRequestException('Unauthenticated');
    }
    const user = <GooglePayload>req.user;
    const userExists = await this.usersService.getUserByEmail(user.email);

    if (!userExists) {
      const [firstName, lastName] = user.username.split(' ');
      const newUser = await this.usersService.createGoogleUser({
        firstName: firstName,
        lastName: lastName,
        email: user.email,
      });
      const tokens = await this.getTokens({ id: newUser.id });
      await this.updateRefreshToken(newUser.id, tokens.refreshToken);
      return tokens;
    }

    const tokens = await this.getTokens({ id: userExists.id });
    await this.updateRefreshToken(userExists.id, tokens.refreshToken);
    return tokens;
  }

  async logout(id: number) {
    await this.updateRefreshToken(id, null);
  }
}
