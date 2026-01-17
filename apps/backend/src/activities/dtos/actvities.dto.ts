import { IsOptional, IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { CategoryType } from '@vaudly/database';


export class CreateLocationDto {
  @IsString()
  @IsOptional()
  name?: string | null;

  @IsString()
  @IsOptional()
  address?: string | null;

  @IsString()
  @IsOptional()
  city?: string | null;

  @IsEnum(['VD'])
  @IsOptional()
  canton?: 'VD'; // Gerekirse enum genişletilebilir

  @IsOptional()
  latitude?: number | null;

  @IsOptional()
  longitude?: number | null;

  @IsOptional()
  createdAt?: Date | string;

  @IsOptional()
  updatedAt?: Date | string;
}
export class CreateLocationNestedDto {
  @IsOptional()
  @Type(() => CreateLocationDto)
  create?: CreateLocationDto;
}

export class CreateActivityDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsOptional()
  description?: string | null | undefined;

  @IsString()
  @IsOptional()
  subtitle?: string | null | undefined;

  @IsString()
  @IsOptional()
  date?: string | null | undefined;

  @IsString()
  @IsOptional()
  price?: string | null | undefined;

  @IsOptional()
  category?: string[] | undefined;

  @IsOptional()
  startTime?: Date | string | null;

  @IsOptional()
  endTime?: Date | string | null;

  @IsOptional()
  createdAt?: Date | string;

  @IsOptional()
  updatedAt?: Date | string;

  @IsNotEmpty()
  @Type(() => CreateLocationNestedDto)
  location!: CreateLocationNestedDto;
}

export class GetActivitiesDto {
  @IsOptional()
  @IsEnum(CategoryType, { each: true })
  categories?: CategoryType[];
}
