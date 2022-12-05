import {
  Controller,
  UseGuards,
  Post,
  Get,
  Req,
  Res,
  Request,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import passport from 'passport';
import {
  Request as RequestExp,
  response,
  Response as ResponseExp,
} from 'express';
import {
  GoogleOauthGuard,
  JwtAuthGuard,
  LocalAuthGuard,
} from '../../utils/LocalGuards';
import { AuthService } from '../../services/auth/auth.service';
import { Recaptcha } from '@nestlab/google-recaptcha';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: AuthService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: RequestExp, @Res() response: ResponseExp) {
    const token = await this.authService.loginUser(req.user);
    response
      .cookie('authorization', token.access_token, {
        httpOnly: true,
        secure: false,
      })
      .redirect('/');
  }

  @Get('google')
  @UseGuards(GoogleOauthGuard)
  async googleAuth(@Req() req) {}

  @Get('google/callback')
  @UseGuards(GoogleOauthGuard)
  async googleAuthRedirect(@Req() req, @Res() response: ResponseExp) {
    console.log('google authentication redirect');
    const token = await this.authService.googleLoginUser(req);

    response
      .cookie('authorization', token, { httpOnly: true, secure: false })
      .redirect('/');
  }

  @UseGuards(JwtAuthGuard)
  @Get('status')
  async getAuthStatus(@Req() req: RequestExp) {
    return req.user;
  }

  @Get('logout')
  async logout(@Req() req: RequestExp, @Res() response: ResponseExp) {
    response.clearCookie('authorization');
    response.redirect('/');
  }
}
