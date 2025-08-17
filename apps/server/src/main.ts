import { LoggerFactory } from './logger.factory';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ConfigType } from '@nestjs/config';
import { ClsMiddleware } from 'nestjs-cls';
import { AccessMiddleware, RequestContext, RequestMiddleware } from '@tgi/server-core';
import compression from 'compression';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import apiConfig from './app/config/api.config';
import appConfig from './app/config/app.config';
import swaggerConfig from './app/config/swagger.config';

const _context = 'NestApplication->bootstrap';
const $_logger = LoggerFactory(
  process.env['NODE_ENV'] !== 'development',
  process.env['LOG_LEVEL'] ?? 'silly',
  {
    version: process.env['APP_VERSION'],
    environment: process.env['NODE_ENV'],
  },
);

async function bootstrap() {
  const _app = await NestFactory.create(AppModule, {
    logger: $_logger,
  });
  const _appConfig = _app.get<ConfigType<typeof appConfig>>(appConfig.KEY);
  const _apiConfig = _app.get<ConfigType<typeof apiConfig>>(apiConfig.KEY);
  const _swaggerConfig = _app.get<ConfigType<typeof swaggerConfig>>(swaggerConfig.KEY);

  _app.use(
    new ClsMiddleware({
      generateId: true,
      idGenerator: RequestContext.generateId,
    }).use,
  );
  _app.use(RequestMiddleware.use());

  if (_appConfig.logAccess) {
    _app.use(AccessMiddleware.use($_logger));
  }
  _app.enableCors();
  // _app.use(helmet()); // APP USED ON LOCALHOST ONLY SO TO NOT DEAL WITH HTTPS THIS OPTION IS DISABLED

  _app.setGlobalPrefix(_apiConfig.prefix);

  _app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: _apiConfig.defaultVersion,
  });

  _app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  _app.use(compression());

  if (_swaggerConfig.enabled) {
    const _options = new DocumentBuilder()
      .setTitle(`${_appConfig.name} API`)
      .setDescription(_appConfig.description)
      .setVersion(_appConfig.version)
      .addBearerAuth()
      .build();

    const _document = SwaggerModule.createDocument(_app, _options);
    SwaggerModule.setup(_swaggerConfig.prefix, _app, _document, {
      explorer: true,
    });
  }

  await _app.listen(_appConfig.port);

  $_logger.log(`Application is running on: ${await _app.getUrl()}`, _context);
}

bootstrap().catch((err) => {
  if (err instanceof Error) {
    $_logger.error(err.message, err.stack, _context);
  } else {
    $_logger.error(err, null, _context);
  }
});
