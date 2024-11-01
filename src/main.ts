import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import * as process from 'process';
import * as cookieParser from 'cookie-parser';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe(
    {
      whitelist: true,
      forbidNonWhitelisted: true,
    }
  ));

  app.use(cookieParser())


  await app.listen(process.env.PORT);
}
bootstrap().then(() => {
  Logger.log(`🚀 Application is running on: http://localhost:${process.env.PORT}`)
});
