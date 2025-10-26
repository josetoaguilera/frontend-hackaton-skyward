// Generic API response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

// Tipos para la autenticación
export interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  rut?: string;
  phoneNumber?: string;
  role: 'admin' | 'user' | 'agent';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Tipo para las respuestas de la API (snake_case)
export interface UserApiResponse {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  rut?: string;
  phone_number?: string;
  role: 'admin' | 'user' | 'agent';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface RegisterData {
  email: string;
  password: string;
  fullName: string;
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

// Tipos para direcciones
export interface Address {
  id: string;
  userId: string;
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  isPrimary: boolean;
  label?: string; // e.g., "Home", "Work", "Other"
  additionalInfo?: string;
  createdAt: string;
  updatedAt: string;
}

// API response type for Address (snake_case)
export interface AddressApiResponse {
  id: string;
  user_id: string;
  street_address: string;
  city: string;
  region: string;
  country: string;
  postal_code: string;
  is_primary: boolean;
  address_type?: string;
  additional_info?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateAddressData {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  label?: string;
  additionalInfo?: string;
}

export interface UpdateAddressData extends Partial<CreateAddressData> {
  isPrimary?: boolean;
}

// Tipos para contactos de emergencia
export interface EmergencyContactData {
  id: string;
  userId: string;
  name: string;
  phone: string;
  relationship: string;
  email?: string;
  createdAt: string;
  updatedAt: string;
}

// API response type for EmergencyContact (snake_case)
export interface EmergencyContactApiResponse {
  id: string;
  user_id: string;
  contact_name: string;
  phone_number: string;
  relationship: string;
  email?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateEmergencyContactData {
  name: string;
  phone: string;
  relationship: string;
  email?: string;
}

export interface UpdateEmergencyContactData extends Partial<CreateEmergencyContactData> {}

// Tipos mejorados para eventos de emergencia
export interface EmergencyEvent {
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

export interface CreateEmergencyEventData {
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

export interface UpdateEmergencyEventData extends Partial<CreateEmergencyEventData> {
  status?: 'pending' | 'in_progress' | 'resolved' | 'cancelled';
  assignedAgentId?: string;
  resolvedAt?: string;
}

// Tipos para cuentas bancarias
export interface BankAccount {
  id: string;
  userId: string;
  bankName: string;
  accountNumber: string;
  accountType: 'checking' | 'savings' | 'other';
  accountHolderName: string;
  routingNumber?: string;
  swiftCode?: string;
  isPrimary: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBankAccountData {
  bank_name: string;
  account_type: string;
  account_number: string;
  rut: string;
}

export interface UpdateBankAccountData extends Partial<CreateBankAccountData> {}

// Tipos para seguros de salud
export interface HealthInsurance {
  id: string;
  userId: string;
  primary_provider: boolean;
  provider_name: string;
  plan_name: string;
  member_id: string;
  coverage_info: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateHealthInsuranceData {
  primary_provider: boolean;
  provider_name: string;
  plan_name: string;
  member_id: string;
  coverage_info: string;
}

export interface UpdateHealthInsuranceData extends Partial<CreateHealthInsuranceData> {}

// Tipos para información médica
export interface MedicalInfoData {
  id: string;
  userId: string;
  bloodType?: string;
  allergies?: string[];
  medications?: string[];
  conditions?: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMedicalInfoData {
  bloodType?: string;
  allergies?: string[];
  medications?: string[];
  conditions?: string[];
  notes?: string;
}

export interface UpdateMedicalInfoData extends Partial<CreateMedicalInfoData> {}
