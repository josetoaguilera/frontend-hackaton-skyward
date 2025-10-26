'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, MapPin, Phone, Heart, CreditCard, Shield, User, Edit, Plus, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface CollapsibleSectionProps {
  title: string;
  icon: React.ReactNode;
  badge?: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}

export function CollapsibleSection({ title, icon, badge, children, defaultExpanded = false }: CollapsibleSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            {icon}
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-lg">{title}</h3>
            {badge && <Badge variant="secondary" className="mt-1">{badge}</Badge>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </div>
      </button>

      {isExpanded && (
        <div className="px-6 pb-6 pt-2 border-t animate-in fade-in slide-in-from-top-2">
          {children}
        </div>
      )}
    </Card>
  );
}

interface InfoItemProps {
  label: string;
  value: React.ReactNode;
  isPrimary?: boolean;
}

export function InfoItem({ label, value, isPrimary }: InfoItemProps) {
  return (
    <div className="flex justify-between items-start w-full py-2 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-600 font-medium">{label}</span>
      <div className="flex items-center gap-2">
        {typeof value === 'string' || typeof value === 'number' ? (
          <span className="text-sm text-gray-900">{value}</span>
        ) : (
          value
        )}
        {isPrimary && <Badge variant="default" className="text-xs">Principal</Badge>}
      </div>
    </div>
  );
}

interface DataCardProps {
  title: string;
  subtitle?: string;
  isPrimary?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  children: React.ReactNode;
}

export function DataCard({ title, subtitle, isPrimary, onEdit, onDelete, children }: DataCardProps) {
  return (
    <Card className="mb-3 hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-base">{title}</CardTitle>
              {isPrimary && <Badge variant="default">Principal</Badge>}
            </div>
            {subtitle && <CardDescription className="mt-1">{subtitle}</CardDescription>}
          </div>
          <div className="flex gap-1">
            {onEdit && (
              <Button variant="ghost" size="sm" onClick={onEdit}>
                <Edit className="w-4 h-4" />
              </Button>
            )}
            {onDelete && (
              <Button variant="ghost" size="sm" onClick={onDelete} className="text-red-500 hover:text-red-700">
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {children}
      </CardContent>
    </Card>
  );
}

interface EmptySectionProps {
  message: string;
  onAdd: () => void;
}

export function EmptySection({ message, onAdd }: EmptySectionProps) {
  return (
    <div className="text-center py-8 px-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
      <p className="text-gray-600 mb-4">{message}</p>
      <Button onClick={onAdd} variant="outline">
        <Plus className="w-4 h-4 mr-2" /> Agregar ahora
      </Button>
    </div>
  );
}
