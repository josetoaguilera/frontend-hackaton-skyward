'use client';

import { useState } from 'react';
import { useAddresses } from '@/hooks/useAddresses';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Home, Plus, Edit, Trash2, Star } from 'lucide-react';

export default function AddressesExample() {
  const { addresses, isLoading, error, createAddress, updateAddress, deleteAddress, setPrimaryAddress } = useAddresses();
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    street: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
    label: '',
    additionalInfo: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createAddress(formData);
      setFormData({
        street: '',
        city: '',
        state: '',
        country: '',
        postalCode: '',
        label: '',
        additionalInfo: '',
      });
      setIsCreating(false);
    } catch (err) {
      console.error('Error creating address:', err);
    }
  };

  const handleSetPrimary = async (id: string) => {
    try {
      await setPrimaryAddress(id);
    } catch (err) {
      console.error('Error setting primary address:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar esta dirección?')) {
      try {
        await deleteAddress(id);
      } catch (err) {
        console.error('Error deleting address:', err);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Mis Direcciones</h2>
          <p className="text-sm text-gray-500">Gestiona tus direcciones guardadas</p>
        </div>
        <Button onClick={() => setIsCreating(!isCreating)}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Dirección
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>Nueva Dirección</CardTitle>
            <CardDescription>Agrega una nueva dirección a tu perfil</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="street">Calle *</Label>
                  <Input
                    id="street"
                    value={formData.street}
                    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="label">Etiqueta (Casa, Trabajo, etc.)</Label>
                  <Input
                    id="label"
                    value={formData.label}
                    onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="city">Ciudad *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="state">Estado/Provincia *</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="country">País *</Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="postalCode">Código Postal *</Label>
                  <Input
                    id="postalCode"
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="additionalInfo">Información Adicional</Label>
                <Input
                  id="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={(e) => setFormData({ ...formData, additionalInfo: e.target.value })}
                  placeholder="Apartamento, piso, etc."
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit">Guardar</Button>
                <Button type="button" variant="outline" onClick={() => setIsCreating(false)}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses.map((address) => (
          <Card key={address.id} className={address.isPrimary ? 'border-red-500' : ''}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <Home className="h-5 w-5 text-gray-400" />
                  <div>
                    {address.label && (
                      <Badge variant="outline" className="mb-1">
                        {address.label}
                      </Badge>
                    )}
                    {address.isPrimary && (
                      <Badge className="mb-1 ml-2">
                        <Star className="h-3 w-3 mr-1" />
                        Principal
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  {!address.isPrimary && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleSetPrimary(address.id)}
                      title="Establecer como principal"
                    >
                      <Star className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(address.id)}
                    className="text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="text-sm space-y-1">
                <p className="font-medium">{address.street}</p>
                {address.additionalInfo && <p className="text-gray-600">{address.additionalInfo}</p>}
                <p className="text-gray-600">
                  {address.city}, {address.state}
                </p>
                <p className="text-gray-600">
                  {address.country} - {address.postalCode}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {addresses.length === 0 && !isCreating && (
        <Card>
          <CardContent className="py-12 text-center">
            <Home className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay direcciones</h3>
            <p className="text-gray-500 mb-4">Agrega tu primera dirección para comenzar</p>
            <Button onClick={() => setIsCreating(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Agregar Dirección
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
