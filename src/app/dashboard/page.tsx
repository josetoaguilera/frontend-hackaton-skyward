'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Phone, 
  User, 
  Bell, 
  Settings, 
  LogOut, 
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  Plus,
  Search,
  Filter
} from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import type { User as UserType, EmergencyRequest } from '@/types';
import { EMERGENCY_LABELS, REQUEST_STATUS } from '@/lib/api-config';

export default function DashboardPage() {
  const [user, setUser] = useState<UserType | null>(null);
  const [emergencyRequests, setEmergencyRequests] = useState<EmergencyRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const router = useRouter();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      if (!apiClient.isAuthenticated()) {
        router.push('/login');
        return;
      }

      const [userResponse, requestsResponse] = await Promise.all([
        apiClient.getProfile(),
        apiClient.getEmergencyRequests()
      ]);

      setUser(userResponse);
      setEmergencyRequests(requestsResponse);
    } catch (error) {
      console.error('Error loading data:', error);
      if (error instanceof Error && error.message.includes('401')) {
        router.push('/login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await apiClient.logout();
      router.push('/login');
    } catch (error) {
      console.error('Error logging out:', error);
      // Forzar logout local incluso si falla la API
      apiClient.clearToken();
      router.push('/login');
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      [REQUEST_STATUS.PENDING]: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, label: 'Pendiente' },
      [REQUEST_STATUS.IN_PROGRESS]: { color: 'bg-blue-100 text-blue-800', icon: AlertTriangle, label: 'En Progreso' },
      [REQUEST_STATUS.RESOLVED]: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Resuelto' },
      [REQUEST_STATUS.CANCELLED]: { color: 'bg-red-100 text-red-800', icon: XCircle, label: 'Cancelado' }
    };

    const badge = badges[status as keyof typeof badges] || badges[REQUEST_STATUS.PENDING];
    const Icon = badge.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {badge.label}
      </span>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const priorities = {
      low: { color: 'bg-gray-100 text-gray-800', label: 'Baja' },
      medium: { color: 'bg-yellow-100 text-yellow-800', label: 'Media' },
      high: { color: 'bg-orange-100 text-orange-800', label: 'Alta' },
      critical: { color: 'bg-red-100 text-red-800', label: 'Crítica' }
    };

    const badge = priorities[priority as keyof typeof priorities] || priorities.low;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.color}`}>
        {badge.label}
      </span>
    );
  };

  const filteredRequests = emergencyRequests.filter(request => {
    const matchesSearch = request.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: emergencyRequests.length,
    pending: emergencyRequests.filter(r => r.status === REQUEST_STATUS.PENDING).length,
    inProgress: emergencyRequests.filter(r => r.status === REQUEST_STATUS.IN_PROGRESS).length,
    resolved: emergencyRequests.filter(r => r.status === REQUEST_STATUS.RESOLVED).length
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="bg-red-100 p-2 rounded-lg">
                <Phone className="h-6 w-6 text-red-600" />
              </div>
              <h1 className="ml-3 text-xl font-semibold text-gray-900">
                Sistema 911 - Dashboard
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Bell className="h-6 w-6" />
              </button>
              
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{user?.firstName} {user?.lastName}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                <div className="bg-red-100 p-2 rounded-full">
                  <User className="h-5 w-5 text-red-600" />
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                title="Cerrar sesión"
              >
                <LogOut className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="bg-blue-100 p-2 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Solicitudes</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="bg-yellow-100 p-2 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pendientes</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="bg-orange-100 p-2 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">En Progreso</p>
                <p className="text-2xl font-bold text-gray-900">{stats.inProgress}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="bg-green-100 p-2 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Resueltas</p>
                <p className="text-2xl font-bold text-gray-900">{stats.resolved}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Requests Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-lg font-medium text-gray-900 mb-4 sm:mb-0">
                Solicitudes de Emergencia
              </h2>
              
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Buscar solicitudes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>

                {/* Status Filter */}
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="pl-9 pr-8 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 appearance-none bg-white"
                  >
                    <option value="all">Todos los estados</option>
                    <option value={REQUEST_STATUS.PENDING}>Pendientes</option>
                    <option value={REQUEST_STATUS.IN_PROGRESS}>En Progreso</option>
                    <option value={REQUEST_STATUS.RESOLVED}>Resueltas</option>
                    <option value={REQUEST_STATUS.CANCELLED}>Canceladas</option>
                  </select>
                </div>

                {/* New Request Button */}
                <button
                  onClick={() => router.push('/emergency-request')}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:ring-2 focus:ring-red-500"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Nueva Solicitud
                </button>
              </div>
            </div>
          </div>

          {/* Requests List */}
          <div className="divide-y divide-gray-200">
            {filteredRequests.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <AlertTriangle className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No hay solicitudes</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm || statusFilter !== 'all' ? 'No se encontraron solicitudes con los filtros aplicados.' : 'Comienza creando tu primera solicitud de emergencia.'}
                </p>
              </div>
            ) : (
              filteredRequests.map((request) => (
                <div key={request.id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-sm font-medium text-gray-900">
                          {EMERGENCY_LABELS[request.type as keyof typeof EMERGENCY_LABELS] || request.type}
                        </h3>
                        {getStatusBadge(request.status)}
                        {getPriorityBadge(request.priority)}
                      </div>
                      <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                        {request.description}
                      </p>
                      <div className="mt-2 flex items-center text-xs text-gray-500 space-x-4">
                        <span>Creado: {new Date(request.createdAt).toLocaleString('es-ES')}</span>
                        {request.contactInfo.phone && (
                          <span>Tel: {request.contactInfo.phone}</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => router.push(`/emergency-request/${request.id}`)}
                        className="text-red-600 hover:text-red-900 text-sm font-medium"
                      >
                        Ver detalles
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
