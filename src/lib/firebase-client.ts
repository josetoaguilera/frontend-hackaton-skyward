import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile
} from 'firebase/auth';
import { auth } from './firebase';
import type { User, EmergencyRequest } from '@/types';

// Backend API URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

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
    firstName: string;
    lastName: string;
    phone: string;
    address?: string;
    bloodType?: string;
    allergies?: string;
    medicalConditions?: string;
    emergencyContact?: {
      name: string;
      phone: string;
      relationship: string;
    };
  }): Promise<void> {
    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        userData.email,
        userData.password
      );

      const user = userCredential.user;
      this.currentUser = user;

      // Update display name
      await updateProfile(user, {
        displayName: `${userData.firstName} ${userData.lastName}`
      });

      // Get Firebase token
      const token = await user.getIdToken();

      // Send user data to backend
      const response = await fetch(`${API_BASE_URL}/v1/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          uid: user.uid,
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          phone: userData.phone,
          address: userData.address || '',
          bloodType: userData.bloodType || '',
          allergies: userData.allergies || '',
          medicalConditions: userData.medicalConditions || '',
          emergencyContact: userData.emergencyContact || null,
        })
      });

      if (!response.ok) {
        // If backend fails, delete Firebase user to maintain consistency
        await user.delete();
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
      return await response.json();
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
