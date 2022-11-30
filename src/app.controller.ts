import { Controller, Get, Res, Req } from '@nestjs/common';
import { Response, Request } from 'express';
import { AppService } from './app.service';
import { loginFormValid } from './utils/fomValidation';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  root(@Req() request: Request, @Res() response: Response) {
    if (request['user']) {
      const user = request['user'];
      return response.render('index', user);
    } else {
      console.log(loginFormValid);
      return response.render('./login', loginFormValid);
    }
  }
}
