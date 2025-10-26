'use client';

import { useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AddressesExample from '@/components/AddressesExample';
import EmergencyContactsExample from '@/components/EmergencyContactsExample';
import BankAccountsExample from '@/components/BankAccountsExample';
import MedicalInfoExample from '@/components/MedicalInfoExample';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, MapPin, Phone, Settings, CreditCard, Heart } from 'lucide-react';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Mi Perfil</h1>
            <p className="text-gray-500 mt-2">Gestiona tu información personal y configuración</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 lg:w-auto">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Perfil</span>
              </TabsTrigger>
              <TabsTrigger value="addresses" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span className="hidden sm:inline">Direcciones</span>
              </TabsTrigger>
              <TabsTrigger value="contacts" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span className="hidden sm:inline">Contactos</span>
              </TabsTrigger>
              <TabsTrigger value="medical" className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                <span className="hidden sm:inline">Médico</span>
              </TabsTrigger>
              <TabsTrigger value="banking" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                <span className="hidden sm:inline">Pagos</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Config</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Información Personal</CardTitle>
                  <CardDescription>
                    Actualiza tu información personal y datos de contacto
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500">
                    Esta sección mostrará el formulario de perfil del usuario.
                    Aquí podrás usar los endpoints:
                  </p>
                  <ul className="mt-4 space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <span className="font-mono bg-gray-100 px-2 py-1 rounded">GET /api/v1/users/me</span>
                      - Obtener perfil actual
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="font-mono bg-gray-100 px-2 py-1 rounded">PUT /api/v1/users/me</span>
                      - Actualizar perfil
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="font-mono bg-gray-100 px-2 py-1 rounded">DELETE /api/v1/users/me</span>
                      - Eliminar cuenta
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="addresses">
              <AddressesExample />
            </TabsContent>

            <TabsContent value="contacts">
              <EmergencyContactsExample />
            </TabsContent>

            <TabsContent value="medical">
              <MedicalInfoExample />
            </TabsContent>

            <TabsContent value="banking">
              <BankAccountsExample />
            </TabsContent>

            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Configuración de la Cuenta</CardTitle>
                  <CardDescription>
                    Administra la configuración y preferencias de tu cuenta
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500">
                    Esta sección mostrará configuraciones adicionales como:
                  </p>
                  <ul className="mt-4 space-y-2 text-sm">
                    <li>• Notificaciones por email</li>
                    <li>• Configuración de privacidad</li>
                    <li>• Preferencias de idioma</li>
                    <li>• Seguridad y autenticación</li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  );
}
