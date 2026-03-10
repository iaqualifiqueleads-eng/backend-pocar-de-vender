import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { urlencoded, json } from 'express';
import * as compression from 'compression';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.useGlobalFilters(new HttpExceptionFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      errorHttpStatusCode: 422,
      transform: true,
    }),
  );

  app.use(compression())

  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector), {
      strategy: 'exposeAll',
      excludePrefixes: ['senha'],
    }),
  );

  app.enableCors({
    allowedHeaders: ['Content-Type', 'Origin', 'Authorization', "x-system-id"],
    origin: [
      '*',
      'http://localhost:5173',
      'http://localhost:5173/',
      'https://pocar-de-vender-v2.vercel.app/',
      'https://pocar-de-vender-v2.vercel.app',
      "https://pocar-de-vender-v2.vercel.app/login",
      "https://pocar-de-vender-v2-git-main-gabrielboldiveigas-projects.vercel.app/login",
      'https://pocar-de-vender-v2-gabrielboldiveigas-projects.vercel.app/login',
      'https://pocar-de-vender-v2-git-main-gabrielboldiveigas-projects.vercel.app/login'
    ],
    credentials: false,
  });

  const config = new DocumentBuilder()
    .setTitle('API Pocar de Vender')
    .setDescription('Backend desenvolvido em NestJS e MySQL')
    .setVersion(`${process.env.API_VERSION}`)
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'Header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true, // mantém token após recarregar
    }
  });

  // SwaggerModule.setup('swagger', app, document, {
  //   jsonDocumentUrl: 'swagger/json',
  // });

  app.useGlobalFilters(new HttpExceptionFilter());

  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  // Start app
  await app.listen(process.env.PORT || 3000);

  const logger = new Logger();
  logger.verbose(`Base Url: http://localhost:${process.env.PORT} 🌐`);
  logger.verbose(`Swagger: http://localhost:${process.env.PORT}/api/ 📜`);
  // logger.verbose(`Swagger JSON file: http://localhost:${process.env.PORT}/swagger/json/ 📜`);
}
bootstrap();
