import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  Query,
} from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { CreateActivityDto, GetActivitiesDto } from './dtos/actvities.dto';
import { CategoryType } from '@vaudly/shared';

@Controller('activities')
export class ActivitiesController {
  constructor(private readonly activities: ActivitiesService) {}

  @Get()
  async list(@Query() query: GetActivitiesDto) {
    console.log('List activities with query:', query);
    const categories = query.categories
      ? ((query.categories as unknown as string)
          .split(',')
          .map((c: string) => c.trim()) as CategoryType[])
      : undefined;

    return this.activities.listActivities(categories);
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return await this.activities.findById(id);
  }

  @Post()
  async create(@Body() body: CreateActivityDto) {
    return await this.activities.create(body);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body()
    body: {
      name?: string;
      description?: string | null;
      category?: string[];
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
    },
  ) {
    return await this.activities.update(id, body);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.activities.remove(id);
  }
}
