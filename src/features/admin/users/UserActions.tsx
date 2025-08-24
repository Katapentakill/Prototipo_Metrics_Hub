// src/features/admin/UserActions.tsx
'use client';

import { useEffect, useRef } from 'react';
import { 
  Edit, 
  Trash2, 
  UserX, 
  UserCheck, 
  Mail, 
  Key, 
  Shield,
  Eye,
  Download
} from 'lucide-react';

interface UserActionsProps {
  user: any;
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
}

export default function UserActions({ user, onEdit, onDelete, onClose }: UserActionsProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const handleAction = (action: string) => {
    console.log(`Action: ${action} for user:`, user.id);
    onClose();
    
    switch (action) {
      case 'edit':
        onEdit();
        break;
      case 'delete':
        onDelete();
        break;
      case 'suspend':
        // Aquí iría la lógica para suspender usuario
        break;
      case 'activate':
        // Aquí iría la lógica para activar usuario
        break;
      case 'resetPassword':
        // Aquí iría la lógica para resetear contraseña
        break;
      case 'sendEmail':
        // Aquí iría la lógica para enviar email
        break;
      case 'changeRole':
        // Aquí iría la lógica para cambiar rol
        break;
    }
  };

  return (
    <div
      ref={menuRef}
      className="absolute right-0 top-10 w-56 card p-2 z-50 animate-slide-down"
    >
      {/* Información del usuario */}
      <div className="px-3 py-2 border-b border-slate-200 mb-1">
        <p className="text-sm font-medium text-slate-800">{user.name}</p>
        <p className="text-xs text-muted">{user.email}</p>
      </div>

      {/* Acciones principales */}
      <div className="space-y-1">
        <button
          onClick={() => handleAction('edit')}
          className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <Edit className="w-4 h-4" />
          <span>Editar Usuario</span>
        </button>

        <button
          onClick={() => handleAction('view')}
          className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <Eye className="w-4 h-4" />
          <span>Ver Detalles</span>
        </button>

        <button
          onClick={() => handleAction('sendEmail')}
          className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <Mail className="w-4 h-4" />
          <span>Enviar Email</span>
        </button>
      </div>

      <hr className="my-2 border-slate-200" />

      {/* Acciones de seguridad */}
      <div className="space-y-1">
        <button
          onClick={() => handleAction('resetPassword')}
          className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-amber-700 hover:bg-amber-50 rounded-lg transition-colors"
        >
          <Key className="w-4 h-4" />
          <span>Resetear Contraseña</span>
        </button>

        <button
          onClick={() => handleAction('changeRole')}
          className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
        >
          <Shield className="w-4 h-4" />
          <span>Cambiar Rol</span>
        </button>

        {user.status === 'active' ? (
          <button
            onClick={() => handleAction('suspend')}
            className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-orange-700 hover:bg-orange-50 rounded-lg transition-colors"
          >
            <UserX className="w-4 h-4" />
            <span>Suspender Usuario</span>
          </button>
        ) : (
          <button
            onClick={() => handleAction('activate')}
            className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-green-700 hover:bg-green-50 rounded-lg transition-colors"
          >
            <UserCheck className="w-4 h-4" />
            <span>Activar Usuario</span>
          </button>
        )}
      </div>

      <hr className="my-2 border-slate-200" />

      {/* Acciones adicionales */}
      <div className="space-y-1">
        <button
          onClick={() => handleAction('download')}
          className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Exportar Datos</span>
        </button>
      </div>

      <hr className="my-2 border-slate-200" />

      {/* Acción peligrosa */}
      <div className="space-y-1">
        <button
          onClick={() => handleAction('delete')}
          className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-red-700 hover:bg-red-50 rounded-lg transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          <span>Eliminar Usuario</span>
        </button>
      </div>

      {/* Información adicional */}
      <div className="mt-2 px-3 py-2 bg-slate-50 rounded-lg">
        <div className="text-xs text-slate-500 space-y-1">
          <p>ID: {user.id}</p>
          <p>Rol: {user.role}</p>
          <p>Estado: {user.status}</p>
          {user.last_login && (
            <p>Último login: {new Date(user.last_login).toLocaleDateString('es-ES')}</p>
          )}
        </div>
      </div>
    </div>
  );
}