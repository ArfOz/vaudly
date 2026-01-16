import { ActivitiesDatabaseService } from '../database/activities/activities.database.service';
import { Module } from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { ActivitiesController } from './activities.controller';
import { ActivitiesDatabaseModule } from '../database/activities';
import { PrismaService } from '../database/prisma';

@Module({
  imports: [ActivitiesDatabaseModule],
  controllers: [ActivitiesController],
  providers: [ActivitiesService, ActivitiesDatabaseService, PrismaService],
})
export class ActivitiesModule {}
