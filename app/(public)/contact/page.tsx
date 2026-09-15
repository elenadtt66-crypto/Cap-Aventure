'use client';

import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp,
  Compass,
  ArrowRight
} from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const faqs: FAQItem[] = [
    {
      question: "Quel permis est requis pour conduire vos véhicules ?",
      answer: "Le permis B (voiture classique) de plus de 3 ans est suffisant pour tous nos vans, fourgons et camping-cars profilés. Pour les camping-cars intégraux de plus de 7 mètres, nous demandons une expérience confirmée de conduite de grand gabarit ou plus de 5 ans de permis B."
    },
    {
      question: "Comment fonctionne l'assurance et l'assistance ?",
      answer: "Tous nos tarifs de location incluent automatiquement une assurance tous risques européenne et une assistance technique 24h/24 et 7j/7. En cas de panne ou de sinistre, vous êtes couvert partout en Europe. Une caution/franchise est demandée avant le départ."
    },
    {
      question: "Les équipements de vaisselle et de couchage sont-ils fournis ?",
      answer: "Le kit de cuisine complet (assiettes, verres, couverts, casseroles, cafetière italienne) et les raccords techniques (tuyau d'eau, rallonge électrique, cales de stationnement) sont fournis gratuitement dans tous les véhicules. Les draps et oreillers sont disponibles en option (Pack Linge)."
    },
    {
      question: "Puis-je voyager à l'étranger avec le véhicule ?",
      answer: "Oui, vous pouvez circuler librement dans tous les pays de l'Union Européenne ainsi qu'en Suisse et en Norvège. Votre destination doit simplement figurer sur la carte internationale d'assurance fournie dans la boîte à gants."
    },
    {
      question: "Les animaux de compagnie sont-ils acceptés à bord ?",
      answer: "Les animaux domestiques de petite taille sont acceptés à bord de nos fourgons aménagés si vous sélectionnez l'option correspondante lors de la réservation, afin de couvrir le nettoyage antibactérien spécifique de fin de séjour."
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 w-full space-y-16">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-3">
        <span className="text-brand-accent font-extrabold text-xs uppercase tracking-widest block">Contact & Aide</span>
        <h1 className="text-3xl md:text-5xl font-extrabold text-brand-text tracking-tight">
          Nous sommes à votre écoute
        </h1>
        <p className="text-sm text-brand-muted">
          Une question sur un véhicule ? Un besoin d'assistance ? Contactez notre agence bordelaise ou consultez notre FAQ.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Contact Form and Coordinates */}
        <div className="space-y-10">
          <div className="bg-white border border-brand-border p-6 md:p-8 rounded-3xl shadow-sm space-y-6">
            <h3 className="text-lg font-extrabold text-brand-text">Envoyer un message</h3>
            
            {submitted ? (
              <div className="p-6 bg-[#16A34A]/10 border border-[#16A34A]/20 text-[#16A34A] rounded-2xl flex items-center space-x-3 animate-scale-up">
                <CheckCircle2 className="w-8 h-8 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-sm">Message envoyé !</h4>
                  <p className="text-xs text-brand-muted mt-0.5">Notre équipe vous répondra par email sous quelques heures.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-xs font-extrabold uppercase text-brand-muted tracking-wider mb-2">
                      Nom complet *
                    </label>
                    <input
                      id="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-3 bg-brand-beige border border-brand-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent text-sm"
                      placeholder="Jean Dupuy"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-xs font-extrabold uppercase text-brand-muted tracking-wider mb-2">
                      Adresse email *
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-4 py-3 bg-brand-beige border border-brand-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent text-sm"
                      placeholder="jean.dupuy@mail.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-xs font-extrabold uppercase text-brand-muted tracking-wider mb-2">
                    Sujet *
                  </label>
                  <input
                    id="subject"
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                    className="w-full px-4 py-3 bg-brand-beige border border-brand-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent text-sm"
                    placeholder="Ex: Demande de tarif de groupe..."
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs font-extrabold uppercase text-brand-muted tracking-wider mb-2">
                    Votre message *
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    className="w-full px-4 py-3 bg-brand-beige border border-brand-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent text-sm"
                    placeholder="Écrivez votre demande en détail..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center space-x-2 py-3.5 bg-brand-accent hover:bg-brand-accent-hover text-white rounded-xl font-bold shadow-md btn-transition cursor-pointer"
                >
                  <span>Envoyer mon message</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>

          {/* Coordinates grid */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white border border-brand-border p-5 rounded-2xl flex items-start space-x-4">
              <div className="p-2.5 bg-brand-accent/10 text-brand-accent rounded-xl">
                <Phone className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-extrabold text-brand-text text-xs uppercase tracking-wider">Téléphone</h4>
                <p className="text-xs font-bold text-brand-text">+33 7 80 97 63 64</p>
                <p className="text-[10px] text-brand-muted leading-tight">Numéro non surtaxé.</p>
              </div>
            </div>

            <div className="bg-white border border-brand-border p-5 rounded-2xl flex items-start space-x-4">
              <div className="p-2.5 bg-brand-accent/10 text-brand-accent rounded-xl">
                <Mail className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-extrabold text-brand-text text-xs uppercase tracking-wider">Email</h4>
                <p className="text-xs font-bold text-brand-text">contact@cap-aventure.fr</p>
                <p className="text-[10px] text-brand-muted leading-tight">Réponse garantie sous 24h.</p>
              </div>
            </div>

            <div className="bg-white border border-brand-border p-5 rounded-2xl flex items-start space-x-4">
              <div className="p-2.5 bg-brand-accent/10 text-brand-accent rounded-xl">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-extrabold text-brand-text text-xs uppercase tracking-wider">Agence</h4>
                <p className="text-xs font-bold text-brand-text">Bordeaux Lac</p>
                <p className="text-[10px] text-brand-muted leading-tight">14 Av. de la Liberté, 33000.</p>
              </div>
            </div>

            <div className="bg-white border border-brand-border p-5 rounded-2xl flex items-start space-x-4">
              <div className="p-2.5 bg-brand-accent/10 text-brand-accent rounded-xl">
                <Clock className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-extrabold text-brand-text text-xs uppercase tracking-wider">Horaires</h4>
                <p className="text-xs font-bold text-brand-text">9h00 - 19h00</p>
                <p className="text-[10px] text-brand-muted leading-tight">Du Lundi au Samedi.</p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Area */}
        <div className="bg-white border border-brand-border p-6 md:p-8 rounded-3xl shadow-sm space-y-6">
          <div className="flex items-center space-x-2.5">
            <span className="p-2 bg-brand-accent/10 rounded-xl text-brand-accent">
              <Compass className="w-5 h-5" />
            </span>
            <h3 className="text-lg font-extrabold text-brand-text">Questions fréquentes</h3>
          </div>

          <div className="divide-y divide-brand-border">
            {faqs.map((faq, index) => {
              const isOpen = openFAQ === index;
              return (
                <div key={index} className="py-4 space-y-2 first:pt-0 last:pb-0">
                  <button
                    onClick={() => setOpenFAQ(isOpen ? null : index)}
                    className="w-full flex items-center justify-between text-left font-bold text-brand-text text-sm hover:text-brand-accent transition-colors duration-150 cursor-pointer"
                  >
                    <span>{faq.question}</span>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-brand-accent" /> : <ChevronDown className="w-4 h-4 text-brand-muted" />}
                  </button>
                  {isOpen && (
                    <p className="text-xs text-brand-muted leading-relaxed animate-fade-in pr-6">
                      {faq.answer}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
