// src/features/admin/UserFilters.tsx
'use client';

import { useState } from 'react';
import { Calendar, MapPin, Clock, X } from 'lucide-react';

interface FilterOptions {
  role?: string;
  status?: string;
  country?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  lastLogin?: string;
}

interface UserFiltersProps {
  onFilterChange: (filters: FilterOptions) => void;
}

export default function UserFilters({ onFilterChange }: UserFiltersProps) {
  const [filters, setFilters] = useState<FilterOptions>({});

  const countries = [
    'España', 'México', 'Colombia', 'Argentina', 'Perú', 'Chile', 
    'Venezuela', 'Ecuador', 'Estados Unidos', 'Otros'
  ];

  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    setFilters({});
    onFilterChange({});
  };

  const hasActiveFilters = Object.keys(filters).some(key => 
    filters[key as keyof FilterOptions] !== undefined && 
    filters[key as keyof FilterOptions] !== ''
  );

  return (
    <div className="mt-4 pt-4 border-t border-slate-200 animate-slide-down">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-semibold text-slate-700">Filtros Avanzados</h4>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-slate-500 hover:text-slate-700 flex items-center space-x-1"
          >
            <X className="w-3 h-3" />
            <span>Limpiar filtros</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Filtro por país */}
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-2">
            <MapPin className="w-3 h-3 inline mr-1" />
            País
          </label>
          <select
            value={filters.country || ''}
            onChange={(e) => handleFilterChange('country', e.target.value || undefined)}
            className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          >
            <option value="">Todos los países</option>
            {countries.map(country => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>
        </div>

        {/* Filtro por rango de fechas de registro */}
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-2">
            <Calendar className="w-3 h-3 inline mr-1" />
            Fecha de Registro
          </label>
          <select
            value={filters.dateRange ? 'custom' : ''}
            onChange={(e) => {
              if (e.target.value === 'last7days') {
                const end = new Date().toISOString().split('T')[0];
                const start = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
                handleFilterChange('dateRange', { start, end });
              } else if (e.target.value === 'last30days') {
                const end = new Date().toISOString().split('T')[0];
                const start = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
                handleFilterChange('dateRange', { start, end });
              } else if (e.target.value === 'last90days') {
                const end = new Date().toISOString().split('T')[0];
                const start = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
                handleFilterChange('dateRange', { start, end });
              } else {
                handleFilterChange('dateRange', undefined);
              }
            }}
            className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          >
            <option value="">Cualquier fecha</option>
            <option value="last7days">Últimos 7 días</option>
            <option value="last30days">Últimos 30 días</option>
            <option value="last90days">Últimos 90 días</option>
          </select>
        </div>

        {/* Filtro por último login */}
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-2">
            <Clock className="w-3 h-3 inline mr-1" />
            Último Login
          </label>
          <select
            value={filters.lastLogin || ''}
            onChange={(e) => handleFilterChange('lastLogin', e.target.value || undefined)}
            className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          >
            <option value="">Cualquier momento</option>
            <option value="today">Hoy</option>
            <option value="week">Esta semana</option>
            <option value="month">Este mes</option>
            <option value="never">Nunca</option>
          </select>
        </div>

        {/* Filtro por horas de dedicación */}
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-2">
            Horas por Semana
          </label>
          <select
            className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          >
            <option value="">Cualquier cantidad</option>
            <option value="10">10 horas</option>
            <option value="20">20 horas</option>
          </select>
        </div>
      </div>

      {/* Filtros activos */}
      {hasActiveFilters && (
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="text-xs text-slate-600">Filtros activos:</span>
          {filters.country && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-emerald-100 text-emerald-800">
              País: {filters.country}
              <button
                onClick={() => handleFilterChange('country', undefined)}
                className="ml-1 hover:text-emerald-600"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.dateRange && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
              Período seleccionado
              <button
                onClick={() => handleFilterChange('dateRange', undefined)}
                className="ml-1 hover:text-blue-600"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.lastLogin && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
              Login: {filters.lastLogin}
              <button
                onClick={() => handleFilterChange('lastLogin', undefined)}
                className="ml-1 hover:text-purple-600"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}