// Configuración de la API
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Endpoints de la API
export const API_ENDPOINTS = {
  // Auth
  register: '/v1/auth/register',
  checkEmail: (email: string) => `/v1/auth/check-email/${email}`,
  signIn: '/v1/auth/signin',
  login: '/v1/auth/login',
  profile: '/v1/auth/profile',
  verifyEmail: '/v1/auth/verify-email',
  
  // Users
  users: '/v1/users',
  userMe: '/v1/users/me',
  userById: (id: string) => `/v1/users/${id}`,
  userByRut: (rut: string) => `/v1/users/rut/${rut}`,
  userByPhone: (phoneNumber: string) => `/v1/users/phone/${phoneNumber}`,
  
  // Addresses
  addresses: '/v1/addresses',
  addressById: (id: string) => `/v1/addresses/${id}`,
  setPrimaryAddress: (id: string) => `/v1/addresses/${id}/set-primary`,
  
  // Emergency Contacts
  emergencyContacts: '/v1/emergency-contacts',
  emergencyContactById: (id: string) => `/v1/emergency-contacts/${id}`,
  
  // Emergency Events
  emergencyEvents: '/v1/emergency-events',
  allEmergencyEvents: '/v1/emergency-events/all',
  emergencyEventById: (id: string) => `/v1/emergency-events/${id}`,
  
  // Bank Accounts
  bankAccounts: '/v1/bank-accounts',
  bankAccountById: (id: string) => `/v1/bank-accounts/${id}`,
  
  // Health Insurance
  healthInsurance: '/v1/health-insurance',
  healthInsuranceById: (id: string) => `/v1/health-insurance/${id}`,
  
  // Medical Info
  medicalInfo: '/v1/medical-info',
  
  // Emergency requests (legacy - mantener para compatibilidad)
  emergencyRequests: '/emergency-requests',
  createEmergencyRequest: '/emergency-requests',
  
  // Settings
  settings: '/settings',
  
  // Reports
  reports: '/reports',
  analytics: '/analytics'
};

// Tipos de emergencia
export const EMERGENCY_TYPES = {
  MEDICAL: 'medical',
  FIRE: 'fire',
  SECURITY: 'security',
  TECHNICAL: 'technical',
  OTHER: 'other'
} as const;

export const EMERGENCY_LABELS = {
  [EMERGENCY_TYPES.MEDICAL]: 'Emergencia Médica',
  [EMERGENCY_TYPES.FIRE]: 'Incendio',
  [EMERGENCY_TYPES.SECURITY]: 'Seguridad',
  [EMERGENCY_TYPES.TECHNICAL]: 'Técnica',
  [EMERGENCY_TYPES.OTHER]: 'Otra'
};

// Estados de solicitud
export const REQUEST_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  RESOLVED: 'resolved',
  CANCELLED: 'cancelled'
} as const;
