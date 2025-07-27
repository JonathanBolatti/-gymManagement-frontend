// Tipos de usuario (empleados/administradores)
export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  RECEPTIONIST = 'RECEPTIONIST'
}

// Tipos de miembro (clientes del gimnasio)
export interface Member {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: Gender;
  address: string;
  emergencyContact: string;
  emergencyPhone: string;
  membershipType: MembershipType;
  startDate: string;
  endDate: string;
  isActive: boolean;
  notes: string;
  createdBy: number; // ID del usuario que lo creó
  createdAt: string;
  updatedAt: string;
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER'
}

export enum MembershipType {
  BASIC = 'BASIC',
  PREMIUM = 'PREMIUM',
  VIP = 'VIP'
}

// Tipos de autenticación
export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

// Tipos de respuesta de API
export interface ApiResponse<T> {
  data: T;
  message: string;
  status: string;
  statusCode: number;
}

// Tipos para formularios
export interface CreateMemberRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: Gender;
  address: string;
  emergencyContact: string;
  emergencyPhone: string;
  membershipType: MembershipType;
  startDate: string;
  endDate: string;
  notes?: string;
}

export interface UpdateMemberRequest extends Partial<CreateMemberRequest> {
  id: number;
}

export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

export interface UpdateUserRequest extends Partial<CreateUserRequest> {
  id: number;
}

// Tipos para paginación
export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

// Tipos para filtros
export interface MemberFilters {
  search?: string;
  membershipType?: MembershipType;
  isActive?: boolean;
  startDate?: string;
  endDate?: string;
}

export interface UserFilters {
  search?: string;
  role?: UserRole;
  isActive?: boolean;
} 