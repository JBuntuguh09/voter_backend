import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import * as bodyParser from 'body-parser'
import { ActivityLogsService } from './activity-logs/activity-logs.service';
import { ActivityLogInterceptor } from './activity-logs/activity-logs.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const cfg = app.get(ConfigService);
  const nodeEnv = cfg.get<string>('NODE_ENV') ?? 'development';

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: false,
      forbidNonWhitelisted: false,
      transform: true,
    })
  );
  app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
  

  // ✅ Global response interceptor
  app.useGlobalInterceptors(new ResponseInterceptor());

app.enableCors({
  origin: "*",
  methods: "GET,POST,PUT,PATCH,DELETE,OPTIONS"
});

// app.enableCors({
//   origin: [
//     "https://hohoe.test.smartcitygh.com",
//     "https://dev.rev-collect.smartcitygh.com",
//     "https://hohoe.smartcitygh.com",
//     "https://api.staging.rev-collect.smartcitygh.com", 
    
//     "*"
//   ],
//   methods: "GET,POST,PUT,PATCH,DELETE,OPTIONS"
// });



const logService = app.get(ActivityLogsService);
app.useGlobalInterceptors(
  new ActivityLogInterceptor(logService),
);

  

  const config = new DocumentBuilder()
    .setTitle('Voter API')
    .setDescription('API to support Voter app')
    .setVersion('1.0')
    .addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      in: 'header',
    },
    'access-token',
  )
    .addTag('exits')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  console.log('NODE_ENV', nodeEnv); 
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
