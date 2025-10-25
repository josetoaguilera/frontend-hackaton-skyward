'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Phone, 
  MapPin, 
  AlertTriangle, 
  Heart, 
  Plus, 
  X,
  Save,
  User
} from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { EMERGENCY_TYPES, EMERGENCY_LABELS } from '@/lib/api-config';
import type { CreateEmergencyRequestData } from '@/types';

export default function EmergencyRequestPage() {
  const [formData, setFormData] = useState<CreateEmergencyRequestData>({
    type: '',
    priority: 'medium',
    description: '',
    contactInfo: {
      phone: '',
      alternativePhone: ''
    },
    location: {
      latitude: 0,
      longitude: 0,
      address: ''
    },
    medicalInfo: {
      allergies: [],
      medications: [],
      conditions: [],
      emergencyContact: {
        name: '',
        phone: '',
        relationship: ''
      }
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [newAllergy, setNewAllergy] = useState('');
  const [newMedication, setNewMedication] = useState('');
  const [newCondition, setNewCondition] = useState('');

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await apiClient.createEmergencyRequest(formData);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear la solicitud');
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lng: longitude });
          setFormData({
            ...formData,
            location: {
              ...formData.location,
              latitude,
              longitude
            }
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          setError('No se pudo obtener la ubicación actual');
        }
      );
    } else {
      setError('La geolocalización no está disponible en este navegador');
    }
  };

  const addItem = (type: 'allergies' | 'medications' | 'conditions', value: string) => {
    if (value.trim()) {
      setFormData({
        ...formData,
        medicalInfo: {
          ...formData.medicalInfo!,
          [type]: [...(formData.medicalInfo![type] || []), value.trim()]
        }
      });
      
      // Limpiar el input correspondiente
      if (type === 'allergies') setNewAllergy('');
      if (type === 'medications') setNewMedication('');
      if (type === 'conditions') setNewCondition('');
    }
  };

  const removeItem = (type: 'allergies' | 'medications' | 'conditions', index: number) => {
    const items = formData.medicalInfo![type] || [];
    setFormData({
      ...formData,
      medicalInfo: {
        ...formData.medicalInfo!,
        [type]: items.filter((_, i) => i !== index)
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <button
              onClick={() => router.back()}
              className="p-2 text-gray-400 hover:text-gray-600 mr-4"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <h1 className="text-xl font-semibold text-gray-900">
              Nueva Solicitud de Emergencia
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
              <span className="text-red-700">{error}</span>
            </div>
          )}

          {/* Tipo de Emergencia */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Tipo de Emergencia
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(EMERGENCY_LABELS).map(([type, label]) => (
                <label
                  key={type}
                  className={`relative flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                    formData.type === type ? 'border-red-500 bg-red-50' : 'border-gray-200'
                  }`}
                >
                  <input
                    type="radio"
                    name="type"
                    value={type}
                    checked={formData.type === type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="sr-only"
                  />
                  <div className="flex-1 text-center">
                    <div className="text-sm font-medium text-gray-900">{label}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Prioridad */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Nivel de Prioridad
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { value: 'low', label: 'Baja', color: 'border-gray-300 bg-gray-50' },
                { value: 'medium', label: 'Media', color: 'border-yellow-300 bg-yellow-50' },
                { value: 'high', label: 'Alta', color: 'border-orange-300 bg-orange-50' },
                { value: 'critical', label: 'Crítica', color: 'border-red-300 bg-red-50' }
              ].map((priority) => (
                <label
                  key={priority.value}
                  className={`relative flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                    formData.priority === priority.value 
                      ? `border-red-500 bg-red-50` 
                      : priority.color
                  }`}
                >
                  <input
                    type="radio"
                    name="priority"
                    value={priority.value}
                    checked={formData.priority === priority.value}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                    className="sr-only"
                  />
                  <div className="flex-1 text-center">
                    <div className="text-sm font-medium text-gray-900">{priority.label}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Descripción */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Descripción de la Emergencia
            </h2>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="Describe detalladamente la situación de emergencia..."
              required
            />
          </div>

          {/* Información de Contacto */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Phone className="h-5 w-5 mr-2" />
              Información de Contacto
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono Principal *
                </label>
                <input
                  type="tel"
                  value={formData.contactInfo.phone}
                  onChange={(e) => setFormData({
                    ...formData,
                    contactInfo: { ...formData.contactInfo, phone: e.target.value }
                  })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="+1 234 567 890"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono Alternativo
                </label>
                <input
                  type="tel"
                  value={formData.contactInfo.alternativePhone}
                  onChange={(e) => setFormData({
                    ...formData,
                    contactInfo: { ...formData.contactInfo, alternativePhone: e.target.value }
                  })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="+1 234 567 890"
                />
              </div>
            </div>
          </div>

          {/* Ubicación */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              Ubicación
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dirección
                </label>
                <input
                  type="text"
                  value={formData.location?.address}
                  onChange={(e) => setFormData({
                    ...formData,
                    location: { ...formData.location!, address: e.target.value }
                  })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Calle, número, ciudad, código postal..."
                />
              </div>
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  onClick={getCurrentLocation}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:ring-2 focus:ring-red-500"
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Usar Ubicación Actual
                </button>
                {currentLocation && (
                  <span className="text-sm text-green-600">
                    ✓ Ubicación obtenida: {currentLocation.lat.toFixed(6)}, {currentLocation.lng.toFixed(6)}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Información Médica */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Heart className="h-5 w-5 mr-2" />
              Información Médica (Opcional)
            </h2>

            {/* Alergias */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alergias
              </label>
              <div className="flex space-x-2 mb-2">
                <input
                  type="text"
                  value={newAllergy}
                  onChange={(e) => setNewAllergy(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('allergies', newAllergy))}
                  className="flex-1 p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Agregar alergia..."
                />
                <button
                  type="button"
                  onClick={() => addItem('allergies', newAllergy)}
                  className="px-3 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.medicalInfo?.allergies?.map((allergy, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 bg-red-100 text-red-800 text-sm rounded-full"
                  >
                    {allergy}
                    <button
                      type="button"
                      onClick={() => removeItem('allergies', index)}
                      className="ml-1 text-red-600 hover:text-red-800"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Medicamentos */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Medicamentos Actuales
              </label>
              <div className="flex space-x-2 mb-2">
                <input
                  type="text"
                  value={newMedication}
                  onChange={(e) => setNewMedication(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('medications', newMedication))}
                  className="flex-1 p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Agregar medicamento..."
                />
                <button
                  type="button"
                  onClick={() => addItem('medications', newMedication)}
                  className="px-3 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.medicalInfo?.medications?.map((medication, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                  >
                    {medication}
                    <button
                      type="button"
                      onClick={() => removeItem('medications', index)}
                      className="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Condiciones Médicas */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Condiciones Médicas
              </label>
              <div className="flex space-x-2 mb-2">
                <input
                  type="text"
                  value={newCondition}
                  onChange={(e) => setNewCondition(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('conditions', newCondition))}
                  className="flex-1 p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Agregar condición médica..."
                />
                <button
                  type="button"
                  onClick={() => addItem('conditions', newCondition)}
                  className="px-3 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.medicalInfo?.conditions?.map((condition, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full"
                  >
                    {condition}
                    <button
                      type="button"
                      onClick={() => removeItem('conditions', index)}
                      className="ml-1 text-yellow-600 hover:text-yellow-800"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Contacto de Emergencia */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-4">
                <User className="h-4 w-4 mr-2" />
                Contacto de Emergencia
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <input
                    type="text"
                    value={formData.medicalInfo?.emergencyContact?.name}
                    onChange={(e) => setFormData({
                      ...formData,
                      medicalInfo: {
                        ...formData.medicalInfo!,
                        emergencyContact: {
                          ...formData.medicalInfo!.emergencyContact!,
                          name: e.target.value
                        }
                      }
                    })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="Nombre completo"
                  />
                </div>
                <div>
                  <input
                    type="tel"
                    value={formData.medicalInfo?.emergencyContact?.phone}
                    onChange={(e) => setFormData({
                      ...formData,
                      medicalInfo: {
                        ...formData.medicalInfo!,
                        emergencyContact: {
                          ...formData.medicalInfo!.emergencyContact!,
                          phone: e.target.value
                        }
                      }
                    })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="Teléfono"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    value={formData.medicalInfo?.emergencyContact?.relationship}
                    onChange={(e) => setFormData({
                      ...formData,
                      medicalInfo: {
                        ...formData.medicalInfo!,
                        emergencyContact: {
                          ...formData.medicalInfo!.emergencyContact!,
                          relationship: e.target.value
                        }
                      }
                    })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="Relación (ej: Esposo/a)"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 focus:ring-2 focus:ring-red-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading || !formData.type || !formData.description || !formData.contactInfo.phone}
              className="px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? 'Guardando...' : 'Crear Solicitud'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
