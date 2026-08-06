'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight, 
  Maximize2,
  X,
  MapPin,
  Calendar,
  Heart
} from 'lucide-react';

interface CommunityPhoto {
  id: number;
  url: string;
  location: string;
  author: string;
  date: string;
  likes: number;
}

export default function PhotosCommunautePage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPhoto, setSelectedPhoto] = useState<CommunityPhoto | null>(null);

  const [photosList, setPhotosList] = useState<CommunityPhoto[]>([
    // Page 1 Photos
    { id: 1, url: "https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&w=800&q=80", location: "Étretat, France", author: "Sophie & Marc", date: "Juin 2026", likes: 142 },
    { id: 2, url: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80", location: "Dinant, Belgique", author: "Jean-Pierre", date: "Mai 2026", likes: 98 },
    { id: 3, url: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80", location: "Gorges du Verdon, France", author: "Lucas", date: "Juin 2026", likes: 215 },
    { id: 4, url: "https://images.unsplash.com/photo-1473862170180-84427c485ade?auto=format&fit=crop&w=800&q=80", location: "Bruges, Belgique", author: "Amélie", date: "Avril 2026", likes: 187 },
    { id: 5, url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80", location: "Chamonix Mont-Blanc, France", author: "Thomas", date: "Mai 2026", likes: 312 },
    { id: 6, url: "https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=800&q=80", location: "Les Ardennes, Belgique", author: "Chantal & Rémi", date: "Mars 2026", likes: 88 },
    { id: 7, url: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80", location: "Bordeaux, France", author: "Youssef", date: "Janvier 2026", likes: 154 },
    { id: 8, url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80", location: "Bruxelles, Belgique", author: "Marie & Paul", date: "Février 2026", likes: 241 },
    { id: 9, url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80", location: "Normandie, France", author: "Nicolas", date: "Avril 2026", likes: 119 },
    { id: 10, url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80", location: "Namur, Belgique", author: "Sarah", date: "Mai 2026", likes: 176 },
    { id: 11, url: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=800&q=80", location: "Val de Loire, France", author: "David", date: "Juin 2026", likes: 203 },
    { id: 12, url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80", location: "Gand, Belgique", author: "Emma", date: "Avril 2026", likes: 134 },

    // Page 2 Photos
    { id: 13, url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80", location: "Bretagne, France", author: "Romain", date: "Septembre 2025", likes: 95 },
    { id: 14, url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=800&q=80", location: "Durbuy, Belgique", author: "Clara", date: "Août 2025", likes: 112 },
    { id: 15, url: "https://images.unsplash.com/photo-1563200787-17e923e4299b?auto=format&fit=crop&w=800&q=80", location: "Côte d'Azur, France", author: "Julien", date: "Juillet 2025", likes: 167 },
    { id: 16, url: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=800&q=80", location: "Anvers, Belgique", author: "Pierre", date: "Octobre 2025", likes: 84 },
    { id: 17, url: "https://images.unsplash.com/photo-1543872084-c7bd3822856f?auto=format&fit=crop&w=800&q=80", location: "Haute-Savoie, France", author: "Mélanie", date: "Août 2025", likes: 198 },
    { id: 18, url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80", location: "Liège, Belgique", author: "Arthur", date: "Novembre 2025", likes: 73 },
    { id: 19, url: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80", location: "Corse, France", author: "Mathilde", date: "Juin 2025", likes: 259 },
    { id: 20, url: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80", location: "Spa, Belgique", author: "Hugo", date: "Mai 2025", likes: 91 },
    { id: 21, url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80", location: "Biarritz, France", author: "Camille", date: "Juillet 2025", likes: 139 },
    { id: 22, url: "https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?auto=format&fit=crop&w=800&q=80", location: "Ostende, Belgique", author: "Hendrik", date: "Août 2025", likes: 104 },
    { id: 23, url: "https://images.unsplash.com/photo-1532274402911-5a369e4c4bb5?auto=format&fit=crop&w=800&q=80", location: "Dordogne, France", author: "Adrien", date: "Septembre 2025", likes: 115 },
    { id: 24, url: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=800&q=80", location: "Bouillon, Belgique", author: "Stéphane", date: "Octobre 2025", likes: 96 },

    // Page 3 Photos
    { id: 25, url: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=800&q=80", location: "Vercors, France", author: "Benoît", date: "Novembre 2025", likes: 147 },
    { id: 26, url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80", location: "Knokke-Heist, Belgique", author: "Annelies", date: "Décembre 2025", likes: 110 },
    { id: 27, url: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=800&q=80", location: "Alsace, France", author: "Céline", date: "Octobre 2025", likes: 125 },
    { id: 28, url: "https://images.unsplash.com/photo-1472214222541-d510753a8707?auto=format&fit=crop&w=800&q=80", location: "Ypres, Belgique", author: "Dieter", date: "Septembre 2025", likes: 78 },
    { id: 29, url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800&q=80", location: "Mercantour, France", author: "Juliane", date: "Août 2025", likes: 219 },
    { id: 30, url: "https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=800&q=80", location: "Mons, Belgique", author: "Geert", date: "Juillet 2025", likes: 64 },
    { id: 31, url: "https://images.unsplash.com/photo-1444464666168-49d633b86797?auto=format&fit=crop&w=800&q=80", location: "Jura, France", author: "François", date: "Juin 2025", likes: 133 },
    { id: 32, url: "https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&w=800&q=80", location: "Malmedy, Belgique", author: "Lara", date: "Mai 2025", likes: 102 },
    { id: 33, url: "https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?auto=format&fit=crop&w=800&q=80", location: "Landes, France", author: "Guillaume", date: "Avril 2025", likes: 175 },
    { id: 34, url: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=800&q=80", location: "Hautes Fagnes, Belgique", author: "Katrien", date: "Mars 2025", likes: 89 },
    { id: 35, url: "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&w=800&q=80", location: "Ardèche, France", author: "Cédric", date: "Février 2025", likes: 211 },
    { id: 36, url: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=800&q=80", location: "Rochefort, Belgique", author: "Baudouin", date: "Janvier 2025", likes: 76 },

    // Page 4 Photos
    { id: 37, url: "https://images.unsplash.com/photo-1500627869374-13cd993b1115?auto=format&fit=crop&w=800&q=80", location: "Calanques de Cassis, France", author: "Thibault", date: "Décembre 2024", likes: 284 },
    { id: 38, url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80", location: "Coxyde, Belgique", author: "Jonas", date: "Novembre 2024", likes: 122 },
    { id: 39, url: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80", location: "Pyrénées, France", author: "Audrey", date: "Octobre 2024", likes: 319 },
    { id: 40, url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80", location: "Dinant Citadelle, Belgique", author: "Philippe", date: "Septembre 2024", likes: 105 },
    { id: 41, url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80", location: "Auvergne, France", author: "Valentin", date: "Août 2024", likes: 146 },
    { id: 42, url: "https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?auto=format&fit=crop&w=800&q=80", location: "Tournai, Belgique", author: "Charlotte", date: "Juillet 2024", likes: 89 },
    { id: 43, url: "https://images.unsplash.com/photo-1532274402911-5a369e4c4bb5?auto=format&fit=crop&w=800&q=80", location: "Gironde, France", author: "Mathieu", date: "Juin 2024", likes: 172 },
    { id: 44, url: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=800&q=80", location: "Herve, Belgique", author: "Nathalie", date: "Mai 2024", likes: 65 },
    { id: 45, url: "https://images.unsplash.com/photo-1486916856992-e4db22c8df33?auto=format&fit=crop&w=800&q=80", location: "Finistère, France", author: "Alexandre", date: "Avril 2024", likes: 201 },
    { id: 46, url: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80", location: "Bastogne, Belgique", author: "Michel", date: "Mars 2024", likes: 82 },
    { id: 47, url: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=800&q=80", location: "Luberon, France", author: "Elise", date: "Février 2024", likes: 194 },
    { id: 48, url: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80", location: "Saint-Hubert, Belgique", author: "Laurent", date: "Janvier 2024", likes: 153 }
  ]);

  const displayedPhotos = useMemo(() => {
    const startIndex = (currentPage - 1) * 12;
    return photosList.slice(startIndex, startIndex + 12);
  }, [currentPage, photosList]);

  const totalPages = Math.ceil(photosList.length / 12);

  const handleLike = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setPhotosList(photosList.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p));
    if (selectedPhoto && selectedPhoto.id === id) {
      setSelectedPhoto({ ...selectedPhoto, likes: selectedPhoto.likes + 1 });
    }
  };

  return (
    <main className="flex-1 bg-white min-h-screen pb-24 relative overflow-hidden">
      {/* Background grain noise visual overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] grain-bg"></div>

      {/* Sub-navigation Tabs */}
      <div className="bg-white border-b border-brand-border">
        <div className="max-w-6xl mx-auto px-6 flex justify-center md:justify-start space-x-8">
          <Link 
            href="/avis"
            className="py-4 text-xs font-bold transition-all text-brand-muted hover:text-brand-text"
          >
            Avis de la communauté
          </Link>
          <Link 
            href="/communaute/photos"
            className="py-4 text-xs font-bold transition-all border-b-2 border-[#C9A035] text-brand-text"
          >
            Photos de la communauté
          </Link>
        </div>
      </div>

      {/* Content Section */}
      <section className="max-w-6xl mx-auto px-6 py-12 space-y-12 relative z-10">
        
        {/* Back Link & Breadcrumbs */}
        <div className="space-y-4">
          <Link 
            href="/" 
            className="inline-flex items-center space-x-2 text-xs font-bold text-brand-muted hover:text-[#C9A035] transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour à l'accueil</span>
          </Link>
          <div className="text-[10px] font-bold text-brand-muted space-x-1.5 flex items-center">
            <span className="hover:text-brand-text cursor-pointer">Accueil</span>
            <span>/</span>
            <span className="hover:text-brand-text cursor-pointer">La communauté de Cap Aventure</span>
            <span>/</span>
            <span className="text-[#C9A035]">Photos de la communauté</span>
          </div>
        </div>

        {/* Header Block */}
        <div className="space-y-4 max-w-2xl">
          <div className="space-y-2">
            <span className="text-[#C9A035] font-extrabold text-xs uppercase tracking-widest block">
              La communauté de Cap Aventure
            </span>
            <div className="h-1 w-12 bg-[#C9A035] rounded-full"></div>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-brand-text tracking-tight">
            Photos de la communauté
          </h1>
          <p className="text-xs md:text-sm text-brand-muted leading-relaxed">
            Des paysages à couper le souffle et de grands sourires sur les visages... Plongez tête la première dans les plus beaux souvenirs de la communauté de voyageurs Cap Aventure en images.
          </p>
        </div>

        {/* Photo Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {displayedPhotos.map((photo) => (
            <div
              key={photo.id}
              onClick={() => setSelectedPhoto(photo)}
              className="group bg-white border border-brand-border rounded-3xl overflow-hidden hover-lift shadow-sm cursor-pointer flex flex-col justify-between"
            >
              <div className="relative h-60 overflow-hidden bg-[#F2F2F0]">
                <img 
                  src={photo.url} 
                  alt={photo.location} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm w-8 h-8 rounded-full flex items-center justify-center text-brand-text opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:scale-110">
                  <Maximize2 className="w-4 h-4" />
                </div>
              </div>
              <div className="p-4 flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="text-[10px] font-bold text-brand-muted flex items-center">
                    <MapPin className="w-3 h-3 text-[#C9A035] mr-1" />
                    {photo.location}
                  </p>
                  <p className="text-xs font-extrabold text-brand-text">Par {photo.author}</p>
                </div>
                <button
                  onClick={(e) => handleLike(photo.id, e)}
                  className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-full border border-brand-border/60 hover:bg-[#F2F2F0] text-brand-muted hover:text-[#C9A035] transition-all cursor-pointer"
                >
                  <Heart className="w-3.5 h-3.5 fill-current" />
                  <span className="text-[10px] font-extrabold font-mono">{photo.likes}</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Row */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-3 pt-8 border-t border-brand-border/60">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 border border-brand-border rounded-xl bg-white hover:bg-[#F2F2F0] text-brand-text disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }).map((_, i) => {
              const pg = i + 1;
              return (
                <button
                  key={pg}
                  onClick={() => setCurrentPage(pg)}
                  className={`w-9 h-9 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    currentPage === pg
                      ? 'bg-brand-accent border-brand-accent text-white shadow-md shadow-brand-accent/15'
                      : 'bg-white border-brand-border text-brand-text hover:bg-[#F2F2F0]'
                  }`}
                >
                  {pg}
                </button>
              );
            })}
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 border border-brand-border rounded-xl bg-white hover:bg-[#F2F2F0] text-brand-text disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </section>

      {/* Lightbox / Zoom Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="relative max-w-4xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl border border-white/10 flex flex-col md:flex-row h-[500px]">
            {/* Close Button */}
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Photo Column */}
            <div className="flex-1 bg-black relative flex items-center justify-center">
              <img 
                src={selectedPhoto.url} 
                alt={selectedPhoto.location} 
                className="w-full h-full object-contain"
              />
            </div>

            {/* Info Column */}
            <div className="w-full md:w-80 p-8 flex flex-col justify-between bg-white text-brand-text">
              <div className="space-y-6">
                <div className="space-y-2">
                  <span className="text-[#C9A035] font-extrabold text-[10px] uppercase tracking-widest block">Cap Aventure Trip</span>
                  <h3 className="text-xl font-extrabold">{selectedPhoto.location}</h3>
                </div>

                <div className="space-y-3 font-semibold text-xs text-brand-muted">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-[#C9A035]" />
                    <span>Destination : {selectedPhoto.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-[#C9A035]" />
                    <span>Voyage effectué en {selectedPhoto.date}</span>
                  </div>
                  <p className="text-brand-text font-bold pt-2">
                    Témoignage photo partagé par {selectedPhoto.author} lors de son séjour avec Cap Aventure.
                  </p>
                </div>
              </div>

              <div className="border-t border-brand-border/60 pt-6 flex items-center justify-between">
                <button
                  onClick={(e) => handleLike(selectedPhoto.id, e)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-full border border-brand-border/60 hover:bg-[#F2F2F0] text-[#C9A035] font-bold text-xs transition-all cursor-pointer"
                >
                  <Heart className="w-4 h-4 fill-current" />
                  <span>J'aime ({selectedPhoto.likes})</span>
                </button>
                <Link
                  href="/vehicules"
                  onClick={() => setSelectedPhoto(null)}
                  className="px-4 py-2 bg-brand-accent hover:bg-brand-accent-hover text-white rounded-xl text-xs font-bold shadow-sm transition-all"
                >
                  Louer ce véhicule
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
