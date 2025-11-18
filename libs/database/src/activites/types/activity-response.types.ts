/**
 * Shared TypeScript types for Activity API responses
 * Can be used in React Native mobile app
 */

export interface LocationResponse {
  id: string;
  name: string | null;
  address: string | null;
  city: string | null;
  canton: string;
  latitude: number | null;
  longitude: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface ActivityResponse {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  subtitle: string | null;
  date: string | null;
  price: string | null;
  startTime: string | null;
  endTime: string | null;
  locationId: string;
  location: LocationResponse;
  createdAt: string;
  updatedAt: string;
}

export interface CreateActivityInput {
  name: string;
  description?: string | null;
  category?: string | null;
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
}

export interface UpdateActivityInput {
  name?: string;
  description?: string | null;
  category?: string | null;
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
}

export type ActivityListResponse = ActivityResponse[];
