import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

// Load .env from monorepo root (2 levels up from backend folder)

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors();
  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}/api`);
}
void bootstrap();
