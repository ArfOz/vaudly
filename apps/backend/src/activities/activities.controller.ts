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
import { ActivityResponse, CreateActivityDto } from './dtos/actvities.dto';

@Controller('activities')
export class ActivitiesController {
  constructor(private readonly activities: ActivitiesService) {}

  @Get()
  async list(): Promise<ActivityResponse[]> {
    return await this.activities.listActivities();
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return await this.activities.findById(id);
  }

  @Post()
  async create(
    @Body()
    body: CreateActivityDto
  ) {
    return await this.activities.create(body);
  }

  // @Put(':id')
  // async update(
  //   @Param('id') id: string,
  //   @Body()
  //   body: {
  //     name?: string;
  //     description?: string | null;
  //     category?: string | null;
  //     subtitle?: string | null;
  //     date?: string | null;
  //     price?: string | null;
  //     startTime?: string | null;
  //     endTime?: string | null;
  //     locationId?: string | null;
  //     address?: string | null;
  //     city?: string | null;
  //     latitude?: number | null;
  //     longitude?: number | null;
  //   }
  // ) {
  //   return await this.activities.update(id, body);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return await this.activities.remove(id);
  // }
}
