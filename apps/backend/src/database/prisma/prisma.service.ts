/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
<<<<<<< HEAD
import { PrismaClient } from 'database/generated/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { ConfigService } from '@nestjs/config';
=======
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { PrismaClient } from '@database';
>>>>>>> 083c5b8 (Initial monorepo with Nx, Expo, NestJS, Prisma setup)

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(config: ConfigService) {
    const databaseUrl = config.get<string>('DATABASE_URL');
<<<<<<< HEAD
    if (typeof databaseUrl !== 'string' || !databaseUrl)
      throw new Error('DATABASE_URL environment variable is not set');
=======
    if (typeof databaseUrl !== 'string' || !databaseUrl) {
      throw new Error('DATABASE_URL environment variable is not set');
    }
>>>>>>> 083c5b8 (Initial monorepo with Nx, Expo, NestJS, Prisma setup)

    const pool: Pool = new Pool({ connectionString: databaseUrl });
    const adapter = new PrismaPg(pool);

    super({
      adapter,
      log: ['error', 'warn'],
    });
  }

  async onModuleInit(): Promise<void> {
    await this.$connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}
