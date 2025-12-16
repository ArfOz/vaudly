import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ActivitiesDatabaseService {
  constructor(private readonly prisma: PrismaService) {}

  async list(categories?: string[]) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await this.prisma.activity.findMany({
      where: categories
        ? {
            category: {
              hasSome: categories,
            },
          }
        : undefined,
      include: {
        location: true,
      },
      orderBy: { startTime: 'asc' },
      take: 100,
    });
  }

  async findById(id: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await this.prisma.activity.findUnique({
      where: { id },
      include: {
        location: true,
      },
    });
  }

  async create(input: {
    name: string;
    description?: string | null;
    category?: string[];
    subtitle?: string | null;
    date?: string | null;
    price?: string | null;
    startTime?: string | null;
    endTime?: string | null;
    locationId?: string;
    address?: string | null;
    city?: string | null;
    latitude?: number | null;
    longitude?: number | null;
  }) {
    type LocationConnect =
      | { connect: { id: string } }
      | {
          create: {
            name?: string | null;
            address?: string | null;
            city?: string | null;
            latitude?: number | null;
            longitude?: number | null;
          };
        };
    let locationConnect: LocationConnect;

    if (input.locationId) {
      locationConnect = { connect: { id: input.locationId } };
    } else if (input.address || input.city) {
      const existing = input.address
        ? await this.prisma.location.findFirst({
            where: { address: input.address },
          })
        : null;
      if (existing) {
        locationConnect = { connect: { id: existing.id } };
      } else {
        locationConnect = {
          create: {
            name: input.address || input.city || 'Location',
            address: input.address,
            city: input.city,
            latitude: input.latitude ?? undefined,
            longitude: input.longitude ?? undefined,
          },
        };
      }
    } else {
      locationConnect = { create: { name: 'Location' } };
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await this.prisma.activity.create({
      data: {
        name: input.name,
        description: input.description ?? undefined,
        category: input.category ?? [],
        subtitle: input.subtitle ?? undefined,
        date: input.date ?? undefined,
        price: input.price ?? undefined,
        startTime: input.startTime ? new Date(input.startTime) : undefined,
        endTime: input.endTime ? new Date(input.endTime) : undefined,
        location: locationConnect,
      },
      include: {
        location: true,
      },
    });
  }

  async update(
    id: string,
    input: {
      name?: string;
      description?: string | null;
      category?: string[];
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

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
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

  //   async remove(id: string) {
  //     return await this.prisma.activity.delete({ where: { id } });
  //   }
}
