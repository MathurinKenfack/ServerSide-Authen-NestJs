import {
  Controller,
  UseGuards,
  Post,
  Get,
  Req,
  Res,
  Inject,
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
import { AUH_URL, HOME_URL } from 'src/utils/fomActions';
@Controller('auth')
export class AuthController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: AuthService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Recaptcha()
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

  @Get('google')
  @UseGuards(GoogleOauthGuard)
  async googleAuth(@Req() req: RequestExp) {}

  @Get('google/callback')
  @UseGuards(GoogleOauthGuard)
  async googleAuthRedirect(@Req() req, @Res() response: ResponseExp) {
    console.log('google authentication redirect');
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
      await this.authService.createAccessTokenFromRefreshToken(refreshToken);
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
    this.authService.logout(req.user['id']);
    response.clearCookie('api-token');
    response.clearCookie('auth-token');
    response.redirect(303, AUH_URL);
  }
}
