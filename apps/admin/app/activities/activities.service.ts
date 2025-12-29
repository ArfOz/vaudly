import {
  ActivityResponse,
  CreateActivityDto,
  UpdateActivityDto,
} from "./../../../../packages/shared/src/otherDtos"
// Activities API service for admin panel
import axios from "axios"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

export async function fetchActivities(): Promise<ActivityResponse[]> {
  const res = await axios.get(`${API_BASE}/activities`)
  return res.data
}

export async function createActivity(
  data: CreateActivityDto
): Promise<ActivityResponse> {
  const res = await axios.post(`${API_BASE}/activities`, data)
  return res.data
}

export async function updateActivity(
  id: string,
  data: UpdateActivityDto
): Promise<ActivityResponse> {
  const res = await axios.put(`${API_BASE}/activities/${id}`, data)
  return res.data
}

export async function deleteActivity(id: string) {
  const res = await axios.delete(`${API_BASE}/activities/${id}`)
  return res.data
}
