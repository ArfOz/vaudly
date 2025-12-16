import { Injectable } from '@nestjs/common';
import { CreateActivityDto } from './dtos';
import { ActivityResponse } from '@vaudly/shared';
import { ActivitiesDatabaseService } from '../database/activities';

@Injectable()
export class ActivitiesService {
  constructor(
    private readonly activitiesDatabaseService: ActivitiesDatabaseService,
  ) {}

  async listActivities(categories?: string[]): Promise<ActivityResponse[]> {
    return await this.activitiesDatabaseService.list(categories);
  }

  // async findById(id: string) {
  //   return await this.activitiesDatabaseService.findById(id);
  // }

  // async create(input: CreateActivityDto) {
  //   return await this.activitiesDatabaseService.create(input);
  // }

  // async update(
  //   id: string,
  //   input: {
  //     name?: string;
  //     description?: string | null;
  //     category?: string[];
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
  //   },
  // ) {
  //   return await this.activitiesDatabaseService.update(id, input);
  // }

  // async remove(id: string) {
  //   return await this.activitiesDatabaseService.remove(id);
  // }
}
