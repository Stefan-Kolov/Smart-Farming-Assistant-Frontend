import { apiClient, setToken } from './client';

export interface UpdateProfileRequest {
  username: string;
  name: string;
  surname: string;
  email: string;
  password?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  surname: string;
  email: string;
  username: string;
  password: string;
}

export interface UserProfile {
  username: string;
  name: string;
  surname: string;
  email: string;
  role: 'ROLE_USER' | 'ROLE_ADMINISTRATOR';
}

export async function login(data: LoginRequest): Promise<void> {
  const res = await apiClient.post<{ token: string }>('/api/user/login', data);
  setToken(res.token);
}

export async function register(data: RegisterRequest): Promise<UserProfile> {
  const res = await apiClient.post<UserProfile>('/api/user/register', data);
  return res;
}

export async function getMe(): Promise<UserProfile> {
  return apiClient.get<UserProfile>('/api/user/me');
}

export interface UpdateProfileResponse {
  message: string;
  user: UserProfile;
  token: string;
}

export async function updateProfile(data: UpdateProfileRequest): Promise<UpdateProfileResponse> {
  const res = await apiClient.put<UpdateProfileResponse>('/api/user/me', data);
  // The backend issues a new token after profile changes (e.g. username rename)
  if (res.token) setToken(res.token);
  return res;
}
