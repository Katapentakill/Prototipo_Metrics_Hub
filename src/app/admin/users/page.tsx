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
import { User, UserProfile } from '@/lib/types/types';
import UserFilters from '@/features/admin/UserFilters';
import UserModal from '@/features/admin/UserModal';
import UserActions from '@/features/admin/UserActions';
import ExportUsers from '@/features/admin/ExportUsers';

interface UserWithProfile extends User {
  profile?: UserProfile;
}

interface UserStats {
  total: number;
  active: number;
  inactive: number;
  byRole: {
    admin: number;
    hr: number;
    lead_project: number;
    volunteer: number;
    unassigned: number;
  };
}

export default function AdminUsers() {
  const [users, setUsers] = useState<UserWithProfile[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserWithProfile[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserWithProfile | null>(null);
  const [showActions, setShowActions] = useState<string | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, selectedRole, selectedStatus]);

  const loadUsers = async () => {
    try {
      // Simular carga de datos (aquí iría la consulta real a la DB)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Datos simulados basados en el seeder (30 usuarios)
      const mockUsers: UserWithProfile[] = [
        { id: '1', email: 'admin_1@example.com', name: 'Carlos Gutiérrez', role: 'admin', status: 'active', email_verified: 1, created_at: '2024-01-15 10:30:00', last_login: '2024-08-03 22:15:00', password: '', profile: { id: '1', user_id: '1', first_name: 'Carlos', last_name: 'Gutiérrez', phone: '+1-555-0101', country: 'España', city: 'Madrid', timezone: 'GMT+1', hours_per_week: 20, preferred_hours: 'Flexible' } },
        { id: '2', email: 'admin_2@example.com', name: 'Isabel Moreno', role: 'admin', status: 'active', email_verified: 1, created_at: '2024-01-16 11:30:00', last_login: '2024-08-03 21:00:00', password: '', profile: { id: '2', user_id: '2', first_name: 'Isabel', last_name: 'Moreno', phone: '+1-555-0102', country: 'México', city: 'Guadalajara', timezone: 'CST', hours_per_week: 20, preferred_hours: 'Mañanas' } },
        { id: '3', email: 'hr_1@example.com', name: 'Laura Pérez', role: 'hr', status: 'active', email_verified: 1, created_at: '2024-01-20 14:15:00', last_login: '2024-08-03 18:45:00', password: '', profile: { id: '3', user_id: '3', first_name: 'Laura', last_name: 'Pérez', phone: '+1-555-0202', country: 'México', city: 'Ciudad de México', timezone: 'CST', hours_per_week: 20, preferred_hours: 'Mañanas' } },
        { id: '4', email: 'hr_2@example.com', name: 'Roberto Silva', role: 'hr', status: 'active', email_verified: 1, created_at: '2024-01-22 15:00:00', last_login: '2024-08-03 17:30:00', password: '', profile: { id: '4', user_id: '4', first_name: 'Roberto', last_name: 'Silva', phone: '+1-555-0203', country: 'Colombia', city: 'Medellín', timezone: 'GMT-5', hours_per_week: 20, preferred_hours: 'Tardes' } },
        { id: '5', email: 'hr_3@example.com', name: 'Carmen López', role: 'hr', status: 'active', email_verified: 1, created_at: '2024-01-25 16:30:00', last_login: '2024-08-03 19:15:00', password: '', profile: { id: '5', user_id: '5', first_name: 'Carmen', last_name: 'López', phone: '+1-555-0204', country: 'Argentina', city: 'Córdoba', timezone: 'GMT-3', hours_per_week: 20, preferred_hours: 'Flexible' } },
        { id: '6', email: 'hr_4@example.com', name: 'Diego Herrera', role: 'hr', status: 'active', email_verified: 1, created_at: '2024-01-28 09:45:00', last_login: '2024-08-03 16:00:00', password: '', profile: { id: '6', user_id: '6', first_name: 'Diego', last_name: 'Herrera', phone: '+1-555-0205', country: 'Perú', city: 'Arequipa', timezone: 'GMT-5', hours_per_week: 20, preferred_hours: 'Noches' } },
        { id: '7', email: 'lead_1@example.com', name: 'Miguel Rodríguez', role: 'lead_project', status: 'active', email_verified: 1, created_at: '2024-02-01 09:20:00', last_login: '2024-08-03 16:30:00', password: '', profile: { id: '7', user_id: '7', first_name: 'Miguel', last_name: 'Rodríguez', phone: '+1-555-0303', country: 'Colombia', city: 'Bogotá', timezone: 'GMT-5', hours_per_week: 20, preferred_hours: 'Tardes' } },
        { id: '8', email: 'lead_2@example.com', name: 'Andrea Castillo', role: 'lead_project', status: 'active', email_verified: 1, created_at: '2024-02-03 10:15:00', last_login: '2024-08-03 20:45:00', password: '', profile: { id: '8', user_id: '8', first_name: 'Andrea', last_name: 'Castillo', phone: '+1-555-0304', country: 'Chile', city: 'Valparaíso', timezone: 'GMT-3', hours_per_week: 20, preferred_hours: 'Mañanas' } },
        { id: '9', email: 'lead_3@example.com', name: 'Fernando Ruiz', role: 'lead_project', status: 'active', email_verified: 1, created_at: '2024-02-05 11:30:00', last_login: '2024-08-03 15:20:00', password: '', profile: { id: '9', user_id: '9', first_name: 'Fernando', last_name: 'Ruiz', phone: '+1-555-0305', country: 'Ecuador', city: 'Quito', timezone: 'GMT-5', hours_per_week: 20, preferred_hours: 'Tardes' } },
        { id: '10', email: 'lead_4@example.com', name: 'Gabriela Torres', role: 'lead_project', status: 'active', email_verified: 1, created_at: '2024-02-08 14:00:00', last_login: '2024-08-03 18:10:00', password: '', profile: { id: '10', user_id: '10', first_name: 'Gabriela', last_name: 'Torres', phone: '+1-555-0306', country: 'Venezuela', city: 'Valencia', timezone: 'GMT-4', hours_per_week: 20, preferred_hours: 'Flexible' } },
        { id: '11', email: 'lead_5@example.com', name: 'Ricardo Mendoza', role: 'lead_project', status: 'active', email_verified: 1, created_at: '2024-02-10 16:45:00', last_login: '2024-08-03 14:30:00', password: '', profile: { id: '11', user_id: '11', first_name: 'Ricardo', last_name: 'Mendoza', phone: '+1-555-0307', country: 'Guatemala', city: 'Antigua', timezone: 'GMT-6', hours_per_week: 20, preferred_hours: 'Mañanas' } },
        { id: '12', email: 'volunteer_1@example.com', name: 'Ana Martínez', role: 'volunteer', status: 'active', email_verified: 1, created_at: '2024-02-15 11:45:00', last_login: '2024-08-02 20:10:00', password: '', profile: { id: '12', user_id: '12', first_name: 'Ana', last_name: 'Martínez', phone: '+1-555-0404', country: 'Argentina', city: 'Buenos Aires', timezone: 'GMT-3', hours_per_week: 10, preferred_hours: 'Noches' } },
        { id: '13', email: 'volunteer_2@example.com', name: 'Pedro Sánchez', role: 'volunteer', status: 'inactive', email_verified: 1, created_at: '2024-03-01 16:00:00', last_login: '2024-07-15 12:30:00', password: '', profile: { id: '13', user_id: '13', first_name: 'Pedro', last_name: 'Sánchez', phone: '+1-555-0505', country: 'Perú', city: 'Lima', timezone: 'GMT-5', hours_per_week: 10, preferred_hours: 'Flexible' } },
        { id: '14', email: 'volunteer_3@example.com', name: 'María González', role: 'volunteer', status: 'active', email_verified: 1, created_at: '2024-03-05 09:30:00', last_login: '2024-08-03 12:15:00', password: '', profile: { id: '14', user_id: '14', first_name: 'María', last_name: 'González', phone: '+1-555-0506', country: 'España', city: 'Barcelona', timezone: 'GMT+1', hours_per_week: 10, preferred_hours: 'Mañanas' } },
        { id: '15', email: 'volunteer_4@example.com', name: 'José Ramírez', role: 'volunteer', status: 'active', email_verified: 1, created_at: '2024-03-08 13:20:00', last_login: '2024-08-03 19:45:00', password: '', profile: { id: '15', user_id: '15', first_name: 'José', last_name: 'Ramírez', phone: '+1-555-0507', country: 'México', city: 'Monterrey', timezone: 'CST', hours_per_week: 10, preferred_hours: 'Tardes' } },
        { id: '16', email: 'volunteer_5@example.com', name: 'Lucía Fernández', role: 'volunteer', status: 'active', email_verified: 1, created_at: '2024-03-12 15:10:00', last_login: '2024-08-03 17:30:00', password: '', profile: { id: '16', user_id: '16', first_name: 'Lucía', last_name: 'Fernández', phone: '+1-555-0508', country: 'Colombia', city: 'Cali', timezone: 'GMT-5', hours_per_week: 10, preferred_hours: 'Noches' } },
        { id: '17', email: 'volunteer_6@example.com', name: 'Daniel Castro', role: 'volunteer', status: 'active', email_verified: 1, created_at: '2024-03-15 10:45:00', last_login: '2024-08-03 14:20:00', password: '', profile: { id: '17', user_id: '17', first_name: 'Daniel', last_name: 'Castro', phone: '+1-555-0509', country: 'Chile', city: 'Santiago', timezone: 'GMT-3', hours_per_week: 10, preferred_hours: 'Flexible' } },
        { id: '18', email: 'volunteer_7@example.com', name: 'Patricia Jiménez', role: 'volunteer', status: 'active', email_verified: 1, created_at: '2024-03-18 12:30:00', last_login: '2024-08-03 16:45:00', password: '', profile: { id: '18', user_id: '18', first_name: 'Patricia', last_name: 'Jiménez', phone: '+1-555-0510', country: 'Argentina', city: 'Rosario', timezone: 'GMT-3', hours_per_week: 10, preferred_hours: 'Mañanas' } },
        { id: '19', email: 'volunteer_8@example.com', name: 'Alberto Vargas', role: 'volunteer', status: 'active', email_verified: 1, created_at: '2024-03-22 14:15:00', last_login: '2024-08-03 13:10:00', password: '', profile: { id: '19', user_id: '19', first_name: 'Alberto', last_name: 'Vargas', phone: '+1-555-0511', country: 'Perú', city: 'Cusco', timezone: 'GMT-5', hours_per_week: 10, preferred_hours: 'Tardes' } },
        { id: '20', email: 'volunteer_9@example.com', name: 'Elena Morales', role: 'volunteer', status: 'active', email_verified: 1, created_at: '2024-03-25 16:00:00', last_login: '2024-08-03 18:30:00', password: '', profile: { id: '20', user_id: '20', first_name: 'Elena', last_name: 'Morales', phone: '+1-555-0512', country: 'Ecuador', city: 'Guayaquil', timezone: 'GMT-5', hours_per_week: 10, preferred_hours: 'Noches' } },
        { id: '21', email: 'volunteer_10@example.com', name: 'Sergio Delgado', role: 'volunteer', status: 'active', email_verified: 1, created_at: '2024-03-28 08:45:00', last_login: '2024-08-03 15:50:00', password: '', profile: { id: '21', user_id: '21', first_name: 'Sergio', last_name: 'Delgado', phone: '+1-555-0513', country: 'Venezuela', city: 'Maracaibo', timezone: 'GMT-4', hours_per_week: 10, preferred_hours: 'Flexible' } },
        { id: '22', email: 'volunteer_11@example.com', name: 'Natalia Herrera', role: 'volunteer', status: 'active', email_verified: 1, created_at: '2024-04-01 11:20:00', last_login: '2024-08-03 12:40:00', password: '', profile: { id: '22', user_id: '22', first_name: 'Natalia', last_name: 'Herrera', phone: '+1-555-0514', country: 'Guatemala', city: 'Guatemala City', timezone: 'GMT-6', hours_per_week: 10, preferred_hours: 'Mañanas' } },
        { id: '23', email: 'volunteer_12@example.com', name: 'Rodrigo Campos', role: 'volunteer', status: 'active', email_verified: 1, created_at: '2024-04-05 13:35:00', last_login: '2024-08-03 17:05:00', password: '', profile: { id: '23', user_id: '23', first_name: 'Rodrigo', last_name: 'Campos', phone: '+1-555-0515', country: 'España', city: 'Valencia', timezone: 'GMT+1', hours_per_week: 10, preferred_hours: 'Tardes' } },
        { id: '24', email: 'volunteer_13@example.com', name: 'Cristina Vega', role: 'volunteer', status: 'active', email_verified: 1, created_at: '2024-04-08 15:50:00', last_login: '2024-08-03 19:25:00', password: '', profile: { id: '24', user_id: '24', first_name: 'Cristina', last_name: 'Vega', phone: '+1-555-0516', country: 'México', city: 'Puebla', timezone: 'CST', hours_per_week: 10, preferred_hours: 'Noches' } },
        { id: '25', email: 'volunteer_14@example.com', name: 'Alejandro Ramos', role: 'volunteer', status: 'active', email_verified: 1, created_at: '2024-04-12 09:15:00', last_login: '2024-08-03 14:35:00', password: '', profile: { id: '25', user_id: '25', first_name: 'Alejandro', last_name: 'Ramos', phone: '+1-555-0517', country: 'Colombia', city: 'Barranquilla', timezone: 'GMT-5', hours_per_week: 10, preferred_hours: 'Flexible' } },
        { id: '26', email: 'volunteer_15@example.com', name: 'Valeria Ortega', role: 'volunteer', status: 'active', email_verified: 1, created_at: '2024-04-15 12:00:00', last_login: '2024-08-03 16:15:00', password: '', profile: { id: '26', user_id: '26', first_name: 'Valeria', last_name: 'Ortega', phone: '+1-555-0518', country: 'Chile', city: 'Concepción', timezone: 'GMT-3', hours_per_week: 10, preferred_hours: 'Mañanas' } },
        { id: '27', email: 'volunteer_16@example.com', name: 'Marcos Peña', role: 'volunteer', status: 'active', email_verified: 1, created_at: '2024-04-18 14:30:00', last_login: '2024-08-03 18:50:00', password: '', profile: { id: '27', user_id: '27', first_name: 'Marcos', last_name: 'Peña', phone: '+1-555-0519', country: 'Argentina', city: 'Mendoza', timezone: 'GMT-3', hours_per_week: 10, preferred_hours: 'Tardes' } },
        { id: '28', email: 'volunteer_17@example.com', name: 'Sandra Blanco', role: 'volunteer', status: 'active', email_verified: 1, created_at: '2024-04-22 16:45:00', last_login: '2024-08-03 13:25:00', password: '', profile: { id: '28', user_id: '28', first_name: 'Sandra', last_name: 'Blanco', phone: '+1-555-0520', country: 'Perú', city: 'Trujillo', timezone: 'GMT-5', hours_per_week: 10, preferred_hours: 'Noches' } },
        { id: '29', email: 'volunteer_18@example.com', name: 'Esteban Cruz', role: 'volunteer', status: 'active', email_verified: 1, created_at: '2024-04-25 10:20:00', last_login: '2024-08-03 15:40:00', password: '', profile: { id: '29', user_id: '29', first_name: 'Esteban', last_name: 'Cruz', phone: '+1-555-0521', country: 'Ecuador', city: 'Cuenca', timezone: 'GMT-5', hours_per_week: 10, preferred_hours: 'Flexible' } },
        { id: '30', email: 'volunteer_19@example.com', name: 'Mónica Aguilar', role: 'volunteer', status: 'inactive', email_verified: 1, created_at: '2024-04-28 08:10:00', last_login: '2024-07-20 11:15:00', password: '', profile: { id: '30', user_id: '30', first_name: 'Mónica', last_name: 'Aguilar', phone: '+1-555-0522', country: 'Venezuela', city: 'Caracas', timezone: 'GMT-4', hours_per_week: 10, preferred_hours: 'Mañanas' } }
      ];

      const userStats: UserStats = {
        total: mockUsers.length,
        active: mockUsers.filter(u => u.status === 'active').length,
        inactive: mockUsers.filter(u => u.status === 'inactive').length,
        byRole: {
          admin: mockUsers.filter(u => u.role === 'admin').length,
          hr: mockUsers.filter(u => u.role === 'hr').length,
          lead_project: mockUsers.filter(u => u.role === 'lead_project').length,
          volunteer: mockUsers.filter(u => u.role === 'volunteer').length,
          unassigned: mockUsers.filter(u => u.role === 'unassigned').length,
        }
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

    // Filtro por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.profile?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.profile?.last_name?.toLowerCase().includes(searchTerm.toLowerCase())
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

  const handleEditUser = (user: UserWithProfile) => {
    setSelectedUser(user);
    setShowModal(true);
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
      const newUser: UserWithProfile = {
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

      {/* Estadísticas */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted">Total Usuarios</p>
                <p className="text-3xl font-bold text-slate-800">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="card p-6">
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

          <div className="card p-6">
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

          <div className="card p-6">
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

      {/* Filtros y búsqueda */}
      <div className="card p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por nombre, email..."
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

      {/* Tabla de usuarios */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-slate-700">Usuario</th>
                <th className="text-left py-4 px-6 font-semibold text-slate-700">Rol</th>
                <th className="text-left py-4 px-6 font-semibold text-slate-700">Estado</th>
                <th className="text-left py-4 px-6 font-semibold text-slate-700">Ubicación</th>
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
                        className="p-2 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                        title="Editar usuario"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Ver detalles"
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
    </div>
  );
}