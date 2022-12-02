import { Controller, Get, Res, Req, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response, Request } from 'express';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/utils/LocalGuards';
import { loginAction, logoutAction } from './utils/fomActions';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private jwtService: JwtService,
  ) {}

  @Get()
  root(@Req() request: Request, @Res() response: Response) {
    const auth = request.cookies['authorization'];
    if (auth) {
      const user = this.jwtService.verify(auth);
      return response.render('index', { ...user, ...logoutAction });
    } else {
      return response.render('./login', loginAction);
    }
  }
}
