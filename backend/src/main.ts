import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

// Load .env from monorepo root (2 levels up from backend folder)

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors();
  const port = process.env.PORT ?? 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`Application is running on: http://0.0.0.0:${port}/api`);
}
void bootstrap();
