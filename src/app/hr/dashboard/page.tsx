// src/app/(admin)/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { 
  Users, 
  FolderOpen, 
  CheckSquare, 
  FileText, 
  TrendingUp, 
  AlertTriangle,
  Clock,
  Award,
  BarChart3,
  PieChart,
  Activity,
  Calendar
} from 'lucide-react';
import DashboardStats from '@/features/admin/DashboardStats';
import QuickActions from '@/features/admin/QuickActions';
import RecentActivity from '@/features/admin/RecentActivity';
import SystemHealth from '@/features/admin/SystemHealth';

interface DashboardData {
  totalUsers: number;
  activeUsers: number;
  totalProjects: number;
  activeProjects: number;
  totalTasks: number;
  completedTasks: number;
  pendingApplications: number;
  thisMonthRegistrations: number;
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simular carga de datos (aquí irían las consultas reales a la DB)
    const loadDashboardData = async () => {
      // Simulación de datos basados en tu seeder
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setData({
        totalUsers: 30,
        activeUsers: 28,
        totalProjects: 8,
        activeProjects: 6,
        totalTasks: 100,
        completedTasks: 67,
        pendingApplications: 12,
        thisMonthRegistrations: 6
      });
      
      setIsLoading(false);
    };

    loadDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="space-y-6">
          <div className="loading-skeleton h-8 w-64"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="card p-6">
                <div className="loading-skeleton h-6 w-20 mb-2"></div>
                <div className="loading-skeleton h-8 w-16"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
    </div>
  );
}