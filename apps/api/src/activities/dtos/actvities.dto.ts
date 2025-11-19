import {
  IsOptional,
  IsString,
  IsNotEmpty,
  IsObject,
  IsEmail,
  IsNumber,
  IsBoolean,
} from 'class-validator';

export class CreateActivityDto {
  @IsString()
  @IsNotEmpty()
  name: string;

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

export interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  canton: string;
  latitude: number;
  longitude: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ActivityResponse {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  subtitle: string | null;
  date: string | null;
  price: string | null;
  startTime: Date | null;
  endTime: Date | null;
  createdAt: Date;
  updatedAt: Date;
  locationId: string;
  location: Location;
}
