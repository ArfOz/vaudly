import { Module } from '@nestjs/common';
import { ScraperController } from './scraper.controller';
import { ScraperService } from './scraper.service';
import { PrismaModule } from '../database/prisma';
import { ActivitiesDatabaseModule } from 'src/database/activities';

@Module({
  imports: [ActivitiesDatabaseModule, PrismaModule],
  controllers: [ScraperController],
  providers: [ScraperService],
})
export class ScraperModule {}
