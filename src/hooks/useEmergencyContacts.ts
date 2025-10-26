import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/lib/firebase-client';
import type { 
  EmergencyContactData, 
  CreateEmergencyContactData, 
  UpdateEmergencyContactData 
} from '@/types';

export function useEmergencyContacts() {
  const [contacts, setContacts] = useState<EmergencyContactData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContacts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await apiClient.getEmergencyContacts();
      setContacts(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar los contactos de emergencia');
      console.error('Error fetching emergency contacts:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const createContact = async (contactData: CreateEmergencyContactData) => {
    try {
      const newContact = await apiClient.createEmergencyContact(contactData);
      setContacts((prev) => [...prev, newContact]);
      return newContact;
    } catch (err: any) {
      setError(err.message || 'Error al crear el contacto de emergencia');
      throw err;
    }
  };

  const updateContact = async (id: string, updates: UpdateEmergencyContactData) => {
    try {
      const updatedContact = await apiClient.updateEmergencyContact(id, updates);
      setContacts((prev) =>
        prev.map((contact) => (contact.id === id ? updatedContact : contact))
      );
      return updatedContact;
    } catch (err: any) {
      setError(err.message || 'Error al actualizar el contacto de emergencia');
      throw err;
    }
  };

  const deleteContact = async (id: string) => {
    try {
      await apiClient.deleteEmergencyContact(id);
      setContacts((prev) => prev.filter((contact) => contact.id !== id));
    } catch (err: any) {
      setError(err.message || 'Error al eliminar el contacto de emergencia');
      throw err;
    }
  };

  return {
    contacts,
    isLoading,
    error,
    fetchContacts,
    createContact,
    updateContact,
    deleteContact,
  };
}
