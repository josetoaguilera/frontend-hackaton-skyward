'use client';

import { useState, useEffect } from 'react';
import { useMedicalInfo } from '@/hooks/useMedicalInfo';
import { useHealthInsurance } from '@/hooks/useHealthInsurance';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Heart, Plus, Trash2, Edit, Shield, Calendar } from 'lucide-react';

export default function MedicalInfoExample() {
  const { medicalInfo, isLoading: medicalLoading, error: medicalError, upsertMedicalInfo } = useMedicalInfo();
  const { insurances, isLoading: insuranceLoading, error: insuranceError, createInsurance, deleteInsurance } = useHealthInsurance();
  
  const [isEditingMedical, setIsEditingMedical] = useState(false);
  const [isCreatingInsurance, setIsCreatingInsurance] = useState(false);
  
  const [medicalForm, setMedicalForm] = useState({
    bloodType: '',
    allergies: [] as string[],
    medications: [] as string[],
    conditions: [] as string[],
    notes: '',
  });

  const [insuranceForm, setInsuranceForm] = useState({
    provider: '',
    policyNumber: '',
    groupNumber: '',
    coverageType: '',
    startDate: '',
    endDate: '',
    isPrimary: false,
  });

  const [allergyInput, setAllergyInput] = useState('');
  const [medicationInput, setMedicationInput] = useState('');
  const [conditionInput, setConditionInput] = useState('');

  useEffect(() => {
    if (medicalInfo) {
      setMedicalForm({
        bloodType: medicalInfo.bloodType || '',
        allergies: medicalInfo.allergies || [],
        medications: medicalInfo.medications || [],
        conditions: medicalInfo.conditions || [],
        notes: medicalInfo.notes || '',
      });
    }
  }, [medicalInfo]);

  const handleMedicalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await upsertMedicalInfo(medicalForm);
      setIsEditingMedical(false);
    } catch (err) {
      console.error('Error saving medical info:', err);
    }
  };

  const handleInsuranceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createInsurance(insuranceForm);
      setInsuranceForm({
        provider: '',
        policyNumber: '',
        groupNumber: '',
        coverageType: '',
        startDate: '',
        endDate: '',
        isPrimary: false,
      });
      setIsCreatingInsurance(false);
    } catch (err) {
      console.error('Error creating insurance:', err);
    }
  };

  const addItem = (type: 'allergies' | 'medications' | 'conditions', value: string) => {
    if (!value.trim()) return;
    setMedicalForm(prev => ({
      ...prev,
      [type]: [...prev[type], value.trim()]
    }));
    if (type === 'allergies') setAllergyInput('');
    if (type === 'medications') setMedicationInput('');
    if (type === 'conditions') setConditionInput('');
  };

  const removeItem = (type: 'allergies' | 'medications' | 'conditions', index: number) => {
    setMedicalForm(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }));
  };

  const handleDeleteInsurance = async (id: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar este seguro?')) {
      try {
        await deleteInsurance(id);
      } catch (err) {
        console.error('Error deleting insurance:', err);
      }
    }
  };

  if (medicalLoading || insuranceLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Medical Information Card */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-600" />
                Información Médica
              </CardTitle>
              <CardDescription>Tu historial médico y condiciones de salud</CardDescription>
            </div>
            <Button
              onClick={() => setIsEditingMedical(!isEditingMedical)}
              variant={isEditingMedical ? 'outline' : 'default'}
            >
              {isEditingMedical ? 'Cancelar' : <><Edit className="mr-2 h-4 w-4" />Editar</>}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {medicalError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {medicalError}
            </div>
          )}

          {isEditingMedical ? (
            <form onSubmit={handleMedicalSubmit} className="space-y-4">
              <div>
                <Label htmlFor="bloodType">Tipo de Sangre</Label>
                <Input
                  id="bloodType"
                  value={medicalForm.bloodType}
                  onChange={(e) => setMedicalForm({ ...medicalForm, bloodType: e.target.value })}
                  placeholder="Ej: O+, A-, B+, AB-"
                />
              </div>

              <div>
                <Label>Alergias</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={allergyInput}
                    onChange={(e) => setAllergyInput(e.target.value)}
                    placeholder="Agregar alergia"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('allergies', allergyInput))}
                  />
                  <Button type="button" onClick={() => addItem('allergies', allergyInput)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {medicalForm.allergies.map((allergy, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {allergy}
                      <button type="button" onClick={() => removeItem('allergies', index)}>×</button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label>Medicamentos</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={medicationInput}
                    onChange={(e) => setMedicationInput(e.target.value)}
                    placeholder="Agregar medicamento"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('medications', medicationInput))}
                  />
                  <Button type="button" onClick={() => addItem('medications', medicationInput)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {medicalForm.medications.map((medication, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {medication}
                      <button type="button" onClick={() => removeItem('medications', index)}>×</button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label>Condiciones Médicas</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={conditionInput}
                    onChange={(e) => setConditionInput(e.target.value)}
                    placeholder="Agregar condición"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('conditions', conditionInput))}
                  />
                  <Button type="button" onClick={() => addItem('conditions', conditionInput)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {medicalForm.conditions.map((condition, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {condition}
                      <button type="button" onClick={() => removeItem('conditions', index)}>×</button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Notas Adicionales</Label>
                <Textarea
                  id="notes"
                  value={medicalForm.notes}
                  onChange={(e) => setMedicalForm({ ...medicalForm, notes: e.target.value })}
                  placeholder="Información adicional relevante..."
                  rows={3}
                />
              </div>

              <Button type="submit">Guardar Información</Button>
            </form>
          ) : medicalInfo ? (
            <div className="space-y-4">
              {medicalInfo.bloodType && (
                <div>
                  <span className="font-medium text-gray-700">Tipo de Sangre:</span>
                  <Badge variant="outline" className="ml-2">{medicalInfo.bloodType}</Badge>
                </div>
              )}
              {medicalInfo.allergies && medicalInfo.allergies.length > 0 && (
                <div>
                  <span className="font-medium text-gray-700">Alergias:</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {medicalInfo.allergies.map((allergy, index) => (
                      <Badge key={index} variant="destructive">{allergy}</Badge>
                    ))}
                  </div>
                </div>
              )}
              {medicalInfo.medications && medicalInfo.medications.length > 0 && (
                <div>
                  <span className="font-medium text-gray-700">Medicamentos:</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {medicalInfo.medications.map((med, index) => (
                      <Badge key={index} variant="secondary">{med}</Badge>
                    ))}
                  </div>
                </div>
              )}
              {medicalInfo.conditions && medicalInfo.conditions.length > 0 && (
                <div>
                  <span className="font-medium text-gray-700">Condiciones:</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {medicalInfo.conditions.map((condition, index) => (
                      <Badge key={index}>{condition}</Badge>
                    ))}
                  </div>
                </div>
              )}
              {medicalInfo.notes && (
                <div>
                  <span className="font-medium text-gray-700">Notas:</span>
                  <p className="text-gray-600 mt-1">{medicalInfo.notes}</p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">
              No hay información médica registrada. Haz clic en Editar para agregar.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Health Insurance Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              Seguros de Salud
            </h3>
            <p className="text-sm text-gray-500">Tus pólizas de seguro médico</p>
          </div>
          <Button onClick={() => setIsCreatingInsurance(!isCreatingInsurance)}>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Seguro
          </Button>
        </div>

        {insuranceError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {insuranceError}
          </div>
        )}

        {isCreatingInsurance && (
          <Card>
            <CardHeader>
              <CardTitle>Nuevo Seguro de Salud</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleInsuranceSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="provider">Proveedor *</Label>
                    <Input
                      id="provider"
                      value={insuranceForm.provider}
                      onChange={(e) => setInsuranceForm({ ...insuranceForm, provider: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="policyNumber">Número de Póliza *</Label>
                    <Input
                      id="policyNumber"
                      value={insuranceForm.policyNumber}
                      onChange={(e) => setInsuranceForm({ ...insuranceForm, policyNumber: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="groupNumber">Número de Grupo</Label>
                    <Input
                      id="groupNumber"
                      value={insuranceForm.groupNumber}
                      onChange={(e) => setInsuranceForm({ ...insuranceForm, groupNumber: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="coverageType">Tipo de Cobertura *</Label>
                    <Input
                      id="coverageType"
                      value={insuranceForm.coverageType}
                      onChange={(e) => setInsuranceForm({ ...insuranceForm, coverageType: e.target.value })}
                      placeholder="Ej: Completa, Básica, etc."
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="startDate">Fecha de Inicio *</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={insuranceForm.startDate}
                      onChange={(e) => setInsuranceForm({ ...insuranceForm, startDate: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="endDate">Fecha de Fin</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={insuranceForm.endDate}
                      onChange={(e) => setInsuranceForm({ ...insuranceForm, endDate: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isPrimaryInsurance"
                    checked={insuranceForm.isPrimary}
                    onChange={(e) => setInsuranceForm({ ...insuranceForm, isPrimary: e.target.checked })}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="isPrimaryInsurance" className="cursor-pointer">
                    Establecer como seguro principal
                  </Label>
                </div>
                <div className="flex gap-2">
                  <Button type="submit">Guardar</Button>
                  <Button type="button" variant="outline" onClick={() => setIsCreatingInsurance(false)}>
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insurances.map((insurance) => (
            <Card key={insurance.id} className={insurance.isPrimary ? 'border-blue-500' : ''}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-semibold text-lg">{insurance.provider}</h4>
                    <p className="text-sm text-gray-500">{insurance.coverageType}</p>
                  </div>
                  <div className="flex gap-2">
                    {insurance.isPrimary && (
                      <Badge className="bg-blue-600">Principal</Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteInsurance(insurance.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Póliza:</span>
                    <span className="font-mono">{insurance.policyNumber}</span>
                  </div>
                  {insurance.groupNumber && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Grupo:</span>
                      <span className="font-mono">{insurance.groupNumber}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(insurance.startDate).toLocaleDateString('es-ES')}</span>
                    {insurance.endDate && (
                      <>
                        <span>→</span>
                        <span>{new Date(insurance.endDate).toLocaleDateString('es-ES')}</span>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {insurances.length === 0 && !isCreatingInsurance && (
          <Card>
            <CardContent className="py-12 text-center">
              <Shield className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay seguros registrados</h3>
              <p className="text-gray-500 mb-4">
                Agrega tu seguro de salud para facilitar la atención médica
              </p>
              <Button onClick={() => setIsCreatingInsurance(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Agregar Seguro
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
