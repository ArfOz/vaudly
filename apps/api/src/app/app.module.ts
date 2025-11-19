import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from '@database/src/prisma/prisma.module';
import { ActivitiesModule } from '../activities/activities.module';

@Module({
  imports: [PrismaModule, ActivitiesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
