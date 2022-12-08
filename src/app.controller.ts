import { Controller, Get, Res, Req, UseGuards, Query } from '@nestjs/common';
import { Response, Request } from 'express';
import { AccessTokenGuard } from './auth/utils/LocalGuards';
import { loginAction, logoutAction } from './utils/fomActions';

@Controller()
export class AppController {
  constructor() {}

  @Get()
  root(@Req() request: Request, @Res() response: Response) {
    return response.render('./login', loginAction);
  }

  @UseGuards(AccessTokenGuard)
  @Get('welcome')
  welcomePage(
    @Query('auth') auth: string,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    const user = request.user;

    return response
      .append('authorization', auth)
      .render('index', { ...user, ...logoutAction });
  }
}
