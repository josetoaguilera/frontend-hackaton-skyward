'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { 
  Phone, 
  User, 
  Bell, 
  LogOut, 
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  Plus,
  Search,
  Filter
} from 'lucide-react';
import { apiClient } from '@/lib/firebase-client';
import type { User as UserType, EmergencyRequest } from '@/types';
import { EMERGENCY_LABELS, REQUEST_STATUS } from '@/lib/api-config';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function DashboardPage() {
  const { user: firebaseUser, loading: authLoading } = useAuth();
  const [user, setUser] = useState<UserType | null>(null);
  const [emergencyRequests, setEmergencyRequests] = useState<EmergencyRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const router = useRouter();

  useEffect(() => {
    // Esperar a que Firebase complete la autenticación
    if (!authLoading && firebaseUser) {
      loadData();
    } else if (!authLoading && !firebaseUser) {
      // Si no hay usuario después de cargar, no hacer nada
      // ProtectedRoute se encargará de redirigir
      setIsLoading(false);
    }
  }, [authLoading, firebaseUser]);

  const loadData = async () => {
    try {
      const [userResponse, requestsResponse] = await Promise.all([
        apiClient.getProfile(),
        apiClient.getEmergencyRequests()
      ]);

      setUser(userResponse);
      setEmergencyRequests(Array.isArray(requestsResponse) ? requestsResponse : []);
    } catch (error) {
      console.error('Error loading data:', error);
      setEmergencyRequests([]); // Asegurar que sea un array vacío en caso de error
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

  // Copy Firebase token for testing in Swagger
  const copyTokenToClipboard = async () => {
    try {
      const token = await apiClient.getIdToken();
      if (token) {
        await navigator.clipboard.writeText(token);
        alert('✅ Token copiado al clipboard!\n\nPega este token en Swagger:\n1. Click en "Authorize"\n2. Escribe: Bearer ' + token.substring(0, 20) + '...\n3. Click "Authorize"');
      } else {
        alert('❌ No hay usuario autenticado');
      }
    } catch (error) {
      console.error('Error copying token:', error);
      alert('❌ Error al copiar el token');
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      [REQUEST_STATUS.PENDING]: { variant: 'secondary' as const, icon: Clock, label: 'Pendiente' },
      [REQUEST_STATUS.IN_PROGRESS]: { variant: 'default' as const, icon: AlertTriangle, label: 'En Progreso' },
      [REQUEST_STATUS.RESOLVED]: { variant: 'secondary' as const, icon: CheckCircle, label: 'Resuelto' },
      [REQUEST_STATUS.CANCELLED]: { variant: 'destructive' as const, icon: XCircle, label: 'Cancelado' }
    };

    const badge = badges[status as keyof typeof badges] || badges[REQUEST_STATUS.PENDING];
    const Icon = badge.icon;

    return (
      <Badge variant={badge.variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {badge.label}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const priorities = {
      low: { variant: 'outline' as const, label: 'Baja' },
      medium: { variant: 'secondary' as const, label: 'Media' },
      high: { variant: 'default' as const, label: 'Alta' },
      critical: { variant: 'destructive' as const, label: 'Crítica' }
    };

    const badge = priorities[priority as keyof typeof priorities] || priorities.low;

    return (
      <Badge variant={badge.variant}>
        {badge.label}
      </Badge>
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
          <p className="mt-4 text-gray-600">Cargando datos...</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="bg-red-100 p-2 rounded-lg">
                <Phone className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-3">
                <h1 className="text-xl font-semibold text-gray-900">
                  Sistema de Emergencias 911
                </h1>
                <p className="text-sm text-gray-500">Panel de Control</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Dev Tool: Copy Token for Swagger */}
              <Button 
                onClick={copyTokenToClipboard}
                variant="outline" 
                size="sm"
                className="text-xs"
                title="Copiar token para Swagger"
              >
                🔑 Token
              </Button>

              <Button variant="ghost" size="icon">
                <Bell className="h-4 w-4" />
              </Button>
              
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{user?.firstName} {user?.lastName}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                <div className="bg-red-100 p-2 rounded-full">
                  <User className="h-5 w-5 text-red-600" />
                </div>
              </div>

              <Button
                onClick={handleLogout}
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-red-600"
                title="Cerrar sesión"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Solicitudes</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pending}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">En Progreso</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.inProgress}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resueltas</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.resolved}</div>
            </CardContent>
          </Card>
        </div>

        {/* Emergency Requests Section */}
        <Card>
          <CardHeader>
            <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
              <div>
                <CardTitle className="text-xl font-semibold text-gray-900">
                  Solicitudes de Emergencia
                </CardTitle>
                <CardDescription>
                  Gestiona todas las solicitudes del sistema
                </CardDescription>
              </div>
              <Button
                onClick={() => router.push('/emergency-request/new')}
                className="bg-red-600 hover:bg-red-700"
              >
                <Plus className="mr-2 h-4 w-4" />
                Nueva Solicitud
              </Button>
            </div>

            {/* Filters */}
            <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar solicitudes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filtrar por estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value={REQUEST_STATUS.PENDING}>Pendiente</SelectItem>
                  <SelectItem value={REQUEST_STATUS.IN_PROGRESS}>En Progreso</SelectItem>
                  <SelectItem value={REQUEST_STATUS.RESOLVED}>Resuelto</SelectItem>
                  <SelectItem value={REQUEST_STATUS.CANCELLED}>Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>

          <CardContent>
            <div className="space-y-4">
              {filteredRequests.length === 0 ? (
                <div className="py-12 text-center">
                  <AlertTriangle className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-2 text-sm font-medium">No hay solicitudes</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {searchTerm || statusFilter !== 'all' ? 'No se encontraron solicitudes con los filtros aplicados.' : 'Comienza creando tu primera solicitud de emergencia.'}
                  </p>
                </div>
              ) : (
                filteredRequests.map((request) => (
                  <Card key={request.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-medium">
                              {EMERGENCY_LABELS[request.type as keyof typeof EMERGENCY_LABELS] || request.type}
                            </h3>
                            {getStatusBadge(request.status)}
                            {getPriorityBadge(request.priority)}
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                            {request.description}
                          </p>
                          <div className="flex items-center text-xs text-muted-foreground gap-4">
                            <span>Creado: {new Date(request.createdAt).toLocaleString('es-ES')}</span>
                            {request.contactInfo.phone && (
                              <span>Tel: {request.contactInfo.phone}</span>
                            )}
                          </div>
                        </div>
                        
                        <Button
                          onClick={() => router.push(`/emergency-request/${request.id}`)}
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                        >
                          Ver detalles
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
    </ProtectedRoute>
  );
}
