'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { apiClient } from '@/lib/firebase-client';
import type { 
  Address, 
  EmergencyContactData, 
  EmergencyEvent,
  BankAccount,
  HealthInsurance,
  MedicalInfoData,
  User as UserType
} from '@/types';
import { Button } from '@/components/ui/button';
import { CollapsibleSection, DataCard, InfoItem, EmptySection } from '@/components/dashboard/DashboardComponents';
import { EditablePhoneItem } from '@/components/dashboard/EditablePhoneItem';
import { MapPin, Phone, Heart, CreditCard, Shield, User, AlertCircle } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserType | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContactData[]>([]);
  const [emergencyEvents, setEmergencyEvents] = useState<EmergencyEvent[]>([]);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [healthInsurances, setHealthInsurances] = useState<HealthInsurance[]>([]);
  const [medicalInfo, setMedicalInfo] = useState<MedicalInfoData | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        router.push('/login');
        return;
      }

      await loadAllData();
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const loadAllData = async () => {
    try {
      const [
        userProfile,
        addressesData,
        contactsData,
        eventsData,
        accountsData,
        insurancesData,
        medicalData
      ] = await Promise.all([
        apiClient.getProfile().catch(() => null),
        apiClient.getAddresses().catch(() => []),
        apiClient.getEmergencyContacts().catch(() => []),
        apiClient.getEmergencyRequests().catch(() => []),
        apiClient.getBankAccounts().catch(() => []),
        apiClient.getHealthInsurances().catch(() => []),
        apiClient.getMedicalInfo().catch(() => null)
      ]);

      setUser(userProfile);
      setAddresses(addressesData);
      setEmergencyContacts(contactsData);
      setEmergencyEvents(eventsData);
      setBankAccounts(accountsData);
      setHealthInsurances(insurancesData);
      setMedicalInfo(medicalData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const hasCompletedOnboarding = () => {
    return addresses.length > 0 || emergencyContacts.length > 0;
  };

  const maskAccountNumber = (number: string) => {
    if (!number || number.length < 4) return number;
    return `****${number.slice(-4)}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando tu información...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Bienvenido, {user?.fullName || 'Usuario'} 👋
          </h1>
          <p className="text-gray-600">
            Gestiona tu información personal y de emergencia
          </p>
        </div>

        {/* Onboarding Prompt */}
        {!hasCompletedOnboarding() && (
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <h3 className="text-sm font-medium text-blue-800">
                  Completa tu perfil
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>
                    Parece que aún no has completado tu información. Te recomendamos completar el proceso de onboarding para aprovechar todas las funciones.
                  </p>
                </div>
                <div className="mt-4">
                  <Button
                    onClick={() => router.push('/onboarding')}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Completar Onboarding
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Dashboard Grid */}
        <div className="space-y-6">
          {/* Personal Information */}
          <CollapsibleSection 
            title="Información Personal" 
            icon={<User className="w-5 h-5 text-blue-600" />}
            defaultExpanded={true}
          >
            {user ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoItem label="Nombre" value={user.fullName} />
                <InfoItem label="Email" value={user.email} />
                <EditablePhoneItem user={user} onUpdated={loadAllData} />
                <InfoItem label="RUT" value={user.rut || 'No especificado'} />
              </div>
            ) : (
              <EmptySection
                message="No se pudo cargar la información personal"
                onAdd={loadAllData}
              />
            )}
          </CollapsibleSection>

          {/* Addresses */}
          <CollapsibleSection 
            title="Direcciones" 
            icon={<MapPin className="w-5 h-5 text-blue-600" />}
            badge={`${addresses.length} ${addresses.length === 1 ? 'dirección' : 'direcciones'}`}
          >
            {addresses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.map((address) => (
                  <DataCard
                    key={address.id}
                    title={address.label || 'Dirección'}
                    isPrimary={address.isPrimary}
                    onEdit={() => router.push(`/onboarding?step=2&edit=${address.id}`)}
                    onDelete={async () => {
                      if (confirm('¿Eliminar esta dirección?')) {
                        await apiClient.deleteAddress(address.id);
                        await loadAllData();
                      }
                    }}
                  >
                    <InfoItem label="Calle" value={address.street} />
                    <InfoItem label="Ciudad" value={address.city} />
                    <InfoItem label="Estado/Región" value={address.state} />
                    <InfoItem label="País" value={address.country} />
                    <InfoItem label="Código Postal" value={address.postalCode} />
                    {address.additionalInfo && (
                      <InfoItem label="Info Adicional" value={address.additionalInfo} />
                    )}
                  </DataCard>
                ))}
              </div>
            ) : (
              <EmptySection
                message="No hay direcciones registradas"
                onAdd={() => router.push('/onboarding?step=2')}
              />
            )}
          </CollapsibleSection>

          {/* Emergency Contacts */}
          <CollapsibleSection 
            title="Contactos de Emergencia" 
            icon={<Phone className="w-5 h-5 text-blue-600" />}
            badge={`${emergencyContacts.length} ${emergencyContacts.length === 1 ? 'contacto' : 'contactos'}`}
          >
            {emergencyContacts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {emergencyContacts.map((contact) => (
                  <DataCard
                    key={contact.id}
                      title={contact.name}
                    onEdit={() => router.push(`/onboarding?step=3&edit=${contact.id}`)}
                    onDelete={async () => {
                      if (confirm('¿Eliminar este contacto?')) {
                        await apiClient.deleteEmergencyContact(contact.id);
                        await loadAllData();
                      }
                    }}
                  >
                    <InfoItem label="Teléfono" value={contact.phone} />
                    <InfoItem label="Relación" value={contact.relationship} />
                    {contact.email && <InfoItem label="Email" value={contact.email} />}
                      {/* No address field in emergency contact model */}
                  </DataCard>
                ))}
              </div>
            ) : (
              <EmptySection
                message="No hay contactos de emergencia registrados"
                onAdd={() => router.push('/onboarding?step=3')}
              />
            )}
          </CollapsibleSection>

          {/* Emergency Events */}
          <CollapsibleSection 
            title="Eventos de Emergencia" 
            icon={<AlertCircle className="w-5 h-5 text-blue-600" />}
            badge={`${emergencyEvents.length} ${emergencyEvents.length === 1 ? 'evento' : 'eventos'}`}
          >
            {emergencyEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {emergencyEvents.map((event) => (
                  <DataCard
                    key={event.id}
                    title={event.type}
                    subtitle={`Estado: ${event.status}`}
                  >
                    <InfoItem 
                      label="Prioridad" 
                      value={event.priority} 
                    />
                    <InfoItem 
                      label="Estado" 
                      value={event.status} 
                    />
                    <InfoItem label="Descripción" value={event.description} />
                    {event.location?.address && (
                      <InfoItem label="Ubicación" value={event.location.address} />
                    )}
                    <InfoItem 
                      label="Fecha" 
                      value={new Date(event.createdAt).toLocaleString()} 
                    />
                    {event.resolvedAt && (
                      <InfoItem 
                        label="Resuelto" 
                        value={new Date(event.resolvedAt).toLocaleString()} 
                      />
                    )}
                  </DataCard>
                ))}
              </div>
            ) : (
              <EmptySection
                message="No hay eventos de emergencia registrados"
                onAdd={() => router.push('/emergency-request')}
              />
            )}
          </CollapsibleSection>

          {/* Medical Information */}
          <CollapsibleSection 
            title="Información Médica"
            icon={<Heart className="w-5 h-5 text-blue-600" />}
          >
            {medicalInfo ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoItem label="Tipo de Sangre" value={medicalInfo.bloodType || 'No especificado'} />
                <InfoItem 
                  label="Alergias" 
                  value={medicalInfo.allergies?.join(', ') || 'Ninguna'} 
                />
                <InfoItem 
                  label="Medicamentos" 
                  value={medicalInfo.medications?.join(', ') || 'Ninguno'} 
                />
                <InfoItem 
                  label="Condiciones" 
                  value={medicalInfo.conditions?.join(', ') || 'Ninguna'} 
                />
                {medicalInfo.notes && (
                  <div className="md:col-span-2">
                    <InfoItem label="Notas" value={medicalInfo.notes} />
                  </div>
                )}
                <div className="md:col-span-2 flex justify-end">
                  <Button
                    variant="outline"
                    onClick={() => router.push('/onboarding?step=4')}
                  >
                    Editar
                  </Button>
                </div>
              </div>
            ) : (
              <EmptySection
                message="No hay información médica registrada"
                onAdd={() => router.push('/onboarding?step=4')}
              />
            )}
          </CollapsibleSection>

          {/* Health Insurance */}
          <CollapsibleSection 
            title="Seguros de Salud" 
            icon={<Shield className="w-5 h-5 text-blue-600" />}
            badge={`${healthInsurances.length} ${healthInsurances.length === 1 ? 'seguro' : 'seguros'}`}
          >
            {healthInsurances.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {healthInsurances.map((insurance) => (
                    <DataCard
                      key={insurance.id}
                      title={insurance.provider_name}
                      isPrimary={insurance.primary_provider}
                      onEdit={() => router.push(`/onboarding?step=5&edit=${insurance.id}`)}
                      onDelete={async () => {
                        if (confirm('¿Eliminar este seguro?')) {
                          await apiClient.deleteHealthInsurance(insurance.id);
                          await loadAllData();
                        }
                      }}
                    >
                      <InfoItem label="Plan" value={insurance.plan_name} />
                      <InfoItem label="ID de Miembro" value={insurance.member_id} />
                      <InfoItem label="Cobertura" value={insurance.coverage_info} />
                    </DataCard>
                ))}
              </div>
            ) : (
              <EmptySection
                message="No hay seguros de salud registrados"
                onAdd={() => router.push('/onboarding?step=5')}
              />
            )}
          </CollapsibleSection>

          {/* Bank Accounts */}
          <CollapsibleSection 
            title="Cuentas Bancarias" 
            icon={<CreditCard className="w-5 h-5 text-blue-600" />}
            badge={`${bankAccounts.length} ${bankAccounts.length === 1 ? 'cuenta' : 'cuentas'}`}
          >
            {bankAccounts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {bankAccounts.map((account) => (
                  <DataCard
                    key={account.id}
                    title={account.bankName}
                    isPrimary={account.isPrimary}
                    onEdit={() => router.push(`/onboarding?step=6&edit=${account.id}`)}
                    onDelete={async () => {
                      if (confirm('¿Eliminar esta cuenta?')) {
                        await apiClient.deleteBankAccount(account.id);
                        await loadAllData();
                      }
                    }}
                  >
                    <InfoItem label="Titular" value={account.accountHolderName} />
                    <InfoItem label="Número de Cuenta" value={maskAccountNumber(account.accountNumber)} />
                    <InfoItem label="Tipo de Cuenta" value={account.accountType} />
                    {account.routingNumber && (
                      <InfoItem label="Routing Number" value={account.routingNumber} />
                    )}
                    {account.swiftCode && (
                      <InfoItem label="SWIFT Code" value={account.swiftCode} />
                    )}
                  </DataCard>
                ))}
              </div>
            ) : (
              <EmptySection
                message="No hay cuentas bancarias registradas"
                onAdd={() => router.push('/onboarding?step=6')}
              />
            )}
          </CollapsibleSection>
        </div>
      </div>
    </div>
  );
}
