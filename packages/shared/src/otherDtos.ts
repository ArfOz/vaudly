import { CategoryType } from "./enum.js"

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
  location: Location
  category: string[]
}

export interface CreateActivityDto {
  name: string
  description?: string
  category?: string
  subtitle?: string
  date?: string
  price?: string
  startTime?: string
  endTime?: string
  locationId?: string
  address?: string
  city?: string
  latitude?: number
  longitude?: number
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

export const GetActivitiesQueryParams = {
  CATEGORIES: "categories",
} as const

// Validation decorators removed from shared. Use plain type if needed:
// export interface GetActivitiesDto { categories?: CategoryType[]; }
