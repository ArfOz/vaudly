import { Module } from '@nestjs/common';
import { ActivitiesDatabaseService } from './activities.database.service';

@Module({
  providers: [ActivitiesDatabaseService],
  exports: [ActivitiesDatabaseService],
})
export class ActivitiesDatabaseModule {}
