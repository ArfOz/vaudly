import { Module } from '@nestjs/common';
import { ScraperController } from './scraper.controller';
import { ScraperService } from './scraper.service';
import { ActivitiesDatabaseModule } from '../database/activites';
import { PrismaModule } from '../database/prisma';

@Module({
  imports: [ActivitiesDatabaseModule, PrismaModule],
  controllers: [ScraperController],
  providers: [ScraperService],
})
export class ScraperModule {}
