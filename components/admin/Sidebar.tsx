import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Car, 
  CalendarDays, 
  Users, 
  CalendarRange, 
  LogOut
} from 'lucide-react';
import { logoutAdmin } from '@/services/auth';
import CapAventureLogo from '@/components/CapAventureLogo';

export default function Sidebar() {
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
    router.push('/admin');
  };

  return (
    <aside className="w-64 bg-white border-r border-brand-border flex flex-col h-screen sticky top-0 shadow-sm">
      {/* Logo — compact avec le vrai branding Cap Aventure */}
      <div className="p-5 border-b border-brand-border">
        <Link href="/" className="block" aria-label="Cap Aventure — Accueil">
          <CapAventureLogo variant="compact" />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 stagger-children">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 overflow-hidden group ${
                isActive
                  ? 'bg-brand-accent/10 text-brand-accent'
                  : 'text-brand-muted hover:bg-brand-hover hover:text-brand-text'
              }`}
            >
              {/* Barre latérale accent (3px) — indicateur item actif, règle design premium */}
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
      <div className="p-4 border-t border-brand-border">
        <div className="flex items-center p-3 bg-brand-hover rounded-xl mb-3 border border-brand-border/40">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <div className="relative flex-shrink-0">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-accent to-brand-accent-hover text-white flex items-center justify-center font-bold text-xs font-mono shadow-sm">
                AD
              </div>
              {/* Indicateur online */}
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
    </aside>
  );
}
