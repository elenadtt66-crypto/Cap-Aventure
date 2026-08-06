'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Star, 
  ArrowLeft, 
  CheckCircle2, 
  ThumbsUp, 
  MessageSquare, 
  Calendar, 
  Filter, 
  ChevronDown, 
  Sparkles,
  Check
} from 'lucide-react';

interface Review {
  id: number;
  author: string;
  rating: number;
  date: string;
  vehicle: string;
  title: string;
  comment: string;
  verified: boolean;
  likes: number;
}

export default function AvisPage() {
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: 1,
      author: "Jean-Pierre L.",
      rating: 5,
      date: "26 juin 2026",
      vehicle: "Van Aménagé • Volkswagen California Coast",
      title: "Superbe voyage en Bretagne",
      comment: "Nous avons loué ce van pour un périple de 10 jours le long des côtes bretonnes. Le véhicule était dans un état impeccable, extrêmement propre et très agréable à conduire. L'aménagement intérieur est très fonctionnel, chaque espace est optimisé. L'accueil par l'équipe à Bordeaux a été des plus chaleureux avec des conseils précieux pour notre itinéraire. Nous relouerons sans hésiter !",
      verified: true,
      likes: 24
    },
    {
      id: 2,
      author: "Sophie & Marc M.",
      rating: 5,
      date: "18 juin 2026",
      vehicle: "Camping-car Profilé • Challenger Graphite",
      title: "Liberté totale en famille",
      comment: "Partis à 4 avec nos deux enfants. Le camping-car profilé offre un confort incroyable : de l'espace pour que chacun respire, des lits très confortables et une cuisine bien équipée qui permet d'être totalement autonomes. Le panneau solaire est un vrai plus pour l'autonomie électrique. C'était notre premier road trip et toute la famille a adoré !",
      verified: true,
      likes: 18
    },
    {
      id: 3,
      author: "Lucas D.",
      rating: 4,
      date: "12 juin 2026",
      vehicle: "Fourgon Aménagé • Fiat Ducato Max",
      title: "Très bon séjour et grand confort",
      comment: "Véhicule loué pour un séjour sportif dans les Pyrénées. Le grand coffre nous a permis de stocker nos vélos en toute sécurité. Le moteur a du répondant pour les cols de montagne. Un petit bémol au départ sur les explications de la mise en route du chauffage stationnaire, mais l'assistance téléphonique de Cap Aventure a été réactive et a réglé notre problème en 5 minutes. Très pro.",
      verified: true,
      likes: 12
    },
    {
      id: 4,
      author: "Amélie G.",
      rating: 5,
      date: "5 juin 2026",
      vehicle: "Van Aménagé • Ford Transit Custom",
      title: "Service impeccable et van de qualité",
      comment: "C'est ma deuxième location avec Cap Aventure et je suis toujours aussi ravie. Le van était quasiment neuf (moins de 15 000 km), d'une propreté exemplaire. Le retour du véhicule s'est fait très rapidement et en toute confiance. L'assurance tout inclus d'office permet de partir l'esprit tranquille. Je recommande les yeux fermés.",
      verified: true,
      likes: 9
    },
    {
      id: 5,
      author: "Thomas B.",
      rating: 5,
      date: "28 mai 2026",
      vehicle: "Camping-car Intégral • Rapido Premium",
      title: "Le grand luxe sur les routes",
      comment: "Nous avons opté pour le modèle intégral pour un road trip en Espagne et Portugal. C'est un véritable petit appartement sur roues. La vue panoramique à l'avant pendant la route est exceptionnelle. Lit central spacieux, douche séparée très pratique et grand réfrigérateur. Le service de Cap Aventure est d'une grande fluidité du début à la fin.",
      verified: true,
      likes: 31
    },
    {
      id: 6,
      author: "Chantal & Rémi R.",
      rating: 4,
      date: "20 mai 2026",
      vehicle: "Van Aménagé • Volkswagen California Beach",
      title: "Idéal pour un couple en quête d'aventure",
      comment: "Van très maniable, hauteur inférieure à 2 mètres qui permet de passer sous toutes les barres de parking et de payer le tarif voiture sur l'autoroute. Literie très correcte. Les explications fournies par l'agent au départ étaient claires et complètes. Idéal pour une semaine d'évasion en amoureux loin de la foule.",
      verified: true,
      likes: 7
    },
    {
      id: 7,
      author: "Youssef K.",
      rating: 5,
      date: "14 mai 2026",
      vehicle: "Fourgon Aménagé • Peugeot Boxer",
      title: "Première location réussie",
      comment: "Première fois que je conduisais un véhicule de cette taille et j'ai été agréablement surpris par sa facilité de prise en main. Il est bien insonorisé et consomme peu de carburant pour son gabarit. Tout le matériel de camping de base est fourni (vaisselle, cales, tuyaux), ce qui évite de devoir tout acheter. Une expérience formidable.",
      verified: true,
      likes: 15
    }
  ]);

  // États pour le formulaire de création d'avis
  const [showModal, setShowModal] = useState(false);
  const [newAuthor, setNewAuthor] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [newVehicle, setNewVehicle] = useState('van_amenege');
  const [newTitle, setNewTitle] = useState('');
  const [newComment, setNewComment] = useState('');
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [showToast, setShowToast] = useState(false);

  // États pour les filtres
  const [filterRating, setFilterRating] = useState<string>('all');
  const [filterVehicle, setFilterVehicle] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('recent');

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthor || !newTitle || !newComment) return;

    const vehicleMapping: Record<string, string> = {
      'van_amenege': 'Van Aménagé • Volkswagen California',
      'camping_car_profile': 'Camping-car Profilé • Challenger Graphite',
      'camping_car_integral': 'Camping-car Intégral • Rapido Premium',
      'fourgon_amenege': 'Fourgon Aménagé • Peugeot Boxer'
    };

    const newReview: Review = {
      id: Date.now(),
      author: newAuthor,
      rating: newRating,
      date: "Aujourd'hui",
      vehicle: vehicleMapping[newVehicle] || 'Véhicule Cap Aventure',
      title: newTitle,
      comment: newComment,
      verified: true,
      likes: 0
    };

    setReviews([newReview, ...reviews]);
    setShowModal(false);
    
    // Reset form
    setNewAuthor('');
    setNewRating(5);
    setNewVehicle('van_amenege');
    setNewTitle('');
    setNewComment('');

    // Show toast success
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  const handleLike = (id: number) => {
    setReviews(reviews.map(r => r.id === id ? { ...r, likes: r.likes + 1 } : r));
  };

  // Filtrage et tri des avis
  const filteredReviews = reviews
    .filter(r => {
      if (filterRating === 'all') return true;
      return r.rating === parseInt(filterRating);
    })
    .filter(r => {
      if (filterVehicle === 'all') return true;
      if (filterVehicle === 'van') return r.vehicle.includes('Van');
      if (filterVehicle === 'fourgon') return r.vehicle.includes('Fourgon');
      if (filterVehicle === 'cc') return r.vehicle.includes('Camping-car');
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'recent') return 0; // Conserve l'ordre du tableau (déjà trié par date)
      if (sortBy === 'top') return b.rating - a.rating;
      if (sortBy === 'low') return a.rating - b.rating;
      if (sortBy === 'popular') return b.likes - a.likes;
      return 0;
    });

  return (
    <main className="flex-1 bg-brand-beige min-h-screen pb-24 relative overflow-hidden">
      {/* Background grain noise visual overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] grain-bg"></div>

      {/* Sub-navigation Tabs */}
      <div className="bg-white border-b border-brand-border">
        <div className="max-w-6xl mx-auto px-6 flex justify-center md:justify-start space-x-8">
          <Link 
            href="/avis"
            className="py-4 text-xs font-bold transition-all border-b-2 border-[#C9A035] text-brand-text"
          >
            Avis de la communauté
          </Link>
          <Link 
            href="/communaute/photos"
            className="py-4 text-xs font-bold transition-all text-brand-muted hover:text-brand-text"
          >
            Photos de la communauté
          </Link>
        </div>
      </div>

      {/* Hero & Banner */}
      <section className="relative bg-brand-text text-white py-16 px-6 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-accent/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-accent/5 rounded-full blur-3xl"></div>
        
        <div className="max-w-6xl mx-auto space-y-6 relative z-10">
          <Link 
            href="/" 
            className="inline-flex items-center space-x-2 text-xs font-bold text-white/70 hover:text-brand-secondary transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour à l'accueil</span>
          </Link>
          <div className="space-y-3">
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
              Avis sur Cap Aventure
            </h1>
            <p className="text-sm md:text-base text-white/60 max-w-xl leading-relaxed">
              Découvrez les retours d'expérience et les témoignages de notre communauté de voyageurs qui ont parcouru les routes à bord de nos véhicules.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Container */}
      <div className="max-w-6xl mx-auto px-6 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Stats & Actions */}
        <div className="space-y-6 lg:col-span-1">
          {/* Card Summary */}
          <div className="bg-white border border-brand-border p-6 rounded-3xl shadow-sm space-y-6">
            <div className="text-center space-y-2">
              <p className="text-xs font-extrabold text-brand-muted uppercase tracking-wider">Note globale</p>
              <div className="flex items-center justify-center space-x-3">
                <span className="text-5xl font-extrabold text-brand-text">4,9</span>
                <span className="text-2xl font-extrabold text-brand-muted">/5</span>
              </div>
              <div className="flex justify-center text-[#F59E0B] py-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>
              <p className="text-xs text-brand-muted font-semibold">
                Basé sur 387 831 avis clients réels
              </p>
            </div>

            <div className="border-t border-brand-border pt-6 space-y-3">
              {/* Star Progress Bars */}
              {[
                { stars: 5, pct: 92 },
                { stars: 4, pct: 6 },
                { stars: 3, pct: 1 },
                { stars: 2, pct: 1 },
                { stars: 1, pct: 0 }
              ].map((row) => (
                <div key={row.stars} className="flex items-center text-xs">
                  <span className="w-3 font-bold text-brand-text">{row.stars}</span>
                  <Star className="w-3.5 h-3.5 fill-current text-[#F59E0B] ml-1 mr-2" />
                  <div className="flex-1 h-2 bg-brand-beige rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#F59E0B] rounded-full" 
                      style={{ width: `${row.pct}%` }}
                    ></div>
                  </div>
                  <span className="w-8 text-right text-brand-muted font-semibold ml-2">{row.pct}%</span>
                </div>
              ))}
            </div>

            <div className="bg-brand-success/5 border border-brand-success/20 rounded-2xl p-4 flex items-start space-x-3 text-brand-success">
              <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <p className="text-xs font-bold">100% d'avis authentiques</p>
                <p className="text-[10px] text-brand-success/90 leading-relaxed font-medium">
                  Seuls les clients ayant effectué une réservation chez Cap Aventure peuvent laisser un avis après leur retour de voyage.
                </p>
              </div>
            </div>
          </div>

          {/* Action Write Review */}
          <div className="bg-white border border-brand-border p-6 rounded-3xl shadow-sm text-center space-y-4">
            <h3 className="font-extrabold text-brand-text">Votre avis compte</h3>
            <p className="text-xs text-brand-muted leading-relaxed">
              Vous avez voyagé avec Cap Aventure récemment ? Partagez vos impressions et aidez les autres voyageurs à planifier leur aventure.
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="w-full flex items-center justify-center space-x-2 py-3 bg-[#C9A035] hover:bg-[#A8832A] text-white rounded-xl text-xs font-bold transition-all duration-200 shadow-md cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Laisser un avis client</span>
            </button>
          </div>
        </div>

        {/* Right Column: Listing & Filters */}
        <div className="space-y-6 lg:col-span-2">
          {/* Filter Bar */}
          <div className="bg-white border border-brand-border p-5 rounded-3xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              {/* Rating Filter */}
              <div className="relative">
                <select
                  value={filterRating}
                  onChange={(e) => setFilterRating(e.target.value)}
                  className="appearance-none pl-4 pr-10 py-2.5 bg-brand-beige border border-brand-border rounded-xl text-xs font-bold text-brand-text focus:outline-none focus:border-brand-accent cursor-pointer"
                >
                  <option value="all">Toutes les notes</option>
                  <option value="5">5 Étoiles</option>
                  <option value="4">4 Étoiles</option>
                  <option value="3">3 Étoiles</option>
                </select>
                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-brand-muted pointer-events-none" />
              </div>

              {/* Vehicle Filter */}
              <div className="relative">
                <select
                  value={filterVehicle}
                  onChange={(e) => setFilterVehicle(e.target.value)}
                  className="appearance-none pl-4 pr-10 py-2.5 bg-brand-beige border border-brand-border rounded-xl text-xs font-bold text-brand-text focus:outline-none focus:border-brand-accent cursor-pointer"
                >
                  <option value="all">Tous les véhicules</option>
                  <option value="van">Vans uniquement</option>
                  <option value="fourgon">Fourgons uniquement</option>
                  <option value="cc">Camping-cars uniquement</option>
                </select>
                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-brand-muted pointer-events-none" />
              </div>
            </div>

            {/* Sorting Filter */}
            <div className="flex items-center space-x-2">
              <span className="text-[10px] uppercase font-extrabold text-brand-muted tracking-wider">Trier par:</span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none pl-4 pr-10 py-2 bg-transparent border-0 font-bold text-brand-accent text-xs focus:outline-none cursor-pointer hover:underline"
                >
                  <option value="recent">Plus récents</option>
                  <option value="top">Meilleures notes</option>
                  <option value="low">Moins bonnes notes</option>
                  <option value="popular">Les plus utiles</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-brand-accent pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Review List */}
          <div className="space-y-4">
            {filteredReviews.length === 0 ? (
              <div className="bg-white border border-brand-border p-12 text-center rounded-3xl space-y-3">
                <MessageSquare className="w-12 h-12 text-brand-muted/40 mx-auto" />
                <h4 className="font-extrabold text-brand-text">Aucun avis trouvé</h4>
                <p className="text-xs text-brand-muted max-w-sm mx-auto">
                  Ajustez vos filtres pour voir d'autres avis de notre communauté.
                </p>
              </div>
            ) : (
              filteredReviews.map((review) => (
                <div 
                  key={review.id}
                  className="bg-white border border-brand-border p-6 rounded-3xl shadow-sm hover-lift transition-all duration-300 space-y-4"
                >
                  {/* Review Header */}
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-extrabold text-brand-text text-sm">{review.author}</span>
                        {review.verified && (
                          <span className="inline-flex items-center space-x-1 px-2 py-0.5 bg-brand-success/10 text-brand-success rounded-full text-[9px] font-extrabold uppercase tracking-wide">
                            <CheckCircle2 className="w-2.5 h-2.5" />
                            <span>Vérifié</span>
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-brand-muted font-semibold">{review.vehicle}</p>
                    </div>
                    <div className="flex items-center space-x-1 text-brand-muted text-[10px] font-semibold">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{review.date}</span>
                    </div>
                  </div>

                  {/* Rating Stars & Title */}
                  <div className="space-y-1">
                    <div className="flex text-[#F59E0B] space-x-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 fill-current ${i < review.rating ? 'text-[#F59E0B]' : 'text-brand-border'}`} 
                        />
                      ))}
                    </div>
                    <h4 className="font-extrabold text-brand-text text-sm md:text-base leading-snug">
                      "{review.title}"
                    </h4>
                  </div>

                  {/* Comment */}
                  <p className="text-xs md:text-sm text-brand-muted leading-relaxed">
                    {review.comment}
                  </p>

                  {/* Review Action (Likes) */}
                  <div className="pt-4 border-t border-brand-border flex items-center justify-between">
                    <button
                      onClick={() => handleLike(review.id)}
                      className="flex items-center space-x-1.5 text-[10px] font-bold text-brand-muted hover:text-brand-accent transition-colors duration-200"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>Utile ({review.likes})</span>
                    </button>
                    <span className="text-[9px] font-semibold text-brand-muted/70">Signaler un abus</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Toast Notification Success */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-brand-success text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center space-x-3 border border-white/10 animate-scale-up">
          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
            <Check className="w-4 h-4" />
          </div>
          <div className="space-y-0.5">
            <p className="text-xs font-bold">Avis publié avec succès !</p>
            <p className="text-[10px] text-white/80">Merci d'avoir partagé votre expérience avec Cap Aventure.</p>
          </div>
        </div>
      )}

      {/* Write Review Modal Popup */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-text/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white border border-brand-border w-full max-w-lg rounded-3xl p-8 shadow-2xl space-y-6 relative overflow-hidden animate-scale-up">
            
            {/* Header */}
            <div className="space-y-1">
              <h3 className="text-xl font-extrabold text-brand-text">Partagez votre expérience</h3>
              <p className="text-xs text-brand-muted">
                Dites-nous ce que vous avez pensé de votre location chez Cap Aventure.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleAddReview} className="space-y-4">
              {/* Star selector */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-extrabold uppercase text-brand-muted tracking-wider">
                  Votre note globale
                </label>
                <div className="flex space-x-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(null)}
                      className="p-1 text-[#F59E0B] focus:outline-none transition-transform hover:scale-115 cursor-pointer"
                    >
                      <Star 
                        className={`w-7 h-7 fill-current ${
                          (hoverRating !== null ? star <= hoverRating : star <= newRating) 
                            ? 'text-[#F59E0B]' 
                            : 'text-brand-border'
                        }`} 
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Name & Vehicle fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-extrabold uppercase text-brand-muted tracking-wider">
                    Votre prénom & nom
                  </label>
                  <input
                    type="text"
                    required
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    placeholder="Ex: David M."
                    className="w-full px-4 py-3 bg-brand-beige border border-brand-border rounded-xl text-xs focus:outline-none focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/15"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-extrabold uppercase text-brand-muted tracking-wider">
                    Véhicule loué
                  </label>
                  <div className="relative">
                    <select
                      value={newVehicle}
                      onChange={(e) => setNewVehicle(e.target.value)}
                      className="w-full appearance-none px-4 py-3 bg-brand-beige border border-brand-border rounded-xl text-xs font-semibold focus:outline-none focus:border-brand-accent cursor-pointer"
                    >
                      <option value="van_amenege">Van Aménagé</option>
                      <option value="camping_car_profile">Camping-car Profilé</option>
                      <option value="camping_car_integral">Camping-car Intégral</option>
                      <option value="fourgon_amenege">Fourgon Aménagé</option>
                    </select>
                    <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Review Title */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-extrabold uppercase text-brand-muted tracking-wider">
                  Titre de votre avis
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ex: Expérience exceptionnelle, à refaire !"
                  className="w-full px-4 py-3 bg-brand-beige border border-brand-border rounded-xl text-xs focus:outline-none focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/15"
                />
              </div>

              {/* Review Comment */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-extrabold uppercase text-brand-muted tracking-wider">
                  Votre commentaire
                </label>
                <textarea
                  required
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={4}
                  placeholder="Partagez les points forts, la conduite, le confort..."
                  className="w-full px-4 py-3 bg-brand-beige border border-brand-border rounded-xl text-xs focus:outline-none focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/15 resize-none"
                />
              </div>

              {/* Actions Buttons */}
              <div className="pt-4 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-3 text-xs font-bold text-brand-muted hover:text-brand-text hover:bg-brand-hover rounded-xl transition-all duration-200 cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#C9A035] hover:bg-[#A8832A] text-white rounded-xl text-xs font-bold shadow-md transition-all duration-200 cursor-pointer"
                >
                  Publier mon avis
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
