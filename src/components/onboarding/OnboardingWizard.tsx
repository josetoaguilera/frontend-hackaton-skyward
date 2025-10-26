'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { apiClient } from '@/lib/firebase-client';
import { CheckCircle2, Circle, AlertCircle, Loader2, Plus, X } from 'lucide-react';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

export default function OnboardingWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

  // Estados para cada paso
  const [personalInfo, setPersonalInfo] = useState({ firstName: '', lastName: '', phone: '', rut: '' });
  const [addresses, setAddresses] = useState([{ street: '', city: '', state: '', country: 'Chile', postalCode: '', label: 'Casa' }]);
  const [emergencyContacts, setEmergencyContacts] = useState([{ name: '', phone: '', relationship: '', email: '' }]);
  const [medicalInfo, setMedicalInfo] = useState({ bloodType: '', allergies: [''], medications: [''], conditions: [''], notes: '' });
  const [insurance, setInsurance] = useState({ provider: '', policyNumber: '', coverageType: '', startDate: '' });
  const [bankAccount, setBankAccount] = useState({ bankName: '', accountNumber: '', accountType: 'checking', accountHolderName: '' });

  const steps: OnboardingStep[] = [
    { id: 'personal', title: 'Información Personal', description: 'Completa tu información básica', completed: completedSteps.has('personal') },
    { id: 'addresses', title: 'Direcciones', description: 'Agrega al menos una dirección', completed: completedSteps.has('addresses') },
    { id: 'contacts', title: 'Contactos de Emergencia', description: 'Agrega contactos de confianza', completed: completedSteps.has('contacts') },
    { id: 'medical', title: 'Información Médica', description: 'Detalles importantes para emergencias', completed: completedSteps.has('medical') },
    { id: 'insurance', title: 'Seguro de Salud', description: 'Información de tu seguro', completed: completedSteps.has('insurance') },
    { id: 'banking', title: 'Cuenta Bancaria', description: 'Para pagos y reembolsos', completed: completedSteps.has('banking') },
  ];

  // Cargar progreso guardado al iniciar
  useEffect(() => {
    loadSavedProgress();
  }, []);

  const loadSavedProgress = async () => {
    try {
      const completed = new Set<string>();
      
      // Verificar qué pasos ya están completos
      const [userProfile, userAddresses, contacts, medical, insurances, bankAccounts] = await Promise.all([
        apiClient.getProfile().catch(() => null),
        apiClient.getAddresses().catch(() => []),
        apiClient.getEmergencyContacts().catch(() => []),
        apiClient.getMedicalInfo().catch(() => null),
        apiClient.getHealthInsurances().catch(() => []),
        apiClient.getBankAccounts().catch(() => []),
      ]);

      if (userProfile?.firstName && userProfile?.lastName) {
        completed.add('personal');
        setPersonalInfo({
          firstName: userProfile.firstName,
          lastName: userProfile.lastName,
          phone: userProfile.phone || '',
          rut: userProfile.rut || '',
        });
      }
      if (userAddresses.length > 0) completed.add('addresses');
      if (contacts.length > 0) completed.add('contacts');
      if (medical) completed.add('medical');
      if (insurances.length > 0) completed.add('insurance');
      if (bankAccounts.length > 0) completed.add('banking');

      setCompletedSteps(completed);

      // Ir al primer paso no completado
      const firstIncomplete = steps.findIndex(step => !completed.has(step.id));
      if (firstIncomplete !== -1) {
        setCurrentStep(firstIncomplete);
      } else {
        // Todo completo, ir al dashboard
        router.push('/dashboard');
      }
    } catch (err) {
      console.error('Error loading progress:', err);
    }
  };

  const savePersonalInfo = async () => {
    setLoading(true);
    setError('');
    try {
      await apiClient.updateProfile({
        firstName: personalInfo.firstName,
        lastName: personalInfo.lastName,
        phone: personalInfo.phone,
        rut: personalInfo.rut,
      });
      setCompletedSteps(prev => new Set(prev).add('personal'));
      return true;
    } catch (err: any) {
      setError(err.message || 'Error al guardar información personal');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const saveAddresses = async () => {
    setLoading(true);
    setError('');
    try {
      for (const addr of addresses) {
        if (addr.street && addr.city) {
          await apiClient.createAddress({
            street: addr.street,
            city: addr.city,
            state: addr.state,
            country: addr.country,
            postalCode: addr.postalCode,
            label: addr.label,
          });
        }
      }
      setCompletedSteps(prev => new Set(prev).add('addresses'));
      return true;
    } catch (err: any) {
      setError(err.message || 'Error al guardar direcciones');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const saveEmergencyContacts = async () => {
    setLoading(true);
    setError('');
    try {
      for (const contact of emergencyContacts) {
        if (contact.name && contact.phone) {
          await apiClient.createEmergencyContact({
            name: contact.name,
            phone: contact.phone,
            relationship: contact.relationship,
            email: contact.email,
          });
        }
      }
      setCompletedSteps(prev => new Set(prev).add('contacts'));
      return true;
    } catch (err: any) {
      setError(err.message || 'Error al guardar contactos');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const saveMedicalInfo = async () => {
    setLoading(true);
    setError('');
    try {
      await apiClient.upsertMedicalInfo({
        bloodType: medicalInfo.bloodType || undefined,
        allergies: medicalInfo.allergies.filter(a => a.trim()),
        medications: medicalInfo.medications.filter(m => m.trim()),
        conditions: medicalInfo.conditions.filter(c => c.trim()),
        notes: medicalInfo.notes || undefined,
      });
      setCompletedSteps(prev => new Set(prev).add('medical'));
      return true;
    } catch (err: any) {
      setError(err.message || 'Error al guardar información médica');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const saveInsurance = async () => {
    setLoading(true);
    setError('');
    try {
      if (insurance.provider && insurance.policyNumber) {
        await apiClient.createHealthInsurance({
          provider: insurance.provider,
          policyNumber: insurance.policyNumber,
          coverageType: insurance.coverageType,
          startDate: insurance.startDate,
        });
      }
      setCompletedSteps(prev => new Set(prev).add('insurance'));
      return true;
    } catch (err: any) {
      setError(err.message || 'Error al guardar seguro');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const saveBankAccount = async () => {
    setLoading(true);
    setError('');
    try {
      if (bankAccount.bankName && bankAccount.accountNumber) {
        await apiClient.createBankAccount({
          bankName: bankAccount.bankName,
          accountNumber: bankAccount.accountNumber,
          accountType: bankAccount.accountType as 'checking' | 'savings' | 'other',
          accountHolderName: bankAccount.accountHolderName,
        });
      }
      setCompletedSteps(prev => new Set(prev).add('banking'));
      return true;
    } catch (err: any) {
      setError(err.message || 'Error al guardar cuenta bancaria');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    let success = false;

    switch (steps[currentStep].id) {
      case 'personal':
        success = await savePersonalInfo();
        break;
      case 'addresses':
        success = await saveAddresses();
        break;
      case 'contacts':
        success = await saveEmergencyContacts();
        break;
      case 'medical':
        success = await saveMedicalInfo();
        break;
      case 'insurance':
        success = await saveInsurance();
        break;
      case 'banking':
        success = await saveBankAccount();
        break;
    }

    if (success) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        router.push('/dashboard');
      }
    }
  };

  const handleSkip = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      router.push('/dashboard');
    }
  };

  const addArrayItem = (setter: Function, array: any[], item: any) => {
    setter([...array, item]);
  };

  const removeArrayItem = (setter: Function, array: any[], index: number) => {
    setter(array.filter((_, i) => i !== index));
  };

  const updateArrayItem = (setter: Function, array: any[], index: number, field: string, value: any) => {
    const updated = [...array];
    updated[index] = { ...updated[index], [field]: value };
    setter(updated);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step.completed ? 'bg-green-500' : index === currentStep ? 'bg-blue-500' : 'bg-gray-300'
                }`}>
                  {step.completed ? (
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  ) : (
                    <Circle className="w-6 h-6 text-white" />
                  )}
                </div>
                <span className={`mt-2 text-xs text-center ${index === currentStep ? 'font-bold' : ''}`}>
                  {step.title}
                </span>
              </div>
            ))}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Current Step Card */}
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl">{steps[currentStep].title}</CardTitle>
            <CardDescription>{steps[currentStep].description}</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {/* Paso 1: Información Personal */}
            {steps[currentStep].id === 'personal' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">Nombre *</Label>
                    <Input
                      id="firstName"
                      value={personalInfo.firstName}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, firstName: e.target.value })}
                      placeholder="Juan"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Apellido *</Label>
                    <Input
                      id="lastName"
                      value={personalInfo.lastName}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, lastName: e.target.value })}
                      placeholder="Pérez"
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    value={personalInfo.phone}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
                    placeholder="+56912345678"
                  />
                </div>
                <div>
                  <Label htmlFor="rut">RUT</Label>
                  <Input
                    id="rut"
                    value={personalInfo.rut}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, rut: e.target.value })}
                    placeholder="12.345.678-9"
                  />
                </div>
              </div>
            )}

            {/* Paso 2: Direcciones */}
            {steps[currentStep].id === 'addresses' && (
              <div className="space-y-4">
                {addresses.map((addr, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-semibold">Dirección {index + 1}</h4>
                      {addresses.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeArrayItem(setAddresses, addresses, index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    <div className="space-y-3">
                      <div>
                        <Label>Etiqueta</Label>
                        <Input
                          value={addr.label}
                          onChange={(e) => updateArrayItem(setAddresses, addresses, index, 'label', e.target.value)}
                          placeholder="Casa, Trabajo, etc."
                        />
                      </div>
                      <div>
                        <Label>Calle *</Label>
                        <Input
                          value={addr.street}
                          onChange={(e) => updateArrayItem(setAddresses, addresses, index, 'street', e.target.value)}
                          placeholder="Av. Providencia 1234"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label>Ciudad *</Label>
                          <Input
                            value={addr.city}
                            onChange={(e) => updateArrayItem(setAddresses, addresses, index, 'city', e.target.value)}
                            placeholder="Santiago"
                            required
                          />
                        </div>
                        <div>
                          <Label>Región *</Label>
                          <Input
                            value={addr.state}
                            onChange={(e) => updateArrayItem(setAddresses, addresses, index, 'state', e.target.value)}
                            placeholder="Metropolitana"
                            required
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label>País</Label>
                          <Input
                            value={addr.country}
                            onChange={(e) => updateArrayItem(setAddresses, addresses, index, 'country', e.target.value)}
                            placeholder="Chile"
                          />
                        </div>
                        <div>
                          <Label>Código Postal</Label>
                          <Input
                            value={addr.postalCode}
                            onChange={(e) => updateArrayItem(setAddresses, addresses, index, 'postalCode', e.target.value)}
                            placeholder="7500000"
                          />
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
                <Button
                  variant="outline"
                  onClick={() => addArrayItem(setAddresses, addresses, { street: '', city: '', state: '', country: 'Chile', postalCode: '', label: '' })}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" /> Agregar otra dirección
                </Button>
              </div>
            )}

            {/* Paso 3: Contactos de Emergencia */}
            {steps[currentStep].id === 'contacts' && (
              <div className="space-y-4">
                {emergencyContacts.map((contact, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-semibold">Contacto {index + 1}</h4>
                      {emergencyContacts.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeArrayItem(setEmergencyContacts, emergencyContacts, index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    <div className="space-y-3">
                      <div>
                        <Label>Nombre *</Label>
                        <Input
                          value={contact.name}
                          onChange={(e) => updateArrayItem(setEmergencyContacts, emergencyContacts, index, 'name', e.target.value)}
                          placeholder="María González"
                          required
                        />
                      </div>
                      <div>
                        <Label>Teléfono *</Label>
                        <Input
                          value={contact.phone}
                          onChange={(e) => updateArrayItem(setEmergencyContacts, emergencyContacts, index, 'phone', e.target.value)}
                          placeholder="+56912345678"
                          required
                        />
                      </div>
                      <div>
                        <Label>Relación</Label>
                        <Input
                          value={contact.relationship}
                          onChange={(e) => updateArrayItem(setEmergencyContacts, emergencyContacts, index, 'relationship', e.target.value)}
                          placeholder="Madre, Hermano, Amigo, etc."
                        />
                      </div>
                      <div>
                        <Label>Email</Label>
                        <Input
                          type="email"
                          value={contact.email}
                          onChange={(e) => updateArrayItem(setEmergencyContacts, emergencyContacts, index, 'email', e.target.value)}
                          placeholder="contacto@email.com"
                        />
                      </div>
                    </div>
                  </Card>
                ))}
                <Button
                  variant="outline"
                  onClick={() => addArrayItem(setEmergencyContacts, emergencyContacts, { name: '', phone: '', relationship: '', email: '' })}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" /> Agregar otro contacto
                </Button>
              </div>
            )}

            {/* Paso 4: Información Médica */}
            {steps[currentStep].id === 'medical' && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="bloodType">Tipo de Sangre</Label>
                  <Select value={medicalInfo.bloodType} onValueChange={(val) => setMedicalInfo({ ...medicalInfo, bloodType: val })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona tu tipo de sangre" />
                    </SelectTrigger>
                    <SelectContent>
                      {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Alergias</Label>
                  {medicalInfo.allergies.map((allergy, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <Input
                        value={allergy}
                        onChange={(e) => {
                          const updated = [...medicalInfo.allergies];
                          updated[index] = e.target.value;
                          setMedicalInfo({ ...medicalInfo, allergies: updated });
                        }}
                        placeholder="Penicilina, Polen, etc."
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setMedicalInfo({ ...medicalInfo, allergies: medicalInfo.allergies.filter((_, i) => i !== index) })}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" onClick={() => setMedicalInfo({ ...medicalInfo, allergies: [...medicalInfo.allergies, ''] })}>
                    <Plus className="w-4 h-4 mr-2" /> Agregar alergia
                  </Button>
                </div>

                <div>
                  <Label>Medicamentos</Label>
                  {medicalInfo.medications.map((med, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <Input
                        value={med}
                        onChange={(e) => {
                          const updated = [...medicalInfo.medications];
                          updated[index] = e.target.value;
                          setMedicalInfo({ ...medicalInfo, medications: updated });
                        }}
                        placeholder="Aspirina, Insulina, etc."
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setMedicalInfo({ ...medicalInfo, medications: medicalInfo.medications.filter((_, i) => i !== index) })}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" onClick={() => setMedicalInfo({ ...medicalInfo, medications: [...medicalInfo.medications, ''] })}>
                    <Plus className="w-4 h-4 mr-2" /> Agregar medicamento
                  </Button>
                </div>

                <div>
                  <Label>Condiciones Médicas</Label>
                  {medicalInfo.conditions.map((cond, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <Input
                        value={cond}
                        onChange={(e) => {
                          const updated = [...medicalInfo.conditions];
                          updated[index] = e.target.value;
                          setMedicalInfo({ ...medicalInfo, conditions: updated });
                        }}
                        placeholder="Diabetes, Hipertensión, etc."
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setMedicalInfo({ ...medicalInfo, conditions: medicalInfo.conditions.filter((_, i) => i !== index) })}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" onClick={() => setMedicalInfo({ ...medicalInfo, conditions: [...medicalInfo.conditions, ''] })}>
                    <Plus className="w-4 h-4 mr-2" /> Agregar condición
                  </Button>
                </div>

                <div>
                  <Label htmlFor="notes">Notas Adicionales</Label>
                  <Textarea
                    id="notes"
                    value={medicalInfo.notes}
                    onChange={(e) => setMedicalInfo({ ...medicalInfo, notes: e.target.value })}
                    placeholder="Información adicional importante..."
                    rows={4}
                  />
                </div>
              </div>
            )}

            {/* Paso 5: Seguro de Salud */}
            {steps[currentStep].id === 'insurance' && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="provider">Proveedor del Seguro</Label>
                  <Input
                    id="provider"
                    value={insurance.provider}
                    onChange={(e) => setInsurance({ ...insurance, provider: e.target.value })}
                    placeholder="Isapre Banmédica, Fonasa, etc."
                  />
                </div>
                <div>
                  <Label htmlFor="policyNumber">Número de Póliza</Label>
                  <Input
                    id="policyNumber"
                    value={insurance.policyNumber}
                    onChange={(e) => setInsurance({ ...insurance, policyNumber: e.target.value })}
                    placeholder="123456789"
                  />
                </div>
                <div>
                  <Label htmlFor="coverageType">Tipo de Cobertura</Label>
                  <Input
                    id="coverageType"
                    value={insurance.coverageType}
                    onChange={(e) => setInsurance({ ...insurance, coverageType: e.target.value })}
                    placeholder="Plan familiar, Individual, etc."
                  />
                </div>
                <div>
                  <Label htmlFor="startDate">Fecha de Inicio</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={insurance.startDate}
                    onChange={(e) => setInsurance({ ...insurance, startDate: e.target.value })}
                  />
                </div>
              </div>
            )}

            {/* Paso 6: Cuenta Bancaria */}
            {steps[currentStep].id === 'banking' && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="bankName">Banco</Label>
                  <Input
                    id="bankName"
                    value={bankAccount.bankName}
                    onChange={(e) => setBankAccount({ ...bankAccount, bankName: e.target.value })}
                    placeholder="Banco de Chile, BCI, etc."
                  />
                </div>
                <div>
                  <Label htmlFor="accountHolderName">Titular de la Cuenta</Label>
                  <Input
                    id="accountHolderName"
                    value={bankAccount.accountHolderName}
                    onChange={(e) => setBankAccount({ ...bankAccount, accountHolderName: e.target.value })}
                    placeholder="Tu nombre completo"
                  />
                </div>
                <div>
                  <Label htmlFor="accountNumber">Número de Cuenta</Label>
                  <Input
                    id="accountNumber"
                    value={bankAccount.accountNumber}
                    onChange={(e) => setBankAccount({ ...bankAccount, accountNumber: e.target.value })}
                    placeholder="1234567890"
                  />
                </div>
                <div>
                  <Label htmlFor="accountType">Tipo de Cuenta</Label>
                  <Select value={bankAccount.accountType} onValueChange={(val) => setBankAccount({ ...bankAccount, accountType: val })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="checking">Cuenta Corriente</SelectItem>
                      <SelectItem value="savings">Cuenta de Ahorro</SelectItem>
                      <SelectItem value="other">Otra</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={handleSkip}
              disabled={loading}
            >
              Saltar por ahora
            </Button>
            <Button
              onClick={handleNext}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Guardando...
                </>
              ) : currentStep === steps.length - 1 ? (
                'Finalizar'
              ) : (
                'Siguiente'
              )}
            </Button>
          </CardFooter>
        </Card>

        {/* Skip All */}
        <div className="mt-6 text-center">
          <Button
            variant="link"
            onClick={() => router.push('/dashboard')}
            className="text-gray-600"
          >
            Omitir todo e ir al dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
