import { Category, CategoryType } from './../../database/generated/client/index.d';
export interface Location {
  id: string
  name: string | null
  address: string | null
  city: string | null
  canton: string
  latitude: number | null
  longitude: number | null
  createdAt: Date
  updatedAt: Date
}

export interface ActivityResponse {
  id: string
  name: string
  description: string | null
  subtitle: string | null
  date: string | null
  price: string | null
  startTime: Date | null
  endTime: Date | null
  createdAt: Date
  updatedAt: Date
  locationId: string
  location: Location | null
  category: CategoryType[]
}

export interface CreateLocationDto {
  name?: string | null;
  address?: string | null;
  city?: string | null;
  canton?: 'VD';
  latitude?: number | null;
  longitude?: number | null;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface CreateLocationNestedDto {
  create?: CreateLocationDto;
}


export interface CreateActivityDto {
  name: string;
  description?: string | null;
  subtitle?: string | null;
  date?: string | null;
  price?: string | null;
  category?: CategoryType[];
  startTime?: Date | string | null;
  endTime?: Date | string | null;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  location: CreateLocationNestedDto;
}




export interface UpdateActivityDto {
  name?: string
  description?: string | null
  category?: string | null
  subtitle?: string | null
  date?: string | null
  price?: string | null
  startTime?: string | null
  endTime?: string | null
  locationId?: string | null
  address?: string | null
  city?: string | null
  latitude?: number | null
  longitude?: number | null
}

// export enum CategoryType {
//   FARM = "FARM",
//   GARDEN = "GARDEN",
//   RESTAURANT = "RESTAURANT",
//   CAFE = "CAFE",
//   BAR = "BAR",
//   MARKET = "MARKET",
//   SPORTS = "SPORTS",
//   CULTURE = "CULTURE",
//   NATURE = "NATURE",
//   ENTERTAINMENT = "ENTERTAINMENT",
//   EDUCATION = "EDUCATION",
//   WELLNESS = "WELLNESS",
//   FAMILY = "FAMILY",
//   ADVENTURE = "ADVENTURE",
//   MUSIC = "MUSIC",
//   ART = "ART",
//   FESTIVAL = "FESTIVAL",
//   SHOPPING = "SHOPPING",
//   NIGHTLIFE = "NIGHTLIFE",
//   OTHER = "OTHER",
// }
