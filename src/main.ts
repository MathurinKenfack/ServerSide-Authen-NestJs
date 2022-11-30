import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import * as session from 'express-session';
import * as passport from 'passport';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const port = parseInt(process.env.NEST_PORT) || 3000;
  app.use(
    session({
      name: process.env.SESSION_NAME,
      secret: process.env.SESSION_KEY,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 4 * parseInt(process.env.HOUR),
      },
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());
  app.useGlobalPipes(new ValidationPipe());
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');

  await app.listen(port);
}
bootstrap();
