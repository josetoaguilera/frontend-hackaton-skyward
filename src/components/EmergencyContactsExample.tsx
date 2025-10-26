'use client';

import { useState } from 'react';
import { useEmergencyContacts } from '@/hooks/useEmergencyContacts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Phone, Plus, Edit, Trash2, Mail } from 'lucide-react';

export default function EmergencyContactsExample() {
  const { contacts, isLoading, error, createContact, updateContact, deleteContact } = useEmergencyContacts();
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    relationship: '',
    email: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createContact(formData);
      setFormData({
        name: '',
        phone: '',
        relationship: '',
        email: '',
      });
      setIsCreating(false);
    } catch (err) {
      console.error('Error creating contact:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar este contacto?')) {
      try {
        await deleteContact(id);
      } catch (err) {
        console.error('Error deleting contact:', err);
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
          <h2 className="text-2xl font-bold text-gray-900">Contactos de Emergencia</h2>
          <p className="text-sm text-gray-500">Personas a contactar en caso de emergencia</p>
        </div>
        <Button onClick={() => setIsCreating(!isCreating)} className="bg-red-600 hover:bg-red-700">
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Contacto
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
            <CardTitle>Nuevo Contacto de Emergencia</CardTitle>
            <CardDescription>Agrega una persona de confianza para contactar en emergencias</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nombre Completo *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Teléfono *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="relationship">Relación *</Label>
                  <Input
                    id="relationship"
                    value={formData.relationship}
                    onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                    placeholder="Padre, Madre, Hermano/a, Amigo/a, etc."
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Correo Electrónico</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="bg-red-600 hover:bg-red-700">
                  Guardar
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsCreating(false)}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {contacts.map((contact) => (
          <Card key={contact.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-lg">{contact.name}</h3>
                  <Badge variant="outline" className="mt-1">
                    {contact.relationship}
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(contact.id)}
                  className="text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="h-4 w-4" />
                  <a href={`tel:${contact.phone}`} className="hover:text-red-600">
                    {contact.phone}
                  </a>
                </div>
                {contact.email && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="h-4 w-4" />
                    <a href={`mailto:${contact.email}`} className="hover:text-red-600">
                      {contact.email}
                    </a>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {contacts.length === 0 && !isCreating && (
        <Card>
          <CardContent className="py-12 text-center">
            <Phone className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay contactos de emergencia</h3>
            <p className="text-gray-500 mb-4">
              Es importante tener al menos un contacto de emergencia registrado
            </p>
            <Button onClick={() => setIsCreating(true)} className="bg-red-600 hover:bg-red-700">
              <Plus className="mr-2 h-4 w-4" />
              Agregar Contacto
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
