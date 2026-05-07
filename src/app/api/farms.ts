import { apiClient } from './client';

export interface FarmDto {
  id: number;
  name: string;
  location: string;
}

export interface FarmCreateRequest {
  name: string;
  location: string;
}

export interface FarmUpdateRequest {
  name: string;
  location: string;
}

export function listFarms(): Promise<FarmDto[]> {
  return apiClient.get<FarmDto[]>('/api/farms');
}

export function getFarm(farmId: number): Promise<FarmDto> {
  return apiClient.get<FarmDto>(`/api/farms/${farmId}`);
}

export function createFarm(data: FarmCreateRequest): Promise<FarmDto> {
  return apiClient.post<FarmDto>('/api/farms', data);
}

export function updateFarm(farmId: number, data: FarmUpdateRequest): Promise<FarmDto> {
  return apiClient.put<FarmDto>(`/api/farms/${farmId}`, data);
}

export function deleteFarm(farmId: number): Promise<void> {
  return apiClient.delete<void>(`/api/farms/${farmId}`);
}
