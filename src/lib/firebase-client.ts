import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile
} from 'firebase/auth';
import { auth } from './firebase';
import { 
  transformUserFromApi, 
  transformUserToApi, 
  transformAddressFromApi, 
  transformAddressToApi, 
  transformEmergencyContactFromApi, 
  transformEmergencyContactToApi, 
  transformFromApi, 
  transformToApi 
} from './api-transforms';
import type { 
  ApiResponse,
  User, 
  UserApiResponse,
  EmergencyRequest,
  Address,
  AddressApiResponse,
  CreateAddressData,
  UpdateAddressData,
  EmergencyContactData,
  EmergencyContactApiResponse,
  CreateEmergencyContactData,
  UpdateEmergencyContactData,
  EmergencyEvent,
  CreateEmergencyEventData,
  UpdateEmergencyEventData,
  BankAccount,
  CreateBankAccountData,
  UpdateBankAccountData,
  HealthInsurance,
  CreateHealthInsuranceData,
  UpdateHealthInsuranceData,
  MedicalInfoData,
  CreateMedicalInfoData,
  UpdateMedicalInfoData
} from '@/types';

// Backend API URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

class FirebaseAuthClient {
  private currentUser: FirebaseUser | null = null;

  constructor() {
    // Listen to auth state changes
    onAuthStateChanged(auth, (user) => {
      this.currentUser = user;
    });
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  // Get current user's ID token
  async getIdToken(): Promise<string | null> {
    if (!this.currentUser) return null;
    return await this.currentUser.getIdToken();
  }

  // Helper method to make authenticated API calls
  private async fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
    const token = await this.getIdToken();
    
    if (!token) {
      throw new Error('No hay usuario autenticado');
    }

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    };

    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Error en la petición' }));
      throw new Error(error.message || `Error: ${response.status}`);
    }

    return response;
  }

  // Login with email and password
  async login(credentials: { email: string; password: string }): Promise<void> {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password
      );
      this.currentUser = userCredential.user;
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  // Register new user
  async register(userData: {
    email: string;
    password: string;
    fullName: string;
    phone: string;
    rut?: string;
  }): Promise<void> {
    try {
      // Send user data to backend
      const response = await fetch(`${API_BASE_URL}/v1/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userData.email,
          full_name: userData.fullName,
          phone_number: userData.phone,
          password: userData.password,
          rut: userData.rut
        })
      });

      if (!response.ok) {
        // If backend fails, delete Firebase user to maintain consistency
        throw new Error('Error al crear el perfil en el servidor');
      }
    } catch (error: any) {
      console.error('Register error:', error);
      if (error.code) {
        throw new Error(this.getErrorMessage(error.code));
      }
      throw error;
    }
  }

  // Logout
  async logout(): Promise<void> {
    try {
      await signOut(auth);
      this.currentUser = null;
    } catch (error) {
      console.error('Logout error:', error);
      throw new Error('Error al cerrar sesión');
    }
  }

  // Get user profile from backend
  async getProfile(): Promise<User> {
    try {
      const response = await this.fetchWithAuth('/v1/users/me');
      const apiResponse: ApiResponse<UserApiResponse> = await response.json();
      console.log("\n\nAPI USER DATA", apiResponse);
      
      if (!apiResponse.success) {
        throw new Error('API request was not successful');
      }
      
      const data = transformUserFromApi(apiResponse.data);
      console.log("DATA", data)
      return data
    } catch (error: any) {
      console.error('Get profile error:', error);
      throw new Error(error.message || 'Error al obtener el perfil');
    }
  }

  // Get emergency requests from backend
  async getEmergencyRequests(): Promise<EmergencyRequest[]> {
    try {
      const response = await this.fetchWithAuth('/v1/emergency-events');
      return await response.json();
    } catch (error: any) {
      console.error('Get emergency requests error:', error);
      throw new Error(error.message || 'Error al obtener las solicitudes');
    }
  }

  // Create emergency request in backend
  async createEmergencyRequest(requestData: Omit<EmergencyRequest, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<EmergencyRequest> {
    try {
      const response = await this.fetchWithAuth('/v1/emergency-events', {
        method: 'POST',
        body: JSON.stringify(requestData)
      });
      return await response.json();
    } catch (error: any) {
      console.error('Create emergency request error:', error);
      throw new Error(error.message || 'Error al crear la solicitud de emergencia');
    }
  }

  // Get emergency request by ID from backend
  async getEmergencyRequest(id: string): Promise<EmergencyRequest> {
    try {
      const response = await this.fetchWithAuth(`/v1/emergency-events/${id}`);
      return await response.json();
    } catch (error: any) {
      console.error('Get emergency request error:', error);
      throw error;
    }
  }

  // Update emergency request in backend
  async updateEmergencyRequest(id: string, updates: Partial<EmergencyRequest>): Promise<EmergencyRequest> {
    try {
      const response = await this.fetchWithAuth(`/v1/emergency-events/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
      });
      return await response.json();
    } catch (error: any) {
      console.error('Update emergency request error:', error);
      throw error;
    }
  }

  // Delete emergency request from backend
  async deleteEmergencyRequest(id: string): Promise<void> {
    try {
      await this.fetchWithAuth(`/v1/emergency-events/${id}`, {
        method: 'DELETE'
      });
    } catch (error: any) {
      console.error('Delete emergency request error:', error);
      throw error;
    }
  }

  // ==================== ADDRESSES ====================
  
  // Get all addresses for the authenticated user
  async getAddresses(): Promise<Address[]> {
    try {
      const response = await this.fetchWithAuth('/v1/addresses');
      const apiResponse: ApiResponse<AddressApiResponse[]> = await response.json();
      
      if (!apiResponse.success) {
        throw new Error('API request was not successful');
      }
      
      return apiResponse.data.map(transformAddressFromApi);
    } catch (error: any) {
      console.error('Get addresses error:', error);
      throw new Error(error.message || 'Error al obtener las direcciones');
    }
  }

  // Create a new address
  async createAddress(addressData: CreateAddressData): Promise<Address> {
    try {
      const apiAddressData = transformAddressToApi(addressData);
      const response = await this.fetchWithAuth('/v1/addresses', {
        method: 'POST',
        body: JSON.stringify(apiAddressData)
      });
      const apiResponse: ApiResponse<AddressApiResponse> = await response.json();
      
      if (!apiResponse.success) {
        throw new Error('API request was not successful');
      }
      
      return transformAddressFromApi(apiResponse.data);
    } catch (error: any) {
      console.error('Create address error:', error);
      throw new Error(error.message || 'Error al crear la dirección');
    }
  }

  // Get a specific address by ID
  async getAddress(id: string): Promise<Address> {
    try {
      const response = await this.fetchWithAuth(`/v1/addresses/${id}`);
      return await response.json();
    } catch (error: any) {
      console.error('Get address error:', error);
      throw error;
    }
  }

  // Update an address
  async updateAddress(id: string, updates: UpdateAddressData): Promise<Address> {
    try {
      const response = await this.fetchWithAuth(`/v1/addresses/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
      });
      return await response.json();
    } catch (error: any) {
      console.error('Update address error:', error);
      throw error;
    }
  }

  // Delete an address
  async deleteAddress(id: string): Promise<void> {
    try {
      await this.fetchWithAuth(`/v1/addresses/${id}`, {
        method: 'DELETE'
      });
    } catch (error: any) {
      console.error('Delete address error:', error);
      throw error;
    }
  }

  // Set an address as the primary address
  async setPrimaryAddress(id: string): Promise<Address> {
    try {
      const response = await this.fetchWithAuth(`/v1/addresses/${id}/set-primary`, {
        method: 'PATCH'
      });
      return await response.json();
    } catch (error: any) {
      console.error('Set primary address error:', error);
      throw error;
    }
  }

  // ==================== AUTHENTICATION ====================

  // Check if email is available for registration
  async checkEmail(email: string): Promise<{ available: boolean }> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/check-email/${email}`);
      if (!response.ok) {
        throw new Error('Error al verificar el correo');
      }
      return await response.json();
    } catch (error: any) {
      console.error('Check email error:', error);
      throw new Error(error.message || 'Error al verificar el correo');
    }
  }

  // Sign in with Firebase ID token
  async signInWithToken(idToken: string): Promise<User> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Error al iniciar sesión');
      }
      
      return await response.json();
    } catch (error: any) {
      console.error('Sign in with token error:', error);
      throw new Error(error.message || 'Error al iniciar sesión');
    }
  }

  // Generate email verification link
  async verifyEmail(): Promise<{ message: string }> {
    try {
      const response = await this.fetchWithAuth('/v1/auth/verify-email', {
        method: 'POST'
      });
      return await response.json();
    } catch (error: any) {
      console.error('Verify email error:', error);
      throw new Error(error.message || 'Error al enviar el correo de verificación');
    }
  }

  // ==================== EMERGENCY CONTACTS ====================

  // Get all emergency contacts for the authenticated user
  async getEmergencyContacts(): Promise<EmergencyContactData[]> {
    try {
      const response = await this.fetchWithAuth('/v1/emergency-contacts');
      const apiResponse: ApiResponse<EmergencyContactApiResponse[]> = await response.json();
      
      if (!apiResponse.success) {
        throw new Error('API request was not successful');
      }
      
      return apiResponse.data.map(transformEmergencyContactFromApi);
    } catch (error: any) {
      console.error('Get emergency contacts error:', error);
      throw new Error(error.message || 'Error al obtener los contactos de emergencia');
    }
  }

  // Create a new emergency contact
  async createEmergencyContact(contactData: CreateEmergencyContactData): Promise<EmergencyContactData> {
    try {
      const apiContactData = transformEmergencyContactToApi(contactData);
      const response = await this.fetchWithAuth('/v1/emergency-contacts', {
        method: 'POST',
        body: JSON.stringify(apiContactData)
      });
      const apiResponse: ApiResponse<EmergencyContactApiResponse> = await response.json();
      
      if (!apiResponse.success) {
        throw new Error('API request was not successful');
      }
      
      return transformEmergencyContactFromApi(apiResponse.data);
    } catch (error: any) {
      console.error('Create emergency contact error:', error);
      throw new Error(error.message || 'Error al crear el contacto de emergencia');
    }
  }

  // Get a specific emergency contact by ID
  async getEmergencyContact(id: string): Promise<EmergencyContactData> {
    try {
      const response = await this.fetchWithAuth(`/v1/emergency-contacts/${id}`);
      return await response.json();
    } catch (error: any) {
      console.error('Get emergency contact error:', error);
      throw error;
    }
  }

  // Update an emergency contact
  async updateEmergencyContact(id: string, updates: UpdateEmergencyContactData): Promise<EmergencyContactData> {
    try {
      const response = await this.fetchWithAuth(`/v1/emergency-contacts/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
      });
      return await response.json();
    } catch (error: any) {
      console.error('Update emergency contact error:', error);
      throw error;
    }
  }

  // Delete an emergency contact
  async deleteEmergencyContact(id: string): Promise<void> {
    try {
      await this.fetchWithAuth(`/v1/emergency-contacts/${id}`, {
        method: 'DELETE'
      });
    } catch (error: any) {
      console.error('Delete emergency contact error:', error);
      throw error;
    }
  }

  // ==================== EMERGENCY EVENTS (ENHANCED) ====================

  // Get all emergency events (Admin only)
  async getAllEmergencyEvents(): Promise<EmergencyEvent[]> {
    try {
      const response = await this.fetchWithAuth('/v1/emergency-events/all');
      return await response.json();
    } catch (error: any) {
      console.error('Get all emergency events error:', error);
      throw new Error(error.message || 'Error al obtener todos los eventos de emergencia');
    }
  }

  // ==================== USERS ====================

  // Get all users (Admin only)
  async getAllUsers(): Promise<User[]> {
    try {
      const response = await this.fetchWithAuth('/v1/users');
      return await response.json();
    } catch (error: any) {
      console.error('Get all users error:', error);
      throw new Error(error.message || 'Error al obtener los usuarios');
    }
  }

  // Update current user profile
  async updateProfile(updates: Partial<User>): Promise<User> {
    try {
      const apiUpdates = transformUserToApi(updates);
      const response = await this.fetchWithAuth('/v1/users/me', {
        method: 'PUT',
        body: JSON.stringify(apiUpdates)
      });
      const apiResponse: ApiResponse<UserApiResponse> = await response.json();
      
      if (!apiResponse.success) {
        throw new Error('API request was not successful');
      }
      
      return transformUserFromApi(apiResponse.data);
    } catch (error: any) {
      console.error('Update profile error:', error);
      throw new Error(error.message || 'Error al actualizar el perfil');
    }
  }

  // Delete current user account
  async deleteAccount(): Promise<void> {
    try {
      await this.fetchWithAuth('/v1/users/me', {
        method: 'DELETE'
      });
    } catch (error: any) {
      console.error('Delete account error:', error);
      throw new Error(error.message || 'Error al eliminar la cuenta');
    }
  }

  // Get user by ID
  async getUserById(id: string): Promise<User> {
    try {
      const response = await this.fetchWithAuth(`/v1/users/${id}`);
      return await response.json();
    } catch (error: any) {
      console.error('Get user by ID error:', error);
      throw error;
    }
  }

  // Get user by RUT
  async getUserByRut(rut: string): Promise<User> {
    try {
      const response = await this.fetchWithAuth(`/v1/users/rut/${rut}`);
      return await response.json();
    } catch (error: any) {
      console.error('Get user by RUT error:', error);
      throw error;
    }
  }

  // Get user by phone number
  async getUserByPhone(phoneNumber: string): Promise<User> {
    try {
      const response = await this.fetchWithAuth(`/v1/users/phone/${phoneNumber}`);
      return await response.json();
    } catch (error: any) {
      console.error('Get user by phone error:', error);
      throw error;
    }
  }

  // ==================== BANK ACCOUNTS ====================

  // Get all bank accounts for the authenticated user
  async getBankAccounts(): Promise<BankAccount[]> {
    try {
      const response = await this.fetchWithAuth('/v1/bank-accounts');
      const apiResponse: ApiResponse<BankAccount[]> = await response.json();
      
      if (!apiResponse.success) {
        throw new Error('API request was not successful');
      }
      
      return apiResponse.data;
    } catch (error: any) {
      console.error('Get bank accounts error:', error);
      throw new Error(error.message || 'Error al obtener las cuentas bancarias');
    }
  }

  // Create a new bank account
  async createBankAccount(accountData: CreateBankAccountData): Promise<BankAccount> {
    try {
      const response = await this.fetchWithAuth('/v1/bank-accounts', {
        method: 'POST',
        body: JSON.stringify(accountData)
      });
      const apiResponse: ApiResponse<BankAccount> = await response.json();
      
      if (!apiResponse.success) {
        throw new Error('API request was not successful');
      }
      
      return apiResponse.data;
    } catch (error: any) {
      console.error('Create bank account error:', error);
      throw new Error(error.message || 'Error al crear la cuenta bancaria');
    }
  }

  // Get a specific bank account by ID
  async getBankAccount(id: string): Promise<BankAccount> {
    try {
      const response = await this.fetchWithAuth(`/v1/bank-accounts/${id}`);
      return await response.json();
    } catch (error: any) {
      console.error('Get bank account error:', error);
      throw error;
    }
  }

  // Update a bank account
  async updateBankAccount(id: string, updates: UpdateBankAccountData): Promise<BankAccount> {
    try {
      const response = await this.fetchWithAuth(`/v1/bank-accounts/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
      });
      return await response.json();
    } catch (error: any) {
      console.error('Update bank account error:', error);
      throw error;
    }
  }

  // Delete a bank account
  async deleteBankAccount(id: string): Promise<void> {
    try {
      await this.fetchWithAuth(`/v1/bank-accounts/${id}`, {
        method: 'DELETE'
      });
    } catch (error: any) {
      console.error('Delete bank account error:', error);
      throw error;
    }
  }

  // ==================== HEALTH INSURANCE ====================

  // Get all health insurance records for the authenticated user
  async getHealthInsurances(): Promise<HealthInsurance[]> {
    try {
      const response = await this.fetchWithAuth('/v1/health-insurance');
      const apiResponse: ApiResponse<HealthInsurance[]> = await response.json();
      
      if (!apiResponse.success) {
        throw new Error('API request was not successful');
      }
      
      return apiResponse.data;
    } catch (error: any) {
      console.error('Get health insurances error:', error);
      throw new Error(error.message || 'Error al obtener los seguros de salud');
    }
  }

  // Create a new health insurance record
  async createHealthInsurance(insuranceData: CreateHealthInsuranceData): Promise<HealthInsurance> {
    try {
      const response = await this.fetchWithAuth('/v1/health-insurance', {
        method: 'POST',
        body: JSON.stringify(insuranceData)
      });
      const apiResponse: ApiResponse<HealthInsurance> = await response.json();
      
      if (!apiResponse.success) {
        throw new Error('API request was not successful');
      }
      
      return apiResponse.data;
    } catch (error: any) {
      console.error('Create health insurance error:', error);
      throw new Error(error.message || 'Error al crear el seguro de salud');
    }
  }

  // Get a specific health insurance record by ID
  async getHealthInsurance(id: string): Promise<HealthInsurance> {
    try {
      const response = await this.fetchWithAuth(`/v1/health-insurance/${id}`);
      return await response.json();
    } catch (error: any) {
      console.error('Get health insurance error:', error);
      throw error;
    }
  }

  // Update a health insurance record
  async updateHealthInsurance(id: string, updates: UpdateHealthInsuranceData): Promise<HealthInsurance> {
    try {
      const response = await this.fetchWithAuth(`/v1/health-insurance/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
      });
      return await response.json();
    } catch (error: any) {
      console.error('Update health insurance error:', error);
      throw error;
    }
  }

  // Delete a health insurance record
  async deleteHealthInsurance(id: string): Promise<void> {
    try {
      await this.fetchWithAuth(`/v1/health-insurance/${id}`, {
        method: 'DELETE'
      });
    } catch (error: any) {
      console.error('Delete health insurance error:', error);
      throw error;
    }
  }

  // ==================== MEDICAL INFO ====================

  // Get medical info for the authenticated user
  async getMedicalInfo(): Promise<MedicalInfoData> {
    try {
      const response = await this.fetchWithAuth('/v1/medical-info');
      const apiResponse: ApiResponse<MedicalInfoData> = await response.json();
      
      if (!apiResponse.success) {
        throw new Error('API request was not successful');
      }
      
      return apiResponse.data;
    } catch (error: any) {
      console.error('Get medical info error:', error);
      throw new Error(error.message || 'Error al obtener la información médica');
    }
  }

  // Create medical info for the authenticated user
  async createMedicalInfo(medicalData: CreateMedicalInfoData): Promise<MedicalInfoData> {
    try {
      const response = await this.fetchWithAuth('/v1/medical-info', {
        method: 'POST',
        body: JSON.stringify(medicalData)
      });
      return await response.json();
    } catch (error: any) {
      console.error('Create medical info error:', error);
      throw new Error(error.message || 'Error al crear la información médica');
    }
  }

  // Update medical info for the authenticated user
  async updateMedicalInfo(updates: UpdateMedicalInfoData): Promise<MedicalInfoData> {
    try {
      const response = await this.fetchWithAuth('/v1/medical-info', {
        method: 'PUT',
        body: JSON.stringify(updates)
      });
      return await response.json();
    } catch (error: any) {
      console.error('Update medical info error:', error);
      throw new Error(error.message || 'Error al actualizar la información médica');
    }
  }

  // Delete medical info for the authenticated user
  async deleteMedicalInfo(): Promise<void> {
    try {
      await this.fetchWithAuth('/v1/medical-info', {
        method: 'DELETE'
      });
    } catch (error: any) {
      console.error('Delete medical info error:', error);
      throw new Error(error.message || 'Error al eliminar la información médica');
    }
  }

  // Create or update medical info (upsert operation)
  async upsertMedicalInfo(medicalData: CreateMedicalInfoData): Promise<MedicalInfoData> {
    try {
      const response = await this.fetchWithAuth('/v1/medical-info', {
        method: 'PATCH',
        body: JSON.stringify(medicalData)
      });
      const apiResponse: ApiResponse<MedicalInfoData> = await response.json();
      
      if (!apiResponse.success) {
        throw new Error('API request was not successful');
      }
      
      return apiResponse.data;
    } catch (error: any) {
      console.error('Upsert medical info error:', error);
      throw new Error(error.message || 'Error al guardar la información médica');
    }
  }

  // Helper method to get user-friendly error messages
  private getErrorMessage(errorCode: string): string {
    const errorMessages: Record<string, string> = {
      'auth/user-not-found': 'Usuario no encontrado',
      'auth/wrong-password': 'Contraseña incorrecta',
      'auth/email-already-in-use': 'Este correo ya está registrado',
      'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres',
      'auth/invalid-email': 'Correo electrónico inválido',
      'auth/too-many-requests': 'Demasiados intentos. Intenta más tarde',
      'auth/network-request-failed': 'Error de conexión. Verifica tu internet'
    };

    return errorMessages[errorCode] || 'Error de autenticación';
  }

  // Clear local token (for compatibility)
  clearToken(): void {
    this.currentUser = null;
  }
}

// Export singleton instance
export const apiClient = new FirebaseAuthClient();
