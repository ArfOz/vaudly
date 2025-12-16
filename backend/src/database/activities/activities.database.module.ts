import { PrismaModule } from './../prisma/prisma.module';
import { Module } from '@nestjs/common';
import { ActivitiesDatabaseService } from './activities.database.service';

@Module({
  imports: [PrismaModule],
  providers: [ActivitiesDatabaseService],
  exports: [ActivitiesDatabaseService],
})
export class ActivitiesDatabaseModule {}
