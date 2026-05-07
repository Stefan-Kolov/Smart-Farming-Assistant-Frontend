import { apiClient } from './client';

export interface RecommendationRequest {
  lat: number;
  lon: number;
  crop: string;
  soilType: string;
  season: string;
}

export interface WeatherData {
  temperature: number;
  humidity: number;
  precipitation: number;
}

export interface RecommendationResponse {
  source: string;
  recommendation: string;
  weather: WeatherData;
  note: string;
}

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export interface RecommendationDto {
  id: number;
  content: string;
  riskLevel: RiskLevel;
  temperature: number;
  humidity: number;
  rainfall: number;
  createdAt: string;
  farmId: number;
  cropId: number;
}

export function getRecommendation(data: RecommendationRequest): Promise<RecommendationResponse> {
  return apiClient.post<RecommendationResponse>('/api/advisor/recommend', data);
}

export function getFarmRecommendations(farmId: number): Promise<RecommendationDto[]> {
  return apiClient.get<RecommendationDto[]>(`/api/farms/${farmId}/recommendations`);
}
