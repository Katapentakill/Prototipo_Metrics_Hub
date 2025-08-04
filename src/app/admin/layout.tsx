// src/app/(admin)/layout.tsx
'use client';

import { useEffect, useState } from 'react';
import { redirect } from 'next/navigation';
import HeaderAdmin from '@/components/layout/HeaderAdmin';
import FooterAdmin from '@/components/layout/FooterAdmin';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const session = localStorage.getItem('auth_session');
    
    if (!session) {
      window.location.href = '/login';
      return;
    }

    try {
      const sessionData = JSON.parse(session);
      
      if (sessionData.role !== 'admin') {
        window.location.href = '/login';
        return;
      }

      setIsAuthorized(true);
    } catch (error) {
      console.error('Error validating admin session:', error);
      window.location.href = '/login';
    } finally {
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center space-y-4">
          <div className="spinner w-8 h-8 mx-auto"></div>
          <p className="text-muted">Verificando permisos de administrador...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <HeaderAdmin />
      <main className="pt-20 pb-8 min-h-screen">
        <div className="admin-main-content px-6 py-6">
          {children}
        </div>
      </main>
      <FooterAdmin />
    </div>
  );
}