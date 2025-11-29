import {
  IsOptional,
  IsString,
  IsNotEmpty,
  IsObject,
  IsEmail,
  IsNumber,
  IsBoolean,
  IsEnum,
} from 'class-validator';
import { CategoryType } from 'database/generated/client';

export {
  ActivityResponse,
  Location,
  CreateActivityDto as CreateActivityDtoInterface,
  UpdateActivityDto,
} from 'shared';

export class CreateActivityDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  category?: string;

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

export class GetActivitiesDto {
  @IsOptional()
  @IsEnum(CategoryType, { each: true })
  categories?: CategoryType[];
}
