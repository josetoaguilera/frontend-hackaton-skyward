import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/lib/firebase-client';
import type { Address, CreateAddressData, UpdateAddressData } from '@/types';

export function useAddresses() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAddresses = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await apiClient.getAddresses();
      setAddresses(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar las direcciones');
      console.error('Error fetching addresses:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const createAddress = async (addressData: CreateAddressData) => {
    try {
      const newAddress = await apiClient.createAddress(addressData);
      setAddresses((prev) => [...prev, newAddress]);
      return newAddress;
    } catch (err: any) {
      setError(err.message || 'Error al crear la dirección');
      throw err;
    }
  };

  const updateAddress = async (id: string, updates: UpdateAddressData) => {
    try {
      const updatedAddress = await apiClient.updateAddress(id, updates);
      setAddresses((prev) =>
        prev.map((addr) => (addr.id === id ? updatedAddress : addr))
      );
      return updatedAddress;
    } catch (err: any) {
      setError(err.message || 'Error al actualizar la dirección');
      throw err;
    }
  };

  const deleteAddress = async (id: string) => {
    try {
      await apiClient.deleteAddress(id);
      setAddresses((prev) => prev.filter((addr) => addr.id !== id));
    } catch (err: any) {
      setError(err.message || 'Error al eliminar la dirección');
      throw err;
    }
  };

  const setPrimaryAddress = async (id: string) => {
    try {
      const updatedAddress = await apiClient.setPrimaryAddress(id);
      setAddresses((prev) =>
        prev.map((addr) => ({
          ...addr,
          isPrimary: addr.id === id,
        }))
      );
      return updatedAddress;
    } catch (err: any) {
      setError(err.message || 'Error al establecer dirección principal');
      throw err;
    }
  };

  return {
    addresses,
    isLoading,
    error,
    fetchAddresses,
    createAddress,
    updateAddress,
    deleteAddress,
    setPrimaryAddress,
  };
}
