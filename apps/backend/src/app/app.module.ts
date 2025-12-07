import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { PrismaModule } from '../database/prisma';
import { ActivitiesModule } from '../activities/activities.module';
<<<<<<< HEAD
import { ScraperModule } from '../scraper';
=======
// import { ScraperModule } from '../scraper';
>>>>>>> 083c5b8 (Initial monorepo with Nx, Expo, NestJS, Prisma setup)

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../../.env',
    }),
    PrismaModule,
    ActivitiesModule,
<<<<<<< HEAD
    ScraperModule,
=======
    // ScraperModule,
>>>>>>> 083c5b8 (Initial monorepo with Nx, Expo, NestJS, Prisma setup)
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
