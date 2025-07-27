import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { 
  User, 
  Member, 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse,
  CreateMemberRequest,
  UpdateMemberRequest,
  CreateUserRequest,
  UpdateUserRequest,
  MemberFilters,
  UserFilters
} from '../types';

// Configuración de la API
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Interceptor para agregar token de autenticación
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Interceptor para manejar errores de autenticación
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Token expirado, intentar refresh
          const refreshToken = localStorage.getItem('refreshToken');
          if (refreshToken) {
            try {
              const response = await this.refreshToken(refreshToken);
              const { accessToken } = response.data;
              localStorage.setItem('accessToken', accessToken);
              
              // Reintentar la petición original
              error.config.headers.Authorization = `Bearer ${accessToken}`;
              return this.api.request(error.config);
            } catch (refreshError) {
              // Refresh falló, redirigir a login
              localStorage.removeItem('accessToken');
              localStorage.removeItem('refreshToken');
              localStorage.removeItem('user');
              window.location.href = '/login';
            }
          }
        }
        return Promise.reject(error);
      }
    );
  }

  // Métodos de autenticación
  async login(credentials: LoginRequest): Promise<AxiosResponse<AuthResponse>> {
    return this.api.post('/auth/login', credentials);
  }

  async register(userData: RegisterRequest): Promise<AxiosResponse<AuthResponse>> {
    return this.api.post('/auth/register', userData);
  }

  async refreshToken(refreshToken: string): Promise<AxiosResponse<AuthResponse>> {
    return this.api.post('/auth/refresh', refreshToken);
  }

  async validateToken(): Promise<AxiosResponse<{ valid: boolean }>> {
    const token = localStorage.getItem('accessToken');
    return this.api.post('/auth/validate', token);
  }

  // Métodos de usuarios
  async getUsers(filters?: UserFilters): Promise<AxiosResponse<User[]>> {
    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);
    if (filters?.role) params.append('role', filters.role);
    if (filters?.isActive !== undefined) params.append('isActive', filters.isActive.toString());
    
    return this.api.get(`/users?${params.toString()}`);
  }

  async getUserById(id: number): Promise<AxiosResponse<User>> {
    return this.api.get(`/users/${id}`);
  }

  async createUser(userData: CreateUserRequest): Promise<AxiosResponse<User>> {
    return this.api.post('/users', userData);
  }

  async updateUser(id: number, userData: UpdateUserRequest): Promise<AxiosResponse<User>> {
    return this.api.put(`/users/${id}`, userData);
  }

  async deleteUser(id: number): Promise<AxiosResponse<void>> {
    return this.api.delete(`/users/${id}`);
  }

  async getActiveUsers(): Promise<AxiosResponse<User[]>> {
    return this.api.get('/users/active');
  }

  // Métodos de miembros
  async getMembers(filters?: MemberFilters): Promise<AxiosResponse<Member[]>> {
    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);
    if (filters?.membershipType) params.append('membershipType', filters.membershipType);
    if (filters?.isActive !== undefined) params.append('isActive', filters.isActive.toString());
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);
    
    return this.api.get(`/members?${params.toString()}`);
  }

  async getMemberById(id: number): Promise<AxiosResponse<Member>> {
    return this.api.get(`/members/${id}`);
  }

  async createMember(memberData: CreateMemberRequest): Promise<AxiosResponse<Member>> {
    return this.api.post('/members', memberData);
  }

  async updateMember(id: number, memberData: UpdateMemberRequest): Promise<AxiosResponse<Member>> {
    return this.api.put(`/members/${id}`, memberData);
  }

  async deleteMember(id: number): Promise<AxiosResponse<void>> {
    return this.api.delete(`/members/${id}`);
  }

  // Health check
  async healthCheck(): Promise<AxiosResponse<{ status: string }>> {
    return this.api.get('/auth/health');
  }
}

// Instancia singleton del servicio
export const apiService = new ApiService();
export default apiService; 