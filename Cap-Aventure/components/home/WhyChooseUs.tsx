import React from 'react';
import { ShieldCheck, Headphones, Sparkles, HeartHandshake, CheckCircle2 } from 'lucide-react';
import Badge from '@/components/ui/Badge';

export default function WhyChooseUs() {
  const guarantees = [
    {
      icon: <ShieldCheck className="w-8 h-8 text-brand-accent" />,
      title: 'Assurance Multirisque Incluse',
      desc: 'Couverture tous risques complète avec franchise modulable et rachat de franchise optionnel pour rouler l’esprit 100% tranquille.'
    },
    {
      icon: <Headphones className="w-8 h-8 text-brand-accent" />,
      title: 'Assistance 24h/24 & 7j/7',
      desc: 'Dépannage et rapatriement partout en France et en Europe en cas de crevaison, panne ou imprévu sur votre trajet.'
    },
    {
      icon: <Sparkles className="w-8 h-8 text-brand-accent" />,
      title: 'Contrôle Qualité & Hygiène',
      desc: 'Chaque véhicule est vérifié et nettoyé méticuleusement. Pack literie et kit vaisselle premium disponibles sur demande.'
    },
    {
      icon: <HeartHandshake className="w-8 h-8 text-brand-accent" />,
      title: 'Conseils Personnalisés d’Itinéraire',
      desc: 'Notre équipe de passionnés de roadtrip vous partage les meilleurs spots sauvages, aires de services et règles de stationnement.'
    }
  ];

  return (
    <section className="py-20 px-6 bg-brand-beige border-t border-brand-border">
      <div className="max-w-7xl mx-auto space-y-16">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <Badge variant="navy">Les Engagements Cap Aventure</Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-text tracking-tight">
            Pourquoi partir avec nous ?
          </h2>
          <p className="text-sm text-brand-muted">
            Nous avons pensé chaque détail pour faire de votre roadtrip une expérience sans contrainte.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {guarantees.map((item, idx) => (
            <div
              key={idx}
              className="bg-white border border-brand-border p-7 rounded-3xl shadow-sm hover-lift flex flex-col justify-between space-y-4"
            >
              <div className="p-4 bg-brand-gold-light rounded-2xl w-fit">
                {item.icon}
              </div>
              <h3 className="text-base font-extrabold text-brand-text">
                {item.title}
              </h3>
              <p className="text-xs sm:text-sm text-brand-muted leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
