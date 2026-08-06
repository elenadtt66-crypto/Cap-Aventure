'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Sidebar from '@/components/admin/Sidebar';
import { RefreshCw } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  const isLoginPage = pathname === '/admin';

  useEffect(() => {
    if (isLoginPage) {
      setAuthorized(true);
      setLoading(false);
      return;
    }

    const token = sessionStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin');
    } else {
      setAuthorized(true);
    }
    setLoading(false);
  }, [pathname, isLoginPage, router]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-brand-beige text-brand-muted">
        <RefreshCw className="w-8 h-8 animate-spin text-brand-accent mr-3" />
        <span>Vérification des accès admin...</span>
      </div>
    );
  }

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (!authorized) {
    return null; // En cours de redirection
  }

  return (
    <div className="flex w-full min-h-screen bg-brand-beige">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto max-w-7xl mx-auto grain-bg">
        {children}
      </main>
    </div>
  );
}
