import { Injectable } from '@nestjs/common';
import { ActivityResponse, CreateActivityDto } from './dtos';
import { ActivitiesDatabaseService } from '../database/activites';

@Injectable()
export class ActivitiesService {
  constructor(
    private readonly activitiesDatabaseService: ActivitiesDatabaseService,
  ) {}

  async listActivities(): Promise<ActivityResponse[]> {
    return await this.activitiesDatabaseService.list();
  }

  async findById(id: string) {
    return await this.activitiesDatabaseService.findById(id);
  }

  async create(input: CreateActivityDto) {
    return await this.activitiesDatabaseService.create(input);
  }

  async update(
    id: string,
    input: {
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
    },
  ) {
    return await this.activitiesDatabaseService.update(id, input);
  }

  async remove(id: string) {
    return await this.activitiesDatabaseService.remove(id);
  }
}
