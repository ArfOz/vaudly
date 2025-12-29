import axios, { AxiosInstance } from 'axios';
import type {
  ActivityResponse,
  CreateActivityDto,
  UpdateActivityDto,
} from '@vaudly/shared';

class ApiService {
  private client: AxiosInstance;

  constructor() {
    const baseURL =
      process.env.EXPO_PUBLIC_API_URL || 'http://192.168.178.20:3000/api';
    console.log('API Service initialized with baseURL:', baseURL);
    this.client = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Log requests and responses for debugging
    this.client.interceptors.request.use(
      (config) => {
        const fullUrl = (config.baseURL || '') + (config.url || '');
        console.log('API Request:', config.method?.toUpperCase(), fullUrl);
        return config;
      },
      (error) => {
        console.error('API Request Error:', error);
        return Promise.reject(error);
      },
    );

    this.client.interceptors.response.use(
      (response) => {
        console.log('API Response:', response.status, response.config.url);
        return response;
      },
      (error) => {
        console.error('API Response Error:', error.message);
        if (error.response) {
          console.error('Response data:', error.response.data);
          console.error('Response status:', error.response.status);
        }
        return Promise.reject(error);
      },
    );
  }

  // Activities
  async getActivities(): Promise<ActivityResponse[]> {
    const response = await this.client.get<ActivityResponse[]>('/activities');
    return response.data;
  }

  async getActivity(id: string): Promise<ActivityResponse> {
    const response = await this.client.get<ActivityResponse>(
      `/activities/${id}`,
    );
    return response.data;
  }

  async createActivity(data: CreateActivityDto): Promise<ActivityResponse> {
    const response = await this.client.post<ActivityResponse>(
      '/activities',
      data,
    );
    return response.data;
  }

  async updateActivity(
    id: string,
    data: UpdateActivityDto,
  ): Promise<ActivityResponse> {
    const response = await this.client.put<ActivityResponse>(
      `/activities/${id}`,
      data,
    );
    return response.data;
  }

  async deleteActivity(id: string): Promise<void> {
    await this.client.delete(`/activities/${id}`);
  }
}

export const apiService = new ApiService();
