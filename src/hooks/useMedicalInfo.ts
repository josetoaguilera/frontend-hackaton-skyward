import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/lib/firebase-client';
import type { MedicalInfoData, CreateMedicalInfoData, UpdateMedicalInfoData } from '@/types';

export function useMedicalInfo() {
  const [medicalInfo, setMedicalInfo] = useState<MedicalInfoData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMedicalInfo = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await apiClient.getMedicalInfo();
      setMedicalInfo(data);
    } catch (err: any) {
      // If no medical info exists, that's okay
      if (err.message.includes('404') || err.message.includes('not found')) {
        setMedicalInfo(null);
      } else {
        setError(err.message || 'Error al cargar la información médica');
        console.error('Error fetching medical info:', err);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMedicalInfo();
  }, [fetchMedicalInfo]);

  const createMedicalInfo = async (data: CreateMedicalInfoData) => {
    try {
      const newInfo = await apiClient.createMedicalInfo(data);
      setMedicalInfo(newInfo);
      return newInfo;
    } catch (err: any) {
      setError(err.message || 'Error al crear la información médica');
      throw err;
    }
  };

  const updateMedicalInfo = async (updates: UpdateMedicalInfoData) => {
    try {
      const updatedInfo = await apiClient.updateMedicalInfo(updates);
      setMedicalInfo(updatedInfo);
      return updatedInfo;
    } catch (err: any) {
      setError(err.message || 'Error al actualizar la información médica');
      throw err;
    }
  };

  const upsertMedicalInfo = async (data: CreateMedicalInfoData) => {
    try {
      const info = await apiClient.upsertMedicalInfo(data);
      setMedicalInfo(info);
      return info;
    } catch (err: any) {
      setError(err.message || 'Error al guardar la información médica');
      throw err;
    }
  };

  const deleteMedicalInfo = async () => {
    try {
      await apiClient.deleteMedicalInfo();
      setMedicalInfo(null);
    } catch (err: any) {
      setError(err.message || 'Error al eliminar la información médica');
      throw err;
    }
  };

  return {
    medicalInfo,
    isLoading,
    error,
    fetchMedicalInfo,
    createMedicalInfo,
    updateMedicalInfo,
    upsertMedicalInfo,
    deleteMedicalInfo,
  };
}
