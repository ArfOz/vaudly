import { Module } from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { ActivitiesController } from './activities.controller';
import {
  ActivitiesDatabaseModule,
  ActivitiesDatabaseService,
} from '../database/activities';
import { PrismaService } from '../database/prisma';

@Module({
  imports: [ActivitiesDatabaseModule],
  controllers: [ActivitiesController],
  providers: [ActivitiesService, ActivitiesDatabaseService, PrismaService],
})
export class ActivitiesModule {}
