import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from '../prisma/prisma.module';
import { ActivitiesModule } from '../activities/activities.module';
import { ScraperModule } from '../scraper/scraper.module';

@Module({
  imports: [PrismaModule, ActivitiesModule, ScraperModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
