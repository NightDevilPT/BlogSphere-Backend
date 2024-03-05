import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import { Server } from 'http';
import * as express from 'express';

const server: express.Application = express();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
  app.enableCors({
    origin: 'http://localhost:3000', // replace with your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // enable credentials (cookies, Authorization headers, etc.)
  });
  await app.init();
  await app.listen(3001);
}
bootstrap();

export const handle: Server = server as any;
