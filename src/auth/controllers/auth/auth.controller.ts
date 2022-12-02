import {
  Controller,
  UseGuards,
  Post,
  Get,
  Req,
  Res,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import passport from 'passport';
import { Request as RequestExp, Response as ResponseExp } from 'express';
import {
  AuthenticatedGuard,
  GoogleOauthGuard,
  JwtAuthGuard,
  LocalAuthGuard,
} from '../../utils/LocalGuards';
import { AuthService } from '../../services/auth/auth.service';

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
  async googleAuth() {}

  // @UseGuards(AuthenticatedGuard)
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
