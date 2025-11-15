import { Injectable } from '@nestjs/common';
import { ActivitiesDatabaseService } from '@libs/database';
import { CreateActivityDto } from './dtos';

@Injectable()
export class ActivitiesService {
  constructor(
    private readonly activitiesDatabaseService: ActivitiesDatabaseService
  ) {}

  async listActivities() {
    return this.activitiesDatabaseService.list();
  }
  async findById(id: string) {
    return this.activitiesDatabaseService.findById(id);
  }
  async create(input: CreateActivityDto) {
    return this.activitiesDatabaseService.create(input);
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
    }
  ) {
    return this.activitiesDatabaseService.update(id, input);
  }

  // async delete(id: string) {
  //   return this.activitiesDatabaseService.delete(id);
  // }
}
