import { Injectable } from '@nestjs/common';
<<<<<<< HEAD
import { ActivityResponse, CreateActivityDto } from './dtos';
import { ActivitiesDatabaseService } from '../database/activites';
=======
import { CreateActivityDto } from './dtos';
import { ActivitiesDatabaseService } from '../database/activites';
import { ActivityResponse } from '@shared';
>>>>>>> 083c5b8 (Initial monorepo with Nx, Expo, NestJS, Prisma setup)

@Injectable()
export class ActivitiesService {
  constructor(
<<<<<<< HEAD
    private readonly activitiesDatabaseService: ActivitiesDatabaseService,
  ) {}

  async listActivities(): Promise<ActivityResponse[]> {
    return await this.activitiesDatabaseService.list();
=======
    private readonly activitiesDatabaseService: ActivitiesDatabaseService
  ) {}

  async listActivities(categories?: string[]): Promise<ActivityResponse[]> {
    return await this.activitiesDatabaseService.list(categories);
>>>>>>> 083c5b8 (Initial monorepo with Nx, Expo, NestJS, Prisma setup)
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
    return await this.activitiesDatabaseService.update(id, input);
  }

  async remove(id: string) {
    return await this.activitiesDatabaseService.remove(id);
  }
}
