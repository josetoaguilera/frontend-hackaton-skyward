import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/lib/firebase-client';
import type { BankAccount, CreateBankAccountData, UpdateBankAccountData } from '@/types';

export function useBankAccounts() {
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAccounts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await apiClient.getBankAccounts();
      setAccounts(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar las cuentas bancarias');
      console.error('Error fetching bank accounts:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  const createAccount = async (accountData: CreateBankAccountData) => {
    try {
      const newAccount = await apiClient.createBankAccount(accountData);
      setAccounts((prev) => [...prev, newAccount]);
      return newAccount;
    } catch (err: any) {
      setError(err.message || 'Error al crear la cuenta bancaria');
      throw err;
    }
  };

  const updateAccount = async (id: string, updates: UpdateBankAccountData) => {
    try {
      const updatedAccount = await apiClient.updateBankAccount(id, updates);
      setAccounts((prev) =>
        prev.map((account) => (account.id === id ? updatedAccount : account))
      );
      return updatedAccount;
    } catch (err: any) {
      setError(err.message || 'Error al actualizar la cuenta bancaria');
      throw err;
    }
  };

  const deleteAccount = async (id: string) => {
    try {
      await apiClient.deleteBankAccount(id);
      setAccounts((prev) => prev.filter((account) => account.id !== id));
    } catch (err: any) {
      setError(err.message || 'Error al eliminar la cuenta bancaria');
      throw err;
    }
  };

  return {
    accounts,
    isLoading,
    error,
    fetchAccounts,
    createAccount,
    updateAccount,
    deleteAccount,
  };
}
