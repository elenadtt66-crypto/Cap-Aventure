'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, ArrowRight, Lock, Mail } from 'lucide-react';
import { loginAdmin } from '@/services/auth';

export default function AdminLogin() {
  const [email, setEmail] = useState('admin@cap-aventure.fr');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = sessionStorage.getItem('admin_token');
    if (token) {
      router.push('/admin/dashboard');
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email.trim() || !password.trim()) {
      setError('Veuillez remplir tous les champs.');
      setLoading(false);
      return;
    }

    try {
      // 1. Tenter l'authentification Firebase Auth
      try {
        await loginAdmin(email, password);
        sessionStorage.setItem('admin_token', email);
        router.push('/admin/dashboard');
        return;
      } catch (fbError: any) {
        console.warn('Firebase Auth fell back or failed:', fbError.message);
        
        // 2. Mode secours si Firebase n'est pas encore configuré ou en offline
        const correctEmail = 'admin@cap-aventure.fr';
        const correctPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin@123';

        if (email === correctEmail && password === correctPassword) {
          sessionStorage.setItem('admin_token', email);
          router.push('/admin/dashboard');
          return;
        } else {
          // Si Firebase a retourné une erreur spécifique de mot de passe, ou si le mot de passe de secours a échoué
          if (fbError.code === 'auth/wrong-password' || fbError.code === 'auth/user-not-found') {
            setError('Identifiants incorrects.');
          } else {
            setError('Identifiants de secours incorrects ou configuration Firebase manquante.');
          }
        }
      }
    } catch (err) {
      setError('Une erreur est survenue lors de la connexion.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-1 flex items-center justify-center p-6 bg-brand-beige min-h-screen grain-bg">
      <div className="w-full max-w-md bg-white border border-brand-border p-8 rounded-3xl shadow-xl hover-lift relative overflow-hidden">
        {/* Glow decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-accent/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-brand-accent/5 rounded-full blur-3xl"></div>

        <div className="flex flex-col items-center mb-8">
          <div className="p-3.5 bg-brand-accent/10 rounded-2xl text-brand-accent mb-4">
            <ShieldCheck className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-extrabold text-brand-text text-center tracking-tight">
            Espace d'Administration
          </h1>
          <p className="text-xs text-brand-muted text-center mt-2">
            Entrez vos accès administrateur Cap Aventure.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {error && (
            <div className="p-3 bg-brand-error/10 border border-brand-error/20 text-brand-error rounded-xl text-xs font-semibold">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-xs font-extrabold uppercase text-brand-muted tracking-wider mb-2">
              Adresse Email
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-brand-muted">
                <Mail className="w-4.5 h-4.5" />
              </span>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-brand-beige border border-brand-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent text-sm"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-extrabold uppercase text-brand-muted tracking-wider mb-2">
              Mot de passe
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-brand-muted">
                <Lock className="w-4.5 h-4.5" />
              </span>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-11 pr-4 py-3 bg-brand-beige border border-brand-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent text-sm"
              />
            </div>
            <div className="mt-1 flex justify-end">
              <span className="text-[10px] text-brand-muted">Démo: admin@123</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center space-x-2 py-3.5 bg-brand-accent hover:bg-brand-accent-hover text-white rounded-xl font-bold shadow-md btn-transition disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <span>Connexion en cours...</span>
            ) : (
              <>
                <span>Se connecter</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-brand-border text-center">
          <button
            onClick={() => router.push('/')}
            className="text-xs font-bold text-brand-accent hover:underline cursor-pointer"
          >
            Retour au site de réservation
          </button>
        </div>
      </div>
    </main>
  );
}
