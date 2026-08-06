'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, Phone, User } from 'lucide-react';
import CapAventureLogo from '@/components/CapAventureLogo';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/', label: 'Accueil' },
    { href: '/vehicules', label: 'Nos Véhicules' },
    { href: '/reservation', label: 'Réservation' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-brand-beige">
      {/* Navbar flottante */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/90 backdrop-blur border-b border-brand-border py-4 shadow-sm'
            : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          {/* Logo — format horizontal sur desktop, compact sur mobile */}
          <Link href="/" className="flex items-center" aria-label="Cap Aventure — Accueil">
            <CapAventureLogo
              variant="horizontal"
              className="hidden md:flex"
            />
            <CapAventureLogo
              variant="compact"
              className="flex md:hidden"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-semibold transition-colors duration-200 relative py-1 ${
                    isActive ? 'text-brand-accent font-bold' : 'text-brand-text/80 hover:text-brand-accent'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-accent rounded-full"></span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/contact"
              className="flex items-center space-x-2 text-xs font-bold text-brand-text/70 hover:text-brand-accent transition-colors duration-200"
            >
              <Phone className="w-4 h-4" />
              <span>+33 7 80 97 63 64</span>
            </Link>
            <button
              onClick={() => router.push('/admin')}
              className="flex items-center space-x-2 px-4 py-2 border border-brand-border rounded-xl text-sm font-semibold hover:bg-brand-hover text-brand-text transition-all duration-200 cursor-pointer hover:border-brand-accent/40"
            >
              <User className="w-4 h-4 text-brand-muted" />
              <span>Espace Admin</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-brand-text hover:text-brand-accent transition-colors duration-250 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-brand-border shadow-xl p-6 space-y-4 animate-fade-in">
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-base font-bold py-2 border-b border-brand-border/50 ${
                    pathname === link.href ? 'text-brand-accent' : 'text-brand-text'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="pt-4 flex flex-col space-y-3">
              <a
                href="tel:+33780976364"
                className="flex items-center space-x-2 text-sm font-semibold text-brand-text"
              >
                <Phone className="w-4 h-4 text-brand-accent" />
                <span>+33 7 80 97 63 64</span>
              </a>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  router.push('/admin');
                }}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-brand-accent text-white rounded-xl text-sm font-semibold hover:bg-brand-accent-hover transition-colors duration-200"
              >
                <User className="w-4 h-4" />
                <span>Espace Admin</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col pt-24">
        {children}
      </div>

      {/* ——— Blog & Newsletter Banner (Above Footer) ——— */}
      <section className="bg-[#FFFFFF] border-t border-[#E2E8F0] py-16 px-6 w-full">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left — Blog promo */}
          <div className="space-y-6">
            <div className="space-y-1">
              <span className="text-[#C9A035] font-extrabold text-[10px] uppercase tracking-widest block">Le Blog Cap Aventure</span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-[#1C2B4A] tracking-tight leading-tight">
                Inspirations, conseils & récits<br/>de voyage en camping-car
              </h2>
            </div>
            <p className="text-sm text-[#6B7A94] leading-relaxed max-w-md">
              Itinéraires incontournables, astuces de vanlifers chevronnés, témoignages de la communauté… Tout ce dont vous avez besoin pour préparer le road trip de vos rêves.
            </p>
            {/* Polaroid stack decoration */}
            <div className="relative h-44 w-80 mt-2">
              <div className="absolute top-0 left-0 w-32 h-36 bg-white rounded-xl shadow-lg border border-[#E2E8F0] overflow-hidden rotate-[-6deg] z-10">
                <img src="https://images.unsplash.com/photo-1503220317375-aaad61436b1b?auto=format&fit=crop&w=200&q=80" alt="Blog 1" className="w-full h-full object-cover" />
              </div>
              <div className="absolute top-2 left-20 w-32 h-36 bg-white rounded-xl shadow-lg border border-[#E2E8F0] overflow-hidden rotate-[2deg] z-20">
                <img src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=200&q=80" alt="Blog 2" className="w-full h-full object-cover" />
              </div>
              <div className="absolute top-0 left-40 w-32 h-36 bg-white rounded-xl shadow-lg border border-[#E2E8F0] overflow-hidden rotate-[7deg] z-30">
                <img src="https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&w=200&q=80" alt="Blog 3" className="w-full h-full object-cover" />
              </div>
            </div>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#1C2B4A] text-white rounded-xl text-xs font-bold hover:bg-[#0F172A] transition-colors duration-200 shadow-sm hover:shadow-md"
            >
              Lire le blog
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </Link>
          </div>

          {/* Right — Newsletter */}
          <div className="bg-white rounded-3xl border border-[#E2E8F0] p-10 shadow-sm space-y-6">
            <div className="space-y-1">
              <span className="text-[#C9A035] font-extrabold text-[10px] uppercase tracking-widest block">Newsletter</span>
              <h3 className="text-xl font-extrabold text-[#1C2B4A] leading-tight">
                Les meilleures destinations<br/>directement dans votre boîte mail
              </h3>
            </div>
            <p className="text-sm text-[#6B7A94] leading-relaxed">
              Rejoignez <strong className="text-[#1C2B4A] font-extrabold">+12 000 aventuriers</strong> et recevez chaque semaine nos suggestions d'itinéraires et offres exclusives.
            </p>
            <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
              <div className="relative">
                <input
                  type="email"
                  placeholder="Votre adresse email"
                  className="w-full px-5 py-3.5 bg-[#FFFFFF] border-2 border-[#E2E8F0] rounded-2xl text-sm font-semibold text-[#1C2B4A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#C9A035] focus:ring-4 focus:ring-[#C9A035]/10 transition-all duration-200"
                />
              </div>
              <button
                type="submit"
                className="w-full px-5 py-3.5 bg-[#C9A035] hover:bg-[#A8832A] text-white rounded-2xl text-sm font-extrabold transition-all duration-200 shadow-md shadow-[#C9A035]/20 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
              >
                Je m'inscris gratuitement
              </button>
            </form>
            <p className="text-[10px] text-[#94A3B8] text-center">Aucun spam. Désinscription en un clic. ✦</p>
          </div>
        </div>
      </section>

      {/* ——— Footer Light (Yescapa Style) ——— */}
      <footer className="bg-[#F5F5F3] border-t border-[#E2E8F0] py-16 mt-auto">
        <div className="max-w-7xl mx-auto px-6">

          {/* Top row: Logo + 4 columns */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-12">

            {/* Logo + baseline */}
            <div className="col-span-2 md:col-span-1 space-y-4">
              <CapAventureLogo variant="compact" />
              <p className="text-xs text-[#6B7A94] leading-relaxed max-w-[180px]">
                La location de camping-cars entre particuliers en France & Belgique.
              </p>
              {/* Social icons */}
              <div className="flex items-center gap-3 pt-2">
                {[
                  { label: 'Instagram', d: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' },
                  { label: 'Facebook', d: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' },
                  { label: 'Pinterest', d: 'M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z' },
                  { label: 'Twitter/X', d: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L2.25 2.25h6.602l4.259 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z' },
                ].map((social) => (
                  <a
                    key={social.label}
                    href="#"
                    aria-label={social.label}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-[#94A3B8] hover:text-[#C9A035] hover:bg-[#C9A035]/8 transition-all duration-200"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d={social.d} /></svg>
                  </a>
                ))}
              </div>
            </div>

            {/* Voyageurs */}
            <div className="space-y-4">
              <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-[#1C2B4A]">Voyageurs</h4>
              <ul className="space-y-2.5 text-xs text-[#6B7A94]">
                {[
                  { label: 'Comment ça fonctionne', href: '/#comment-ca-marche' },
                  { label: 'Louer un véhicule', href: '/vehicules' },
                  { label: 'Premier voyage en van', href: '/blog' },
                  { label: 'Avis de nos utilisateurs', href: '/avis' },
                  { label: "Centre d'aide Voyageurs", href: '/contact' },
                ].map((item) => (
                  <li key={item.label}>
                    <Link href={item.href} className="hover:text-[#C9A035] transition-colors duration-200 font-medium">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Propriétaires */}
            <div className="space-y-4">
              <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-[#1C2B4A]">Propriétaires</h4>
              <ul className="space-y-2.5 text-xs text-[#6B7A94]">
                {[
                  { label: 'Créer une annonce', href: '/proprietaire' },
                  { label: 'Contrat de location', href: '/proprietaire' },
                  { label: 'Assurance location', href: '/proprietaire' },
                  { label: 'Assistance panne', href: '/contact' },
                  { label: "Centre d'aide Hôtes", href: '/contact' },
                ].map((item) => (
                  <li key={item.label}>
                    <Link href={item.href} className="hover:text-[#C9A035] transition-colors duration-200 font-medium">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Cap Aventure */}
            <div className="space-y-4">
              <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-[#1C2B4A]">Cap Aventure</h4>
              <ul className="space-y-2.5 text-xs text-[#6B7A94]">
                {[
                  { label: 'Qui sommes-nous ?', href: '/contact' },
                  { label: 'Le blog', href: '/blog' },
                  { label: 'Photos communauté', href: '/communaute/photos' },
                  { label: 'Presse & Médias', href: '/contact' },
                  { label: 'Recrutement', href: '/contact' },
                ].map((item) => (
                  <li key={item.label}>
                    <Link href={item.href} className="hover:text-[#C9A035] transition-colors duration-200 font-medium">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div className="space-y-4">
              <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-[#1C2B4A]">Contact</h4>
              <ul className="space-y-2.5 text-xs text-[#6B7A94]">
                <li className="font-medium">14 Av. de la Liberté</li>
                <li className="font-medium">33000 Bordeaux, France</li>
                <li><a href="mailto:contact@cap-aventure.fr" className="hover:text-[#C9A035] transition-colors font-medium">contact@cap-aventure.fr</a></li>
                <li><a href="tel:+33780976364" className="hover:text-[#C9A035] transition-colors font-medium">+33 7 80 97 63 64</a></li>
                <li className="font-medium text-[#94A3B8]">Lun–Sam · 9h00–19h00</li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-8 border-t border-[#E2E8F0] flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] text-[#94A3B8]">
            <p>© {new Date().getFullYear()} Cap Aventure SAS. Tous droits réservés.</p>
            <div className="flex items-center gap-5">
              <Link href="/mentions-legales" className="hover:text-[#1C2B4A] transition-colors font-medium">Mentions légales</Link>
              <Link href="/confidentialite" className="hover:text-[#1C2B4A] transition-colors font-medium">Confidentialité</Link>
              <Link href="/cgu" className="hover:text-[#1C2B4A] transition-colors font-medium">CGU</Link>
              <Link href="/cookies" className="hover:text-[#1C2B4A] transition-colors font-medium">Cookies</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
