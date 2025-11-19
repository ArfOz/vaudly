import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ActivityResponse } from './types/activity-response.types';

@Injectable()
export class ActivitiesDatabaseService {
  constructor(private readonly prisma: PrismaService) {}

  async find(): Promise<ActivityResponse[]> {
    return this.prisma.activity.findMany({
      include: { category: true },
      orderBy: { createdAt: 'asc' },
      take: 100,
    });
  }

  async findById(id: string): Promise<ActivityResponse | null> {
    return this.prisma.activity.findUnique({
      where: { id },
      include: { category: true },
    });
  }

  async create(data: any): Promise<ActivityResponse> {
    return this.prisma.activity.create({
      data,
      include: { category: true },
    });
  }

  async update(id: string, data: any): Promise<ActivityResponse> {
    return this.prisma.activity.update({
      where: { id },
      data,
      include: { category: true },
    });
  }

  async delete(id: string): Promise<ActivityResponse> {
    return this.prisma.activity.delete({
      where: { id },
      include: { category: true },
    });
  }

  async findByCategory(categoryId: string): Promise<ActivityResponse[]> {
    return this.prisma.activity.findMany({
      where: { categoryId },
      include: { category: true },
      orderBy: { createdAt: 'asc' },
    });
  }

  async search(query: string): Promise<ActivityResponse[]> {
    return this.prisma.activity.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ],
      },
      include: { category: true },
      orderBy: { createdAt: 'asc' },
    });
  }
}
