import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Car, 
  CalendarDays, 
  Users, 
  CalendarRange, 
  LogOut,
  X
} from 'lucide-react';
import { logoutAdmin } from '@/services/auth';
import CapAventureLogo from '@/components/CapAventureLogo';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    { href: '/admin/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
    { href: '/admin/vehicules', label: 'Véhicules', icon: Car },
    { href: '/admin/reservations', label: 'Réservations', icon: CalendarDays },
    { href: '/admin/clients', label: 'Clients', icon: Users },
    { href: '/admin/calendrier', label: 'Calendrier', icon: CalendarRange },
  ];

  const handleLogout = async () => {
    try {
      await logoutAdmin();
    } catch (err) {
      console.error(err);
    }
    sessionStorage.removeItem('admin_token');
    if (onClose) onClose();
    router.push('/admin');
  };

  const navContent = (
    <div className="flex flex-col h-full bg-white">
      {/* Logo & Mobile Close */}
      <div className="p-5 border-b border-brand-border flex items-center justify-between">
        <Link href="/" onClick={onClose} aria-label="Cap Aventure — Accueil">
          <CapAventureLogo variant="compact" />
        </Link>
        {onClose && (
          <button
            onClick={onClose}
            className="md:hidden p-2 text-brand-muted hover:text-brand-navy rounded-xl transition-colors cursor-pointer"
            aria-label="Fermer le menu"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`relative flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 overflow-hidden group ${
                isActive
                  ? 'bg-brand-accent/10 text-brand-accent font-bold'
                  : 'text-brand-muted hover:bg-brand-hover hover:text-brand-text'
              }`}
            >
              {/* Barre latérale accent (3px) — indicateur item actif */}
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-7 bg-brand-accent rounded-r-full" />
              )}
              <Icon className={`w-5 h-5 flex-shrink-0 transition-all duration-200 ${isActive ? 'text-brand-accent' : 'group-hover:scale-110 group-hover:text-brand-accent'}`} />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Session Info / Logout */}
      <div className="p-4 border-t border-brand-border mt-auto">
        <div className="flex items-center p-3 bg-brand-hover rounded-xl mb-3 border border-brand-border/40">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <div className="relative flex-shrink-0">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-accent to-brand-accent-hover text-white flex items-center justify-center font-bold text-xs font-mono shadow-sm">
                AD
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-brand-success rounded-full border-2 border-white" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-brand-text truncate">Admin Principal</p>
              <p className="text-[9px] text-brand-muted font-semibold">En ligne</p>
            </div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-brand-error/8 hover:bg-brand-error text-brand-error hover:text-white rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer border border-brand-error/20 hover:border-transparent"
        >
          <LogOut className="w-4 h-4" />
          <span>Déconnexion</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Permanent) */}
      <aside className="hidden md:flex w-64 border-r border-brand-border flex-col h-screen sticky top-0 shadow-sm flex-shrink-0">
        {navContent}
      </aside>

      {/* Mobile Drawer Slide-over */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop blur & dark overlay */}
          <div 
            className="fixed inset-0 bg-brand-navy/60 backdrop-blur-sm transition-opacity animate-fade-in"
            onClick={onClose}
          />

          {/* Drawer Content */}
          <div className="relative flex-1 max-w-xs w-full bg-white h-full shadow-2xl z-10 animate-slide-in-right">
            {navContent}
          </div>
        </div>
      )}
    </>
  );
}
