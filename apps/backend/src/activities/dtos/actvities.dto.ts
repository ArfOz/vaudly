import {
  IsOptional,
  IsString,
  IsNotEmpty,
<<<<<<< HEAD
  IsObject,
  IsEmail,
  IsNumber,
  IsBoolean,
} from 'class-validator';

export {
  ActivityResponse,
  Location,
  CreateActivityDto as CreateActivityDtoInterface,
  UpdateActivityDto,
} from 'shared';
=======
  IsNumber,
  IsEnum,
} from 'class-validator';
import { CategoryType } from '@shared';
>>>>>>> 083c5b8 (Initial monorepo with Nx, Expo, NestJS, Prisma setup)

export class CreateActivityDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsOptional()
  description?: string;

<<<<<<< HEAD
  @IsString()
  @IsOptional()
  category?: string;
=======
  @IsOptional()
  category?: string[];
>>>>>>> 083c5b8 (Initial monorepo with Nx, Expo, NestJS, Prisma setup)

  @IsString()
  @IsOptional()
  subtitle?: string;

  @IsString()
  @IsOptional()
  date?: string;

  @IsString()
  @IsOptional()
  price?: string;

  @IsString()
  @IsOptional()
  startTime?: string;

  @IsString()
  @IsOptional()
  endTime?: string;

  @IsString()
  @IsOptional()
  locationId?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsNumber()
  @IsOptional()
  latitude?: number;

  @IsNumber()
  @IsOptional()
  longitude?: number;
}
<<<<<<< HEAD
=======

export class GetActivitiesDto {
  @IsOptional()
  @IsEnum(CategoryType, { each: true })
  categories?: CategoryType[];
}
>>>>>>> 083c5b8 (Initial monorepo with Nx, Expo, NestJS, Prisma setup)
