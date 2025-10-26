'use client';

import { useState } from 'react';
import { apiClient } from '@/lib/firebase-client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, X, Loader2 } from 'lucide-react';

export default function SetupDataPage() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{
    addresses: 'pending' | 'success' | 'error';
    contacts: 'pending' | 'success' | 'error';
    medical: 'pending' | 'success' | 'error';
    insurance: 'pending' | 'success' | 'error';
    banking: 'pending' | 'success' | 'error';
  }>({
    addresses: 'pending',
    contacts: 'pending',
    medical: 'pending',
    insurance: 'pending',
    banking: 'pending',
  });

  const agregarTodosMisDatos = async () => {
    setLoading(true);

    try {
      // 1. Agregar direcciones
      console.log('📍 Agregando direcciones...');
      const address1 = await apiClient.createAddress({
        street: 'Av. Libertador Bernardo O\'Higgins 1234',
        city: 'Santiago',
        state: 'Región Metropolitana',
        country: 'Chile',
        postalCode: '8320000',
        label: 'Casa',
        additionalInfo: 'Depto 401'
      });
      
      // Set as primary
      await apiClient.setPrimaryAddress(address1.id);
      
      await apiClient.createAddress({
        street: 'Av. Apoquindo 3000',
        city: 'Santiago',
        state: 'Región Metropolitana',
        country: 'Chile',
        postalCode: '7550000',
        label: 'Trabajo'
      });
      
      setResults(prev => ({ ...prev, addresses: 'success' }));
      console.log('✅ Direcciones agregadas');
    } catch (error) {
      console.error('❌ Error en direcciones:', error);
      setResults(prev => ({ ...prev, addresses: 'error' }));
    }

    try {
      // 2. Agregar contactos de emergencia
      console.log('📞 Agregando contactos...');
      await apiClient.createEmergencyContact({
        name: 'María González',
        phone: '+56912345678',
        relationship: 'Madre',
        email: 'maria@example.com',
        address: 'Av. Providencia 1234, Santiago',
        isPrimary: true
      });

      await apiClient.createEmergencyContact({
        name: 'Pedro Pérez',
        phone: '+56987654321',
        relationship: 'Hermano',
        email: 'pedro@example.com'
      });
      
      setResults(prev => ({ ...prev, contacts: 'success' }));
      console.log('✅ Contactos agregados');
    } catch (error) {
      console.error('❌ Error en contactos:', error);
      setResults(prev => ({ ...prev, contacts: 'error' }));
    }

    try {
      // 3. Agregar información médica
      console.log('❤️ Agregando información médica...');
      await apiClient.upsertMedicalInfo({
        bloodType: 'O+',
        allergies: ['Penicilina', 'Maní', 'Polen'],
        medications: ['Aspirina', 'Omeprazol'],
        conditions: ['Diabetes Tipo 2', 'Hipertensión'],
        notes: 'Revisar niveles de glucosa regularmente. Alérgico a picaduras de abejas.'
      });
      
      setResults(prev => ({ ...prev, medical: 'success' }));
      console.log('✅ Información médica agregada');
    } catch (error) {
      console.error('❌ Error en información médica:', error);
      setResults(prev => ({ ...prev, medical: 'error' }));
    }

    try {
      // 4. Agregar seguro de salud
      console.log('🛡️ Agregando seguro...');
      await apiClient.createHealthInsurance({
        provider: 'Isapre Cruz Blanca',
        policyNumber: 'POL-123456789',
        groupNumber: 'GRP-001',
        coverageType: 'Cobertura Completa',
        startDate: '2024-01-01',
        endDate: '2025-12-31',
        isPrimary: true
      });
      
      setResults(prev => ({ ...prev, insurance: 'success' }));
      console.log('✅ Seguro agregado');
    } catch (error) {
      console.error('❌ Error en seguro:', error);
      setResults(prev => ({ ...prev, insurance: 'error' }));
    }

    try {
      // 5. Agregar cuentas bancarias
      console.log('💳 Agregando cuentas bancarias...');
      await apiClient.createBankAccount({
        bankName: 'Banco de Chile',
        accountNumber: '1234567890',
        accountType: 'checking',
        accountHolderName: 'Juan Pérez',
        routingNumber: '001',
        swiftCode: 'BCHXCLRM',
        isPrimary: true
      });

      await apiClient.createBankAccount({
        bankName: 'Banco Santander',
        accountNumber: '9876543210',
        accountType: 'savings',
        accountHolderName: 'Juan Pérez',
        routingNumber: '002',
        swiftCode: 'SANXCLRM'
      });
      
      setResults(prev => ({ ...prev, banking: 'success' }));
      console.log('✅ Cuentas bancarias agregadas');
    } catch (error) {
      console.error('❌ Error en cuentas bancarias:', error);
      setResults(prev => ({ ...prev, banking: 'error' }));
    }

    setLoading(false);
    console.log('🎉 Proceso completado!');
  };

  const getStatusIcon = (status: 'pending' | 'success' | 'error') => {
    if (loading && status === 'pending') {
      return <Loader2 className="h-5 w-5 animate-spin text-gray-400" />;
    }
    if (status === 'success') {
      return <Check className="h-5 w-5 text-green-600" />;
    }
    if (status === 'error') {
      return <X className="h-5 w-5 text-red-600" />;
    }
    return <div className="h-5 w-5 rounded-full border-2 border-gray-300" />;
  };

  const allSuccess = Object.values(results).every(r => r === 'success');

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Configuración Inicial de Datos</CardTitle>
            <CardDescription>
              Este asistente agregará datos de ejemplo a tu perfil. Puedes modificarlos después desde la página de perfil.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Lista de items */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 rounded-lg bg-gray-50">
                {getStatusIcon(results.addresses)}
                <div>
                  <p className="font-medium">Direcciones</p>
                  <p className="text-sm text-gray-500">2 direcciones (Casa y Trabajo)</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-lg bg-gray-50">
                {getStatusIcon(results.contacts)}
                <div>
                  <p className="font-medium">Contactos de Emergencia</p>
                  <p className="text-sm text-gray-500">2 contactos (Madre y Hermano)</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-lg bg-gray-50">
                {getStatusIcon(results.medical)}
                <div>
                  <p className="font-medium">Información Médica</p>
                  <p className="text-sm text-gray-500">Tipo de sangre, alergias, medicamentos y condiciones</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-lg bg-gray-50">
                {getStatusIcon(results.insurance)}
                <div>
                  <p className="font-medium">Seguro de Salud</p>
                  <p className="text-sm text-gray-500">1 póliza de seguro</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-lg bg-gray-50">
                {getStatusIcon(results.banking)}
                <div>
                  <p className="font-medium">Cuentas Bancarias</p>
                  <p className="text-sm text-gray-500">2 cuentas (Corriente y Ahorro)</p>
                </div>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex gap-3">
              <Button
                onClick={agregarTodosMisDatos}
                disabled={loading || allSuccess}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {allSuccess ? '¡Datos Agregados!' : loading ? 'Agregando...' : 'Agregar Datos de Ejemplo'}
              </Button>
              
              {allSuccess && (
                <Button
                  onClick={() => window.location.href = '/profile'}
                  variant="outline"
                  className="flex-1"
                >
                  Ver en Mi Perfil →
                </Button>
              )}
            </div>

            {/* Mensaje de éxito */}
            {allSuccess && (
              <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded">
                <p className="font-medium">✅ ¡Todos los datos fueron agregados exitosamente!</p>
                <p className="text-sm mt-1">
                  Puedes verlos y editarlos en tu página de perfil. Los datos agregados son de ejemplo, 
                  puedes modificarlos según necesites.
                </p>
              </div>
            )}

            {/* Nota informativa */}
            <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded text-sm">
              <p className="font-medium mb-1">ℹ️ Nota:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Los datos agregados son de ejemplo</li>
                <li>Puedes editarlos o eliminarlos después</li>
                <li>Los números de cuenta bancaria son ficticios</li>
                <li>Revisa la consola del navegador para ver el progreso</li>
              </ul>
            </div>

            {/* Datos que se agregarán */}
            <details className="border rounded-lg p-4">
              <summary className="cursor-pointer font-medium">
                Ver datos que se agregarán
              </summary>
              <div className="mt-4 space-y-4 text-sm">
                <div>
                  <p className="font-medium text-gray-700">📍 Direcciones:</p>
                  <ul className="list-disc list-inside text-gray-600 ml-4">
                    <li>Casa: Av. Libertador Bernardo O'Higgins 1234, Santiago</li>
                    <li>Trabajo: Av. Apoquindo 3000, Santiago</li>
                  </ul>
                </div>
                
                <div>
                  <p className="font-medium text-gray-700">📞 Contactos:</p>
                  <ul className="list-disc list-inside text-gray-600 ml-4">
                    <li>María González (Madre) - +56912345678</li>
                    <li>Pedro Pérez (Hermano) - +56987654321</li>
                  </ul>
                </div>

                <div>
                  <p className="font-medium text-gray-700">❤️ Médico:</p>
                  <ul className="list-disc list-inside text-gray-600 ml-4">
                    <li>Tipo de Sangre: O+</li>
                    <li>Alergias: Penicilina, Maní, Polen</li>
                    <li>Medicamentos: Aspirina, Omeprazol</li>
                    <li>Condiciones: Diabetes Tipo 2, Hipertensión</li>
                  </ul>
                </div>

                <div>
                  <p className="font-medium text-gray-700">🛡️ Seguro:</p>
                  <ul className="list-disc list-inside text-gray-600 ml-4">
                    <li>Isapre Cruz Blanca - POL-123456789</li>
                  </ul>
                </div>

                <div>
                  <p className="font-medium text-gray-700">💳 Cuentas:</p>
                  <ul className="list-disc list-inside text-gray-600 ml-4">
                    <li>Banco de Chile (Corriente) - ****7890</li>
                    <li>Banco Santander (Ahorro) - ****3210</li>
                  </ul>
                </div>
              </div>
            </details>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
