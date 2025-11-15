import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ActivitiesDatabaseModule } from './activites';

@Module({
  imports: [PrismaModule, ActivitiesDatabaseModule],
  providers: [],
  exports: [PrismaModule, ActivitiesDatabaseModule],
})
export class DatabaseModule {}
