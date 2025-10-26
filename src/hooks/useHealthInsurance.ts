import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/lib/firebase-client';
import type { HealthInsurance, CreateHealthInsuranceData, UpdateHealthInsuranceData } from '@/types';

export function useHealthInsurance() {
  const [insurances, setInsurances] = useState<HealthInsurance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInsurances = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await apiClient.getHealthInsurances();
      setInsurances(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar los seguros de salud');
      console.error('Error fetching health insurances:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInsurances();
  }, [fetchInsurances]);

  const createInsurance = async (insuranceData: CreateHealthInsuranceData) => {
    try {
      const newInsurance = await apiClient.createHealthInsurance(insuranceData);
      setInsurances((prev) => [...prev, newInsurance]);
      return newInsurance;
    } catch (err: any) {
      setError(err.message || 'Error al crear el seguro de salud');
      throw err;
    }
  };

  const updateInsurance = async (id: string, updates: UpdateHealthInsuranceData) => {
    try {
      const updatedInsurance = await apiClient.updateHealthInsurance(id, updates);
      setInsurances((prev) =>
        prev.map((insurance) => (insurance.id === id ? updatedInsurance : insurance))
      );
      return updatedInsurance;
    } catch (err: any) {
      setError(err.message || 'Error al actualizar el seguro de salud');
      throw err;
    }
  };

  const deleteInsurance = async (id: string) => {
    try {
      await apiClient.deleteHealthInsurance(id);
      setInsurances((prev) => prev.filter((insurance) => insurance.id !== id));
    } catch (err: any) {
      setError(err.message || 'Error al eliminar el seguro de salud');
      throw err;
    }
  };

  return {
    insurances,
    isLoading,
    error,
    fetchInsurances,
    createInsurance,
    updateInsurance,
    deleteInsurance,
  };
}
