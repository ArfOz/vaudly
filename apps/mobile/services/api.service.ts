import axios, { AxiosInstance } from "axios"
import type {
  ActivityResponse,
  CreateActivityDto,
  UpdateActivityDto,
} from "@vaudly/shared"

class ApiService {
  private client: AxiosInstance

  constructor() {
    // .env dosyasındaki EXPO_PUBLIC_API_URL okunur
    const baseURL =
      process.env.EXPO_PUBLIC_API_URL || "http://192.168.178.20:3000/api"
    console.log("API Service initialized with baseURL:", baseURL)

    // Axios örneği oluşturulur
    this.client = axios.create({
      baseURL: "http://192.168.178.20:3000/api",
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    })

    // Tüm istek ve cevaplar loglanır (debug için)
    this.client.interceptors.request.use(
      (config) => {
        // Tam istek adresini oluştur
        const fullUrl = (config.baseURL || "") + (config.url || "")
        console.log("API Request:", config.method?.toUpperCase(), fullUrl)
        return config
      },
      (error) => {
        console.error("API Request Error:", error)
        return Promise.reject(error)
      }
    )
    this.client.interceptors.response.use(
      (response) => {
        console.log("API Response:", response.status, response.config.url)
        return response
      },
      (error) => {
        console.error("API Response Error:", error.message)
        if (error.response) {
          console.error("Response data:", error.response.data)
          console.error("Response status:", error.response.status)
        }
        return Promise.reject(error)
      }
    )
  }

  // --- Activities endpointleri ---

  // Tüm aktiviteleri getirir: GET /activities
  async getActivities(): Promise<ActivityResponse[]> {
    const response = await this.client.get<ActivityResponse[]>("/activities")
    return response.data
  }

  // Tek bir aktiviteyi getirir: GET /activities/:id
  async getActivity(id: string): Promise<ActivityResponse> {
    const response = await this.client.get<ActivityResponse>(
      `/activities/${id}`
    )
    return response.data
  }

  // Aktivite oluşturur: POST /activities
  async createActivity(data: CreateActivityDto): Promise<ActivityResponse> {
    const response = await this.client.post<ActivityResponse>(
      "/activities",
      data
    )
    return response.data
  }

  // Aktivite günceller: PUT /activities/:id
  async updateActivity(
    id: string,
    data: UpdateActivityDto
  ): Promise<ActivityResponse> {
    const response = await this.client.put<ActivityResponse>(
      `/activities/${id}`,
      data
    )
    return response.data
  }

  // Aktivite siler: DELETE /activities/:id
  async deleteActivity(id: string): Promise<void> {
    await this.client.delete(`/activities/${id}`)
  }
}

export const apiService = new ApiService()
