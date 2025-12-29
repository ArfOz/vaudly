import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
<<<<<<< HEAD
} from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { ActivityResponse, CreateActivityDto } from './dtos/actvities.dto';
=======
  Query,
} from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { CreateActivityDto, GetActivitiesDto } from './dtos/actvities.dto';
import { CategoryType } from '@shared';
>>>>>>> 083c5b8 (Initial monorepo with Nx, Expo, NestJS, Prisma setup)

@Controller('activities')
export class ActivitiesController {
  constructor(private readonly activities: ActivitiesService) {}

  @Get()
<<<<<<< HEAD
  async list(): Promise<ActivityResponse[]> {
    return await this.activities.listActivities();
=======
  async list(@Query() query: GetActivitiesDto) {
    const categories = query.categories
      ? ((query.categories as unknown as string)
          .split(',')
          .map((c: string) => c.trim()) as CategoryType[])
      : undefined;

    return this.activities.listActivities(categories);
>>>>>>> 083c5b8 (Initial monorepo with Nx, Expo, NestJS, Prisma setup)
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
<<<<<<< HEAD
      category?: string | null;
=======
      category?: string[];
>>>>>>> 083c5b8 (Initial monorepo with Nx, Expo, NestJS, Prisma setup)
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
<<<<<<< HEAD
    },
=======
    }
>>>>>>> 083c5b8 (Initial monorepo with Nx, Expo, NestJS, Prisma setup)
  ) {
    return await this.activities.update(id, body);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.activities.remove(id);
  }
}
