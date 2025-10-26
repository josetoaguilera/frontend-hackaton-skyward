'use client';

import { useState } from 'react';
import { useBankAccounts } from '@/hooks/useBankAccounts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Plus, Trash2, Star } from 'lucide-react';

export default function BankAccountsExample() {
  const { accounts, isLoading, error, createAccount, updateAccount, deleteAccount } = useBankAccounts();
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    bank_name: '',
    account_number: '',
    account_type: 'checking' as 'checking' | 'savings' | 'other',
    account_holder_name: '',
    routing_number: '',
    rut: '',
    swift_code: '',
    is_primary: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createAccount(formData);
      setFormData({
        bank_name: '',
        account_number: '',
        account_type: 'checking',
        account_holder_name: '',
        routing_number: '',
        swift_code: '',
        rut: '',
        is_primary: false,
      });
      setIsCreating(false);
    } catch (err) {
      console.error('Error creating bank account:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar esta cuenta bancaria?')) {
      try {
        await deleteAccount(id);
      } catch (err) {
        console.error('Error deleting bank account:', err);
      }
    }
  };

  const maskAccountNumber = (accountNumber: string) => {
    if (accountNumber.length <= 4) return accountNumber;
    return '****' + accountNumber.slice(-4);
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
          <h2 className="text-2xl font-bold text-gray-900">Cuentas Bancarias</h2>
          <p className="text-sm text-gray-500">Gestiona tus métodos de pago</p>
        </div>
        <Button onClick={() => setIsCreating(!isCreating)}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Cuenta
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
            <CardTitle>Nueva Cuenta Bancaria</CardTitle>
            <CardDescription>Agrega una cuenta para pagos de emergencia</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bankName">Banco *</Label>
                  <Input
                    id="bankName"
                    value={formData.bank_name}
                    onChange={(e) => setFormData({ ...formData, bank_name: e.target.value })}
                    placeholder="Ej: Banco de Chile"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="accountHolderName">Titular de la Cuenta *</Label>
                  <Input
                    id="accountHolderName"
                    value={formData.account_holder_name}
                    onChange={(e) => setFormData({ ...formData, account_holder_name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="accountNumber">Número de Cuenta *</Label>
                  <Input
                    id="accountNumber"
                    value={formData.account_number}
                    onChange={(e) => setFormData({ ...formData, account_number: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="accountType">Tipo de Cuenta *</Label>
                  <Select
                    value={formData.account_type}
                    onValueChange={(value: 'checking' | 'savings' | 'other') =>
                      setFormData({ ...formData, account_type: value })
                    }
                  >
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
                <div>
                  <Label htmlFor="routingNumber">Código de Ruta</Label>
                  <Input
                    id="routingNumber"
                    value={formData.routing_number}
                    onChange={(e) => setFormData({ ...formData, routing_number: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="swiftCode">Código SWIFT</Label>
                  <Input
                    id="swiftCode"
                    value={formData.swift_code}
                    onChange={(e) => setFormData({ ...formData, swift_code: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isPrimary"
                  checked={formData.is_primary}
                  onChange={(e) => setFormData({ ...formData, is_primary: e.target.checked })}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="isPrimary" className="cursor-pointer">
                  Establecer como cuenta principal
                </Label>
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
        {accounts.map((account) => (
          <Card key={account.id} className={account.isPrimary ? 'border-red-500 bg-red-50/50' : ''}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-red-100 p-2 rounded-lg">
                    <CreditCard className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{account.bankName}</h3>
                    <p className="text-sm text-gray-500">{account.accountHolderName}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {account.isPrimary && (
                    <Badge className="bg-red-600">
                      <Star className="h-3 w-3 mr-1" />
                      Principal
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(account.id)}
                    className="text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Número:</span>
                  <span className="font-mono">{maskAccountNumber(account.accountNumber)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tipo:</span>
                  <span>
                    {account.accountType === 'checking' && 'Cuenta Corriente'}
                    {account.accountType === 'savings' && 'Cuenta de Ahorro'}
                    {account.accountType === 'other' && 'Otra'}
                  </span>
                </div>
                {account.routingNumber && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Código de Ruta:</span>
                    <span className="font-mono">{account.routingNumber}</span>
                  </div>
                )}
                {account.swiftCode && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">SWIFT:</span>
                    <span className="font-mono">{account.swiftCode}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {accounts.length === 0 && !isCreating && (
        <Card>
          <CardContent className="py-12 text-center">
            <CreditCard className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay cuentas bancarias</h3>
            <p className="text-gray-500 mb-4">
              Agrega una cuenta bancaria para facilitar pagos de emergencia
            </p>
            <Button onClick={() => setIsCreating(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Agregar Cuenta
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
