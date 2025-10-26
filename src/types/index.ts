// Tipos para la autenticación
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  rut?: string;
  phoneNumber?: string;
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
  address?: string;
  isPrimary?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEmergencyContactData {
  name: string;
  phone: string;
  relationship: string;
  email?: string;
  address?: string;
  isPrimary?: boolean;
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
  bankName: string;
  accountNumber: string;
  accountType: 'checking' | 'savings' | 'other';
  accountHolderName: string;
  routingNumber?: string;
  swiftCode?: string;
  isPrimary?: boolean;
}

export interface UpdateBankAccountData extends Partial<CreateBankAccountData> {}

// Tipos para seguros de salud
export interface HealthInsurance {
  id: string;
  userId: string;
  provider: string;
  policyNumber: string;
  groupNumber?: string;
  coverageType: string;
  startDate: string;
  endDate?: string;
  isPrimary: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateHealthInsuranceData {
  provider: string;
  policyNumber: string;
  groupNumber?: string;
  coverageType: string;
  startDate: string;
  endDate?: string;
  isPrimary?: boolean;
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
