import { useState } from 'react';
import { apiClient } from '@/lib/firebase-client';
import { InfoItem } from './DashboardComponents';
import { Button } from '@/components/ui/button';

import type { User } from '@/types';

interface EditablePhoneItemProps {
  user: User;
  onUpdated: () => void;
}

export function EditablePhoneItem({ user, onUpdated }: EditablePhoneItemProps) {
  const [editing, setEditing] = useState(false);
  const [phone, setPhone] = useState(user.phone || user.phoneNumber || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    setLoading(true);
    setError('');
    try {
      await apiClient.updateProfile({ phone });
      setEditing(false);
      onUpdated();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || 'Error al actualizar el teléfono');
      } else {
        setError('Error al actualizar el teléfono');
      }
    }
    setLoading(false);
  };

  if (!editing) {
    return (
      <div className="flex items-center justify-between w-full gap-2">
        <InfoItem label="Teléfono" value={phone || 'No especificado'} />
        <Button size="sm" variant="outline" onClick={() => setEditing(true)}>
          Editar
        </Button>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-2">
      <div className="flex flex-col">
        <label className="text-sm text-gray-600 mb-1">Teléfono</label>
        <input
          type="text"
          className="border rounded px-2 py-1 w-40"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          disabled={loading}
        />
      </div>
      <Button size="sm" onClick={handleSave} disabled={loading}>
        Guardar
      </Button>
      <Button size="sm" variant="outline" onClick={() => setEditing(false)} disabled={loading}>
        Cancelar
      </Button>
      {error && <span className="text-red-500 text-xs ml-2">{error}</span>}
    </div>
  );
}