import { apiClient } from './client';

export interface CurrentWeather {
  requestedLatitude: number;
  requestedLongitude: number;
  latitude: number;
  longitude: number;
  timezone: string;
  time: string;
  temperature2m: number;
  relativeHumidity2m: number;
  precipitation: number;
  precipitationProbability: number;
  windSpeed10m: number;
  weatherCode: number;
  isDay: number;
  soilTemperature0cm: number;
  soilMoisture0To1cm: number;
  units: Record<string, string>;
}

export interface GeocodingResult {
  name: string;
  country: string;
  countryCode: string;
  admin1: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

export interface WeatherRecord {
  id: number;
  temperature: number;
  humidity: number;
  rainfall: number;
  recordedAt: string;
  farmId: number;
}

export function getCurrentWeather(params: {
  lat?: number;
  lon?: number;
  locationName?: string;
  countryCode?: string;
}): Promise<CurrentWeather> {
  const query = new URLSearchParams();
  if (params.lat !== undefined) query.set('lat', String(params.lat));
  if (params.lon !== undefined) query.set('lon', String(params.lon));
  if (params.locationName) query.set('locationName', params.locationName);
  if (params.countryCode) query.set('countryCode', params.countryCode);
  return apiClient.get<CurrentWeather>(`/api/weather/current?${query}`);
}

export function geocode(params: {
  name: string;
  count?: number;
  countryCode?: string;
}): Promise<GeocodingResult[]> {
  const query = new URLSearchParams({ name: params.name });
  if (params.count) query.set('count', String(params.count));
  if (params.countryCode) query.set('countryCode', params.countryCode);
  return apiClient.get<GeocodingResult[]>(`/api/weather/geocode?${query}`);
}

export function getFarmWeatherRecords(farmId: number): Promise<WeatherRecord[]> {
  return apiClient.get<WeatherRecord[]>(`/api/farms/${farmId}/weather-records`);
}
