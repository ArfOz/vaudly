import { Injectable } from '@nestjs/common';
import { CreateActivityDto } from './dtos';
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
    return await this.activitiesDatabaseService.findById(id);
  }

  async create(input: CreateActivityDto) {
    if (!input || !input.name) {
      throw new Error('Invalid activity data: "name" is required');
    }

    const data = input as unknown as Prisma.ActivityCreateInput;

    return await this.activitiesDatabaseService.create(data);
  }

  async update(
    id: string,
    input: {
      name?: string;
      description?: string | null;
      category?: CategoryType[];
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
    return await this.activitiesDatabaseService.update(id, input);
  }

  async remove(id: string) {
    if (!id) {
      throw new Error('Invalid activity ID');
    }
    const activity = await this.activitiesDatabaseService.findById(id);
    if (!activity) {
      throw new Error('Activity not found');
    }
    return await this.activitiesDatabaseService.remove(id);
  }
}
