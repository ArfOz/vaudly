import { Controller, Get, Param } from '@nestjs/common';
import { ActivitiesService } from './activities.service';

@Controller('activities')
export class ActivitiesController {
  constructor(private readonly activities: ActivitiesService) {}

  @Get()
  list() {
    return this.activities.list();
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.activities.findById(id);
  }
}
