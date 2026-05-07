import { apiClient } from './client';

export type SoilType = 'CLAY' | 'SANDY' | 'LOAMY' | 'SILTY';

export interface CropDto {
  id: number;
  name: string;
  plantingDate: string;
  soilType: SoilType;
  farmId: number;
}

export interface CropCreateRequest {
  name: string;
  plantingDate: string;
  soilType: SoilType;
}

export interface CropUpdateRequest {
  name: string;
  plantingDate: string;
  soilType: SoilType;
}

export function listCropsByFarm(farmId: number): Promise<CropDto[]> {
  return apiClient.get<CropDto[]>(`/api/farms/${farmId}/crops`);
}

export function getCrop(cropId: number): Promise<CropDto> {
  return apiClient.get<CropDto>(`/api/crops/${cropId}`);
}

export function createCrop(farmId: number, data: CropCreateRequest): Promise<CropDto> {
  return apiClient.post<CropDto>(`/api/farms/${farmId}/crops`, data);
}

export function updateCrop(cropId: number, data: CropUpdateRequest): Promise<CropDto> {
  return apiClient.put<CropDto>(`/api/crops/${cropId}`, data);
}

export function deleteCrop(cropId: number): Promise<void> {
  return apiClient.delete<void>(`/api/crops/${cropId}`);
}
