import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ActivitiesService {
  constructor(private readonly prisma: PrismaService) {}

  list() {
    return this.prisma.activity.findMany({
      include: { location: true },
      orderBy: { startTime: 'asc' },
      take: 100,
    });
  }

  findById(id: string) {
    return this.prisma.activity.findUnique({
      where: { id },
      include: { location: true },
    });
  }
}
