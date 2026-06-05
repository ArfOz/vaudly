import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateActivityDto, UpdateActivityDto } from './dtos';
import { ActivitiesDatabaseService } from '../database/activities';
import { ActivityResponse } from '@vaudly/shared';
import { CategoryType, Prisma } from '@vaudly/database';

@Injectable()
export class ActivitiesService {
  constructor(
    private readonly activitiesDatabaseService: ActivitiesDatabaseService,
  ) {}

  async listActivities(
    categories?: CategoryType[],
  ): Promise<ActivityResponse[] | null> {
    const where: Prisma.ActivityWhereInput = categories
      ? {
          category: { hasSome: categories },
        }
      : {};
    const result = await this.activitiesDatabaseService.list({
      where,
      include: { location: true },
      orderBy: { startTime: 'asc' },
    });
    return result as unknown as ActivityResponse[] | null;
  }

  async findById(id: string) {
    const activity = await this.activitiesDatabaseService.findById(id);
    if (!activity) {
      throw new NotFoundException(`Activity with id "${id}" not found`);
    }
    return activity;
  }

  async create(input: CreateActivityDto) {
    const data: Prisma.ActivityCreateInput = {
      name: input.name,
      description: input.description,
      subtitle: input.subtitle,
      date: input.date,
      price: input.price,
      category: input.category ?? [],
      startTime: input.startTime ? new Date(input.startTime) : undefined,
      endTime: input.endTime ? new Date(input.endTime) : undefined,
      location:
        input.location as Prisma.LocationCreateNestedOneWithoutActivitiesInput,
    };

    return await this.activitiesDatabaseService.create(data);
  }

  async update(id: string, input: UpdateActivityDto) {
    const existing = await this.activitiesDatabaseService.findById(id);
    if (!existing) {
      throw new NotFoundException(`Activity with id "${id}" not found`);
    }
    return await this.activitiesDatabaseService.update(id, input);
  }

  async remove(id: string) {
    if (!id) {
      throw new BadRequestException('Activity ID is required');
    }
    const activity = await this.activitiesDatabaseService.findById(id);
    if (!activity) {
      throw new NotFoundException(`Activity with id "${id}" not found`);
    }
    return await this.activitiesDatabaseService.remove(id);
  }
}
