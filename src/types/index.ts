// Tipos para la autenticación
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'admin' | 'user' | 'agent';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
}

// Tipos para solicitudes de emergencia
export interface EmergencyRequest {
  id: string;
  userId: string;
  type: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'in_progress' | 'resolved' | 'cancelled';
  description: string;
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  contactInfo: {
    phone: string;
    alternativePhone?: string;
  };
  medicalInfo?: {
    allergies?: string[];
    medications?: string[];
    conditions?: string[];
    emergencyContact?: {
      name: string;
      phone: string;
      relationship: string;
    };
  };
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  assignedAgentId?: string;
}

export interface CreateEmergencyRequestData {
  type: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  contactInfo: {
    phone: string;
    alternativePhone?: string;
  };
  medicalInfo?: {
    allergies?: string[];
    medications?: string[];
    conditions?: string[];
    emergencyContact?: {
      name: string;
      phone: string;
      relationship: string;
    };
  };
}

// Tipos para el perfil del usuario
export interface UserProfile extends User {
  emergencyContacts: EmergencyContact[];
  medicalInfo: MedicalInfo;
  preferences: UserPreferences;
}

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
  isPrimary: boolean;
}

export interface MedicalInfo {
  bloodType?: string;
  allergies: string[];
  medications: string[];
  conditions: string[];
  insurance?: {
    provider: string;
    policyNumber: string;
  };
}

export interface UserPreferences {
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  language: string;
  timezone: string;
}
