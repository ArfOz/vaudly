import { Module } from '@nestjs/common';
import { ActivitiesDatabaseService } from './activities.database.service';
import { PrismaModule } from '../prisma';

@Module({
  imports: [PrismaModule],
  providers: [ActivitiesDatabaseService],
  exports: [ActivitiesDatabaseService],
})
export class ActivitiesDatabaseModule {}
