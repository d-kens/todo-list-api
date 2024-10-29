import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import * as process from 'process';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('todo')

  app.useGlobalPipes(new ValidationPipe(
    {
      whitelist: true,
      forbidNonWhitelisted: true,
    }
  ));
  await app.listen(process.env.PORT);
}
bootstrap().then(() => {
  Logger.log(`🚀 Application is running on: http://localhost:${process.env.PORT}`)
});
