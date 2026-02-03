import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma';
import { Prisma, Activity, CategoryType } from '@vaudly/database';

@Injectable()
export class ActivitiesDatabaseService {
  constructor(private readonly prisma: PrismaService) {}

  async list({
    where,
    include,
    orderBy,
  }: {
    where?: Prisma.ActivityWhereInput;
    include?: Prisma.ActivityInclude;
    orderBy?: Prisma.ActivityOrderByWithRelationInput;
  }): Promise<Activity[]> {
    const args: Prisma.ActivityFindManyArgs = {
      include: include ? { location: true } : undefined,
      orderBy: orderBy ? { startTime: 'asc' } : undefined,
      take: 100,
      where: where ? where : {},
    };

    try {
      const result = await this.prisma.activity.findMany(args);
      return result ?? [];
    } catch (error) {
      // fail safe: return empty list on error
      return [];
    }
  }

  async findById(id: string) {
    return await this.prisma.activity.findUnique({
      where: { id },
      include: {
        location: true,
      },
    });
  }

  async create(data: Prisma.ActivityCreateInput) {
    return await this.prisma.activity.create({ data });
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
    type LocationUpdate =
      | { connect: { id: string } }
      | {
          create: {
            name?: string | null;
            address?: string | null;
            city?: string | null;
            latitude?: number | null;
            longitude?: number | null;
          };
        }
      | undefined;
    let locationUpdate: LocationUpdate = undefined;
    if (input.locationId) {
      locationUpdate = { connect: { id: input.locationId } };
    } else if (input.address || input.city) {
      const existing = input.address
        ? await this.prisma.location.findFirst({
            where: { address: input.address },
          })
        : null;
      if (existing) {
        const coordPatch: {
          latitude?: number;
          longitude?: number;
          city?: string | null;
        } = {};
        if (input.latitude != null) coordPatch.latitude = input.latitude;
        if (input.longitude != null) coordPatch.longitude = input.longitude;
        if (input.city != null) coordPatch.city = input.city;
        if (Object.keys(coordPatch).length > 0) {
          await this.prisma.location.update({
            where: { id: existing.id },
            data: coordPatch,
          });
        }
        locationUpdate = { connect: { id: existing.id } };
      } else {
        locationUpdate = {
          create: {
            name: input.address || input.city || 'Location',
            address: input.address,
            city: input.city,
            latitude: input.latitude ?? undefined,
            longitude: input.longitude ?? undefined,
          },
        };
      }
    }

    return await this.prisma.activity.update({
      where: { id },
      data: {
        ...(input.name != null ? { name: input.name } : {}),
        ...(input.description !== undefined
          ? { description: input.description }
          : {}),
        ...(input.subtitle !== undefined ? { subtitle: input.subtitle } : {}),
        ...(input.date !== undefined ? { date: input.date } : {}),
        ...(input.price !== undefined ? { price: input.price } : {}),
        ...(input.category !== undefined ? { category: input.category } : {}),
        ...(input.startTime !== undefined
          ? { startTime: input.startTime ? new Date(input.startTime) : null }
          : {}),
        ...(input.endTime !== undefined
          ? { endTime: input.endTime ? new Date(input.endTime) : null }
          : {}),
        ...(locationUpdate ? { location: locationUpdate } : {}),
      },
      include: {
        location: true,
      },
    });
  }

  async remove(id: string) {
    return await this.prisma.activity.delete({ where: { id } });
  }
}
