// src/app/admin/projects/page.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Folder,
  Search,
  Filter,
  MoreVertical,
  MapPin,
  Eye,
  Users as UsersIcon,
} from 'lucide-react';

import type {
  Project,
  ExtendedUserWithProfile,
  ProjectWithLead,
} from '@/lib/types';

import { extendedMockUsers } from '@/lib/data/extendedUsers';
import { mockProjects, mockTeams, mockTeamMembers } from '@/lib/data/mockProjects';
import ProjectFilters, { type ProjectFilterOptions } from '@/features/admin/projects/ProjectFilters';
import ProjectActions from '@/features/admin/projects/ProjectActions';
import ProjectModalEdit from '@/features/admin/projects/ProjectModalEdit';
import ProjectDetailModal from '@/features/admin/projects/ProjectDetailModal';
import ExportProjects from '@/features/admin/projects/ExportProjects';
import { buildProjectViews, type ProjectView } from '@/lib/data/map/projects/projectView';

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<ExtendedUserWithProfile[]>([]);
  const [views, setViews] = useState<ProjectView[]>([]);
  const [filtered, setFiltered] = useState<ProjectView[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [adv, setAdv] = useState<ProjectFilterOptions>({ status: 'all' });

  // modales / acciones
  const [selected, setSelected] = useState<ProjectView | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [menuFor, setMenuFor] = useState<string | null>(null);

  const leadCandidates = useMemo(
    () => extendedMockUsers.filter((u) => u.role === 'lead_project'),
    []
  );

  useEffect(() => {
    (async () => {
      // simular carga
      await new Promise((r) => setTimeout(r, 300));
      setUsers(extendedMockUsers);
      setProjects(mockProjects);
      setIsLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      const v = buildProjectViews(projects, users, mockTeams, mockTeamMembers);
      setViews(v);
    }
  }, [isLoading, projects, users]);

  useEffect(() => { applyFilters(); }, [views, searchTerm, adv]);

  const applyFilters = () => {
    let data = [...views];

    // búsqueda
    const q = searchTerm.trim().toLowerCase();
    if (q) {
      data = data.filter(v =>
        v.project.name.toLowerCase().includes(q) ||
        v.project.description?.toLowerCase().includes(q) ||
        v.lead?.name.toLowerCase().includes(q) ||
        v.lead?.email.toLowerCase().includes(q) ||
        v.country?.toLowerCase().includes(q) ||
        v.city?.toLowerCase().includes(q)
      );
    }

    // estado
    if (adv.status && adv.status !== 'all') {
      data = data.filter(v => v.project.status === adv.status);
    }

    // país (del líder o del primer miembro)
    if (adv.country) {
      const cq = adv.country.toLowerCase();
      data = data.filter(v => (v.country || '').toLowerCase().includes(cq));
    }

    setFiltered(data);
  };

  const badgeStatus = (s: Project['status']) => {
    switch (s) {
      case 'active': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'planning': return 'bg-slate-100 text-slate-800 border-slate-200';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'paused': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (s?: string) =>
    s ? new Date(s.replace(' ', 'T')).toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' }) : '—';

  const onEdit = (v: ProjectView) => { setSelected(v); setShowEdit(true); };
  const onView = (v: ProjectView) => { setSelected(v); setShowDetail(true); };

  const onSave = (patch: Partial<Project>) => {
    if (!selected) return;
    setProjects(prev =>
      prev.map(p => p.id === selected.project.id ? { ...p, ...patch } : p)
    );
    setShowEdit(false);
    setSelected(null);
  };

  const onDelete = (v: ProjectView) => {
    if (confirm(`¿Eliminar proyecto "${v.project.name}"?`)) {
      setProjects(prev => prev.filter(p => p.id !== v.project.id));
    }
  };

  const exportOne = (v: ProjectView) => {
    // Exportar solo uno reutilizando el componente de export general:
    const headers = [
      'id','name','status','lead_name','lead_email','country','city',
      'max_team_size','current_team_size','progress_pct','deadline','created_at'
    ];
    const row = [
      v.project.id, v.project.name.replace(/,/g,' '), v.project.status,
      v.lead?.name?.replace(/,/g,' ') || '', v.lead?.email || '',
      v.country || '', v.city || '', v.project.max_team_size,
      v.project.current_team_size, v.progressPct, v.project.deadline || '',
      v.project.created_at,
    ];
    const csv = [headers.join(','), row.join(',')].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `project_${v.project.id}.csv`; a.click();
    URL.revokeObjectURL(url);
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
        <div className="card p-6"><div className="loading-skeleton h-96 w-full"></div></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center">
            <Folder className="w-8 h-8 mr-3 text-emerald-600" />
            Projects
          </h1>
          <p className="text-muted mt-1">Administra los proyectos del sistema Living Stones</p>
        </div>
        <div className="flex items-center gap-3">
          <ExportProjects views={filtered} />
        </div>
      </div>

      {/* Búsqueda + filtros */}
      <div className="card p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por nombre, líder, país…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
            <button onClick={() => setShowFilters((s) => !s)} className="btn-secondary flex items-center gap-2">
              <Filter className="w-4 h-4" /><span>Filtros</span>
            </button>
          </div>
        </div>

        {showFilters && (
          <ProjectFilters onFilterChange={setAdv} />
        )}
      </div>

      {/* Tabla */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-slate-700">Proyecto</th>
                <th className="text-left py-4 px-6 font-semibold text-slate-700">Estado</th>
                <th className="text-left py-4 px-6 font-semibold text-slate-700">Ubicación</th>
                <th className="text-left py-4 px-6 font-semibold text-slate-700">Equipo</th>
                <th className="text-left py-4 px-6 font-semibold text-slate-700">Progreso</th>
                <th className="text-center py-4 px-6 font-semibold text-slate-700">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filtered.map((v) => (
                <tr key={v.project.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {v.project.name.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">{v.project.name}</p>
                        <p className="text-xs text-slate-500">Líder: {v.lead?.name} — {v.lead?.email}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${badgeStatus(v.project.status)}`}>
                      {v.project.status}
                    </span>
                  </td>

                  <td className="py-4 px-6">
                    <div className="text-sm">
                      <p className="text-slate-800 flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {v.city ? `${v.city}, ` : ''}{v.country || '—'}
                      </p>
                      {v.project.deadline && <p className="text-xs text-slate-500">Deadline: {v.project.deadline}</p>}
                    </div>
                  </td>

                  <td className="py-4 px-6">
                    <div className="text-sm flex items-center gap-2">
                      <UsersIcon className="w-4 h-4 text-slate-400" />
                      <span>{v.project.current_team_size}/{v.project.max_team_size}</span>
                    </div>
                  </td>

                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-slate-200 rounded-full h-2">
                        <div className="h-2 bg-emerald-500 rounded-full" style={{ width: `${v.progressPct}%` }} />
                      </div>
                      <span className="text-xs text-slate-600">{v.progressPct}%</span>
                    </div>
                  </td>

                  <td className="py-4 px-6">
                    <div className="flex items-center justify-center gap-2">
                      {/* OJO: solo ver detalles aquí */}
                      <button
                        onClick={() => onView(v)}
                        className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors admin-tooltip"
                        data-tooltip="Ver detalles"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <div className="relative">
                        <button
                          onClick={() => setMenuFor(menuFor === v.project.id ? null : v.project.id)}
                          className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {menuFor === v.project.id && (
                          <ProjectActions
                            onEdit={() => onEdit(v)}
                            onExport={() => exportOne(v)}
                            onDelete={() => onDelete(v)}
                            onClose={() => setMenuFor(null)}
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

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <Folder className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-600 mb-2">No se encontraron proyectos</h3>
            <p className="text-slate-500">Ajusta tu búsqueda o filtros.</p>
          </div>
        )}
      </div>

      {/* Modales */}
      {showEdit && selected && (
        <ProjectModalEdit
          project={selected.project}
          leads={leadCandidates}
          onSave={onSave}
          onClose={() => { setShowEdit(false); setSelected(null); }}
        />
      )}

      {showDetail && selected && (
        <ProjectDetailModal
          view={selected}
          onEdit={() => { setShowDetail(false); onEdit(selected); }}
          onClose={() => { setShowDetail(false); setSelected(null); }}
        />
      )}
    </div>
  );
}
