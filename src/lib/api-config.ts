// Configuración de la API
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Endpoints de la API
export const API_ENDPOINTS = {
  // Auth
  register: '/auth/register',
  login: '/auth/login',
  logout: '/auth/logout',
  profile: '/auth/profile',
  
  // Users
  users: '/users',
  userById: (id: string) => `/users/${id}`,
  
  // Emergency requests
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
