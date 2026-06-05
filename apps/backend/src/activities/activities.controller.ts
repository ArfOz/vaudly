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
import { CreateActivityDto, GetActivitiesDto, UpdateActivityDto } from './dtos';
import { CategoryType } from '@vaudly/database';

@Controller('activities')
export class ActivitiesController {
  constructor(private readonly activities: ActivitiesService) {}

  @Get()
  async list(@Query() query: GetActivitiesDto) {
    console.log('ActivitiesController.list called with query:');
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
  async update(@Param('id') id: string, @Body() body: UpdateActivityDto) {
    return await this.activities.update(id, body);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.activities.remove(id);
  }
}
