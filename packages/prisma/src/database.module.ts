import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ActivitiesDatabaseModule } from './activities/activities.database.module';

@Module({
  imports: [PrismaModule, ActivitiesDatabaseModule],
  providers: [],
  exports: [PrismaModule, ActivitiesDatabaseModule],
})
export class DatabaseModule {}
