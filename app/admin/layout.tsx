'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Sidebar from '@/components/admin/Sidebar';
import { RefreshCw, Menu } from 'lucide-react';
import CapAventureLogo from '@/components/CapAventureLogo';
import ThemeToggle from '@/components/ui/ThemeToggle';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    <div className="flex flex-col md:flex-row w-full min-h-screen bg-brand-beige">
      {/* Header Mobile Admin (< md) */}
      <header className="md:hidden sticky top-0 z-40 bg-white border-b border-brand-border px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 text-brand-navy hover:text-brand-accent hover:bg-brand-hover rounded-xl transition-colors cursor-pointer"
            aria-label="Ouvrir le menu de navigation"
          >
            <Menu className="w-6 h-6" />
          </button>
          <CapAventureLogo variant="compact" />
        </div>
        <div className="flex items-center space-x-2">
          <ThemeToggle variant="icon" />
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-accent to-brand-accent-hover text-white flex items-center justify-center font-bold text-xs font-mono shadow-sm">
            AD
          </div>
        </div>
      </header>

      {/* Sidebar desktop permanent + mobile drawer */}
      <Sidebar 
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full grain-bg">
        {children}
      </main>
    </div>
  );
}
