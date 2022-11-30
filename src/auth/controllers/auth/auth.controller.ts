import {
  Controller,
  UseGuards,
  Post,
  Session,
  Get,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthenticatedGuard, LocalAuthGuard } from '../../utils/LocalGuards';

@Controller('auth')
export class AuthController {
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Res() response: Response) {
    return response.redirect('/');
  }

  @UseGuards(AuthenticatedGuard)
  @Get('status')
  async getAuthStatus(@Req() req: Request) {
    return req['user'];
  }
}
