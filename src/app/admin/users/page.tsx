// src/app/(admin)/users/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  MoreVertical,
  Shield,
  UserCheck,
  UserX,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Eye,
  Download,
  Upload
} from 'lucide-react';
import { ExtendedUserWithProfile, UserStats } from '@/lib/types';
import { extendedMockUsers } from '@/lib/data/extendedUsers';
import UserFilters from '@/features/admin/UserFilters';
import UserModal from '@/features/admin/UserModalEdit';
import UserActions from '@/features/admin/UserActions';
import ExportUsers from '@/features/admin/ExportUsers';
import UserDetailModal from '@/features/admin/UserDetailModal';

export default function AdminUsers() {
  const [users, setUsers] = useState<ExtendedUserWithProfile[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<ExtendedUserWithProfile[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false); // Nuevo estado para modal de detalles
  const [selectedUser, setSelectedUser] = useState<ExtendedUserWithProfile | null>(null);
  const [showActions, setShowActions] = useState<string | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, selectedRole, selectedStatus]);

  const loadUsers = async () => {
    try {
      // Simular carga de datos
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Usar los datos extendidos importados
      const mockUsers = extendedMockUsers;

      const userStats: UserStats = {
        total: mockUsers.length,
        active: mockUsers.filter(u => u.status === 'active').length,
        inactive: mockUsers.filter(u => u.status === 'inactive').length,
        suspended: mockUsers.filter(u => u.status === 'suspended').length,
        deleted: mockUsers.filter(u => u.status === 'deleted').length,
        byRole: {
          admin: mockUsers.filter(u => u.role === 'admin').length,
          hr: mockUsers.filter(u => u.role === 'hr').length,
          lead_project: mockUsers.filter(u => u.role === 'lead_project').length,
          volunteer: mockUsers.filter(u => u.role === 'volunteer').length,
          unassigned: mockUsers.filter(u => u.role === 'unassigned').length,
        },
        byCountry: mockUsers.reduce((acc, user) => {
          const country = user.profile?.country || 'Unknown';
          acc[country] = (acc[country] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        bySkillCategory: mockUsers.reduce((acc, user) => {
          user.profile?.skills?.forEach(skill => {
            acc[skill.category] = (acc[skill.category] || 0) + 1;
          });
          return acc;
        }, {} as Record<string, number>)
      };

      setUsers(mockUsers);
      setStats(userStats);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading users:', error);
      setIsLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = [...users];

    // Filtro por búsqueda (incluyendo habilidades y biografía)
    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.profile?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.profile?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.profile?.bio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.profile?.skills?.some(skill => 
          skill.name.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        user.profile?.university?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por rol
    if (selectedRole !== 'all') {
      filtered = filtered.filter(user => user.role === selectedRole);
    }

    // Filtro por estado
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(user => user.status === selectedStatus);
    }

    setFilteredUsers(filtered);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800 border-red-200';
      case 'hr': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'lead_project': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'volunteer': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrador';
      case 'hr': return 'Recursos Humanos';
      case 'lead_project': return 'Líder de Proyecto';
      case 'volunteer': return 'Voluntario';
      case 'unassigned': return 'Sin Asignar';
      default: return role;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'suspended': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Activo';
      case 'inactive': return 'Inactivo';
      case 'suspended': return 'Suspendido';
      case 'deleted': return 'Eliminado';
      default: return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleEditUser = (user: ExtendedUserWithProfile) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleViewUser = (user: ExtendedUserWithProfile) => {
    setSelectedUser(user);
    setShowDetailModal(true); // Abrir modal de detalles
  };

  const handleCreateUser = () => {
    setSelectedUser(null);
    setShowModal(true);
  };

  const handleSaveUser = (userData: any) => {
    if (selectedUser) {
      // Actualizar usuario existente
      setUsers(users.map(u => u.id === selectedUser.id ? { ...u, ...userData } : u));
    } else {
      // Crear nuevo usuario
      const newUser: ExtendedUserWithProfile = {
        id: Date.now().toString(),
        ...userData,
        created_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
        password: 'temp123' // Temporal
      };
      setUsers([...users, newUser]);
    }
    setShowModal(false);
    setSelectedUser(null);
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      setUsers(users.filter(u => u.id !== userId));
    }
  };

  const getSkillsPreview = (skills: any[] | undefined) => {
    if (!skills || skills.length === 0) return 'Sin habilidades';
    if (skills.length <= 2) return skills.map(s => s.name).join(', ');
    return `${skills.slice(0, 2).map(s => s.name).join(', ')} +${skills.length - 2}`;
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="loading-skeleton h-8 w-64"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card p-6">
              <div className="loading-skeleton h-6 w-20 mb-2"></div>
              <div className="loading-skeleton h-8 w-16"></div>
            </div>
          ))}
        </div>
        <div className="card p-6">
          <div className="loading-skeleton h-96 w-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center">
            <Users className="w-8 h-8 mr-3 text-emerald-600" />
            Gestión de Usuarios
          </h1>
          <p className="text-muted mt-1">Administra todos los usuarios del sistema Living Stones</p>
        </div>
        <div className="flex items-center space-x-3">
          <ExportUsers users={filteredUsers} />
          <button
            onClick={handleCreateUser}
            className="btn-living flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Usuario</span>
          </button>
        </div>
      </div>

      {/* Estadísticas Mejoradas */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card p-6 hover-lift">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted">Total Usuarios</p>
                <p className="text-3xl font-bold text-slate-800">{stats.total}</p>
                <p className="text-xs text-slate-500 mt-1">
                  {Object.keys(stats.byCountry).length} países
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="card p-6 hover-lift">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted">Usuarios Activos</p>
                <p className="text-3xl font-bold text-slate-800">{stats.active}</p>
                <p className="text-sm text-green-600">
                  {Math.round((stats.active / stats.total) * 100)}% del total
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="card p-6 hover-lift">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted">Voluntarios</p>
                <p className="text-3xl font-bold text-slate-800">{stats.byRole.volunteer}</p>
                <p className="text-sm text-slate-500">Rol más común</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="card p-6 hover-lift">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted">Administradores</p>
                <p className="text-3xl font-bold text-slate-800">{stats.byRole.admin}</p>
                <p className="text-sm text-red-600">Acceso completo</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filtros y búsqueda mejorados */}
      <div className="card p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por nombre, email, habilidades..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn-secondary flex items-center space-x-2"
            >
              <Filter className="w-4 h-4" />
              <span>Filtros</span>
            </button>
          </div>
          
          <div className="flex items-center space-x-4">
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="all">Todos los roles</option>
              <option value="admin">Administrador</option>
              <option value="hr">HR</option>
              <option value="lead_project">Líder Proyecto</option>
              <option value="volunteer">Voluntario</option>
              <option value="unassigned">Sin Asignar</option>
            </select>
            
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="all">Todos los estados</option>
              <option value="active">Activo</option>
              <option value="inactive">Inactivo</option>
              <option value="suspended">Suspendido</option>
            </select>
          </div>
        </div>

        {showFilters && (
          <UserFilters
            onFilterChange={(filters) => {
              setSelectedRole(filters.role || 'all');
              setSelectedStatus(filters.status || 'all');
            }}
          />
        )}
      </div>

      {/* Tabla de usuarios mejorada */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-slate-700">Usuario</th>
                <th className="text-left py-4 px-6 font-semibold text-slate-700">Rol</th>
                <th className="text-left py-4 px-6 font-semibold text-slate-700">Estado</th>
                <th className="text-left py-4 px-6 font-semibold text-slate-700">Ubicación</th>
                <th className="text-left py-4 px-6 font-semibold text-slate-700">Habilidades</th>
                <th className="text-left py-4 px-6 font-semibold text-slate-700">Último Login</th>
                <th className="text-center py-4 px-6 font-semibold text-slate-700">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">{user.name}</p>
                        <p className="text-sm text-slate-500 flex items-center">
                          <Mail className="w-3 h-3 mr-1" />
                          {user.email}
                        </p>
                        {user.profile?.phone && (
                          <p className="text-xs text-slate-400 flex items-center">
                            <Phone className="w-3 h-3 mr-1" />
                            {user.profile.phone}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleColor(user.role)}`}>
                      {getRoleLabel(user.role)}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(user.status)}`}>
                      {getStatusLabel(user.status)}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    {user.profile && (
                      <div className="text-sm">
                        <p className="text-slate-800 flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {user.profile.city}, {user.profile.country}
                        </p>
                        <p className="text-xs text-slate-500">{user.profile.timezone}</p>
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm">
                      <p className="text-slate-800 line-clamp-2">
                        {getSkillsPreview(user.profile?.skills)}
                      </p>
                      {user.profile?.university && (
                        <p className="text-xs text-slate-500 mt-1">
                          📚 {user.profile.university}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm">
                      {user.last_login ? (
                        <>
                          <p className="text-slate-800">{formatDate(user.last_login)}</p>
                          <p className="text-xs text-slate-500 flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {new Date(user.last_login).toLocaleTimeString('es-ES', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </p>
                        </>
                      ) : (
                        <span className="text-slate-400">Nunca</span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        onClick={() => handleEditUser(user)}
                        className="p-2 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors admin-tooltip"
                        data-tooltip="Editar usuario"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleViewUser(user)}
                        className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors admin-tooltip"
                        data-tooltip="Ver detalles completos"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <div className="relative">
                        <button
                          onClick={() => setShowActions(showActions === user.id ? null : user.id)}
                          className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        {showActions === user.id && (
                          <UserActions
                            user={user}
                            onEdit={() => handleEditUser(user)}
                            onDelete={() => handleDeleteUser(user.id)}
                            onClose={() => setShowActions(null)}
                          />
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-600 mb-2">No se encontraron usuarios</h3>
            <p className="text-slate-500 mb-4">
              {searchTerm || selectedRole !== 'all' || selectedStatus !== 'all'
                ? 'Intenta ajustar los filtros de búsqueda.'
                : 'Comienza creando tu primer usuario.'}
            </p>
            {(!searchTerm && selectedRole === 'all' && selectedStatus === 'all') && (
              <button
                onClick={handleCreateUser}
                className="btn-living-outline"
              >
                <Plus className="w-4 h-4 mr-2" />
                Crear Usuario
              </button>
            )}
          </div>
        )}
      </div>

      {/* Modales */}
      {showModal && (
        <UserModal
          user={selectedUser}
          onSave={handleSaveUser}
          onClose={() => {
            setShowModal(false);
            setSelectedUser(null);
          }}
        />
      )}

      {/* Nuevo Modal de Detalles */}
      {showDetailModal && selectedUser && (
        <UserDetailModal
          user={selectedUser}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedUser(null);
          }}
          onEdit={() => {
            setShowDetailModal(false);
            handleEditUser(selectedUser);
          }}
        />
      )}
    </div>
  );
}