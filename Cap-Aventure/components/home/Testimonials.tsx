import React from 'react';
import { Star, Quote, CheckCircle2 } from 'lucide-react';
import Badge from '@/components/ui/Badge';

export default function Testimonials() {
  const reviews = [
    {
      author: 'Maxime & Clara D.',
      location: 'Voyage en Bretagne (7 jours en Van California)',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      rating: 5,
      comment: 'Une semaine féerique sur la côte de Granit Rose. Le van était d’une propreté exemplaire et la prise en main très fluide grâce aux explications de Marc. Nous repartirons avec Cap Aventure dès le printemps prochain !'
    },
    {
      author: 'Julien M. & Famille',
      location: 'Tour des Châteaux de la Loire (Camping-car profilé)',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      rating: 5,
      comment: 'Le lit de pavillon électrique et le grand salon ont fait l’unanimité auprès des enfants. Un vrai confort de maison sur roues, sans aucune mauvaise surprise sur la route.'
    },
    {
      author: 'Philippe V.',
      location: 'Propriétaire d’un Fourgon Pössl à Bordeaux',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
      rating: 5,
      comment: 'Grâce à Cap Aventure, je loue mon fourgon 6 semaines par an pendant mes périodes creuses. Cela finance l’intégralité de mon assurance et de mes révisions annuelles en toute sérénité.'
    }
  ];

  return (
    <section className="py-20 px-6 max-w-7xl mx-auto">
      <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
        <Badge variant="gold">Avis 100% Vérifiés</Badge>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-text tracking-tight">
          Ce que disent nos voyageurs
        </h2>
        <p className="text-sm text-brand-muted">
          Plus de 1 400 roadtrips réussis et une note moyenne de 4.9/5 sur l'ensemble de notre flotte.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {reviews.map((rev, idx) => (
          <div
            key={idx}
            className="bg-white border border-brand-border p-8 rounded-3xl shadow-sm hover-lift flex flex-col justify-between space-y-6"
          >
            <div className="space-y-4">
              {/* Stars */}
              <div className="flex items-center space-x-1">
                {[...Array(rev.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-brand-accent fill-brand-accent" />
                ))}
              </div>

              {/* Comment */}
              <p className="text-xs sm:text-sm text-brand-text leading-relaxed italic">
                "{rev.comment}"
              </p>
            </div>

            {/* Author info */}
            <div className="flex items-center space-x-3 pt-4 border-t border-brand-border">
              <img
                src={rev.avatar}
                alt={rev.author}
                className="w-11 h-11 rounded-full object-cover border-2 border-brand-accent/20"
              />
              <div>
                <h4 className="text-xs font-extrabold text-brand-text">
                  {rev.author}
                </h4>
                <p className="text-[10px] text-brand-muted">
                  {rev.location}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
