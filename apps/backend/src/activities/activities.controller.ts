import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
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

  @Post()
  create(
    @Body()
    body: {
      name: string;
      description?: string | null;
      category?: string | null;
      subtitle?: string | null;
      date?: string | null;
      price?: string | null;
      startTime?: string | null; // ISO string
      endTime?: string | null; // ISO string
      locationId?: string;
      address?: string | null;
      city?: string | null;
      latitude?: number | null;
      longitude?: number | null;
    }
  ) {
    return this.activities.create(body);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body()
    body: {
      name?: string;
      description?: string | null;
      category?: string | null;
      subtitle?: string | null;
      date?: string | null;
      price?: string | null;
      startTime?: string | null;
      endTime?: string | null;
      locationId?: string | null;
      address?: string | null;
      city?: string | null;
      latitude?: number | null;
      longitude?: number | null;
    }
  ) {
    return this.activities.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.activities.remove(id);
  }
}
