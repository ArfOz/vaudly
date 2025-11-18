"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivitiesDatabaseService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const prisma_1 = require("../prisma");
let ActivitiesDatabaseService = class ActivitiesDatabaseService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async list() {
        return this.prisma.activity.findMany({
            include: { location: true },
            orderBy: { startTime: 'asc' },
            take: 100,
        });
    }
    async findById(id) {
        return this.prisma.activity.findUnique({
            where: { id },
            include: { location: true },
        });
    }
    async create(input) {
        let locationConnect;
        if (input.locationId) {
            locationConnect = { connect: { id: input.locationId } };
        }
        else if (input.address || input.city) {
            const existing = input.address
                ? await this.prisma.location.findFirst({
                    where: { address: input.address },
                })
                : null;
            if (existing) {
                locationConnect = { connect: { id: existing.id } };
            }
            else {
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
        }
        else {
            locationConnect = { create: { name: 'Location' } };
        }
        return this.prisma.activity.create({
            data: {
                name: input.name,
                description: input.description ?? undefined,
                category: input.category ?? undefined,
                subtitle: input.subtitle ?? undefined,
                date: input.date ?? undefined,
                price: input.price ?? undefined,
                startTime: input.startTime ? new Date(input.startTime) : undefined,
                endTime: input.endTime ? new Date(input.endTime) : undefined,
                location: locationConnect,
            },
            include: { location: true },
        });
    }
    async update(id, input) {
        let locationUpdate = undefined;
        if (input.locationId) {
            locationUpdate = { connect: { id: input.locationId } };
        }
        else if (input.address || input.city) {
            const existing = input.address
                ? await this.prisma.location.findFirst({
                    where: { address: input.address },
                })
                : null;
            if (existing) {
                const coordPatch = {};
                if (input.latitude != null)
                    coordPatch.latitude = input.latitude;
                if (input.longitude != null)
                    coordPatch.longitude = input.longitude;
                if (input.city != null)
                    coordPatch.city = input.city;
                if (Object.keys(coordPatch).length > 0) {
                    await this.prisma.location.update({
                        where: { id: existing.id },
                        data: coordPatch,
                    });
                }
                locationUpdate = { connect: { id: existing.id } };
            }
            else {
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
        return this.prisma.activity.update({
            where: { id },
            data: {
                ...(input.name != null ? { name: input.name } : {}),
                ...(input.description !== undefined
                    ? { description: input.description }
                    : {}),
                ...(input.category !== undefined ? { category: input.category } : {}),
                ...(input.subtitle !== undefined ? { subtitle: input.subtitle } : {}),
                ...(input.date !== undefined ? { date: input.date } : {}),
                ...(input.price !== undefined ? { price: input.price } : {}),
                ...(input.startTime !== undefined
                    ? { startTime: input.startTime ? new Date(input.startTime) : null }
                    : {}),
                ...(input.endTime !== undefined
                    ? { endTime: input.endTime ? new Date(input.endTime) : null }
                    : {}),
                ...(locationUpdate ? { location: locationUpdate } : {}),
            },
            include: { location: true },
        });
    }
    async remove(id) {
        return this.prisma.activity.delete({ where: { id } });
    }
};
exports.ActivitiesDatabaseService = ActivitiesDatabaseService;
exports.ActivitiesDatabaseService = ActivitiesDatabaseService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [prisma_1.PrismaService])
], ActivitiesDatabaseService);
//# sourceMappingURL=activities.database.service.js.map