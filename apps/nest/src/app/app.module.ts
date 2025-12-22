import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ActivitiesModule } from '../activities/activities.module';
import { PrismaModule } from '../database/prisma';
// import { PrismaModule } from 'src/database/prisma';
// import { ScraperModule } from '../scraper';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../../.env',
    }),
    PrismaModule,
    ActivitiesModule,
    // ScraperModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
