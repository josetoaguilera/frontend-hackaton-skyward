import { API_BASE_URL, API_ENDPOINTS } from './api-config';
import type { 
  LoginData, 
  RegisterData, 
  AuthResponse, 
  User, 
  EmergencyRequest,
  CreateEmergencyRequestData 
} from '@/types';

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor() {
    this.baseURL = API_BASE_URL;
    // Recuperar token del localStorage si existe
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
    }
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Agregar headers adicionales si existen
    if (options.headers) {
      Object.assign(headers, options.headers);
    }

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Métodos de autenticación
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>(API_ENDPOINTS.register, {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (response.token) {
      this.setToken(response.token);
    }

    return response;
  }

  async login(data: LoginData): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>(API_ENDPOINTS.login, {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (response.token) {
      this.setToken(response.token);
    }

    return response;
  }

  async logout(): Promise<void> {
    try {
      await this.request(API_ENDPOINTS.logout, {
        method: 'POST',
      });
    } finally {
      this.clearToken();
    }
  }

  async getProfile(): Promise<User> {
    return this.request<User>(API_ENDPOINTS.profile);
  }

  // Métodos para emergencias
  async getEmergencyRequests(): Promise<EmergencyRequest[]> {
    return this.request<EmergencyRequest[]>(API_ENDPOINTS.emergencyRequests);
  }

  async createEmergencyRequest(data: CreateEmergencyRequestData): Promise<EmergencyRequest> {
    return this.request<EmergencyRequest>(API_ENDPOINTS.createEmergencyRequest, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateEmergencyRequest(id: string, data: Partial<EmergencyRequest>): Promise<EmergencyRequest> {
    return this.request<EmergencyRequest>(`${API_ENDPOINTS.emergencyRequests}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteEmergencyRequest(id: string): Promise<void> {
    return this.request<void>(`${API_ENDPOINTS.emergencyRequests}/${id}`, {
      method: 'DELETE',
    });
  }

  // Gestión de tokens
  setToken(token: string): void {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  clearToken(): void {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  getToken(): string | null {
    return this.token;
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }
}

export const apiClient = new ApiClient();
