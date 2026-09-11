'use client';

import React, { useState, useRef } from 'react';
import { 
  Upload, 
  Trash2, 
  Star, 
  Plus, 
  Image as ImageIcon, 
  Check, 
  X, 
  ExternalLink,
  MoveUp
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
}

export default function ImageUploader({ images, onChange }: ImageUploaderProps) {
  const [urlInput, setUrlInput] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Suggestions rapides de photos de qualité HD
  const sampleImages = [
    { label: '🚐 Extérieur Van', url: 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&w=1200&q=80' },
    { label: '🛋️ Salon & Banquette', url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80' },
    { label: '🛏️ Couchage Douillet', url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80' },
    { label: '🌲 Spot Nature', url: 'https://images.unsplash.com/photo-1517824806704-9040b037703b?auto=format&fit=crop&w=1200&q=80' },
    { label: '🍳 Cuisine Équipée', url: 'https://images.unsplash.com/photo-1527786356703-4b100091cd2c?auto=format&fit=crop&w=1200&q=80' },
  ];

  // Ajouter une image par URL
  const handleAddUrl = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = urlInput.trim();
    if (!trimmed) return;
    if (images.includes(trimmed)) {
      setUrlInput('');
      return;
    }
    onChange([...images, trimmed]);
    setUrlInput('');
  };

  // Supprimer une image
  const handleRemoveImage = (indexToRemove: number) => {
    const updated = images.filter((_, idx) => idx !== indexToRemove);
    onChange(updated);
  };

  // Définir comme photo principale (déplacer en 1ère position)
  const handleSetAsCover = (index: number) => {
    if (index === 0) return;
    const target = images[index];
    const rest = images.filter((_, idx) => idx !== index);
    onChange([target, ...rest]);
  };

  // Gestion des fichiers locaux (Upload / Drag & Drop) avec compression haute performance et basse consommation mémoire
  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files).filter(file => file.type.startsWith('image/'));
    if (fileArray.length === 0) return;

    const processImage = (file: File): Promise<string> => {
      return new Promise((resolve) => {
        const objectUrl = URL.createObjectURL(file);
        const img = new Image();
        
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxDim = 450; // Ultra léger pour Supabase et réseau mobile 3G/4G
          let width = img.width;
          let height = img.height;

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            // Compression aggressive (0.35) : ~30-40 Ko par photo pour éviter les erreurs HTTP 413 ou QuotaExceeded
            const compressed = canvas.toDataURL('image/jpeg', 0.35);
            resolve(compressed);
          } else {
            resolve('');
          }
          URL.revokeObjectURL(objectUrl);
        };

        img.onerror = () => {
          URL.revokeObjectURL(objectUrl);
          // Fallback de secours si createObjectURL échoue
          const reader = new FileReader();
          reader.onload = (e) => {
            const result = e.target?.result as string;
            resolve(result || '');
          };
          reader.onerror = () => resolve('');
          reader.readAsDataURL(file);
        };

        img.src = objectUrl;
      });
    };

    try {
      const validImages: string[] = [];
      // Traitement séquentiel pour éviter le plantage (Out of Memory) sur mobile
      for (const file of fileArray) {
        const imgBase64 = await processImage(file);
        if (imgBase64.length > 0) {
          validImages.push(imgBase64);
        }
      }
      if (validImages.length > 0) {
        onChange([...images, ...validImages]);
      }
    } catch (err) {
      console.error("Erreur lors du traitement des images", err);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-extrabold uppercase text-brand-muted tracking-wider">
          Galerie Photos du véhicule ({images.length} photo{images.length > 1 ? 's' : ''})
        </label>
        <span className="text-[11px] text-brand-muted">
          La 1ère photo sera la couverture principale
        </span>
      </div>

      {/* Grille des photos actuelles */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
          {images.map((img, idx) => {
            const isCover = idx === 0;
            return (
              <div
                key={idx}
                className={`group relative h-28 sm:h-32 rounded-2xl overflow-hidden border-2 transition-all duration-200 bg-brand-hover shadow-sm ${
                  isCover ? 'border-brand-accent ring-2 ring-brand-accent/20' : 'border-brand-border hover:border-brand-accent/50'
                }`}
              >
                <img
                  src={img}
                  alt={`Photo ${idx + 1}`}
                  className="w-full h-full object-cover"
                />

                {/* Badge Couverture sur la 1ère */}
                {isCover && (
                  <div className="absolute top-2 left-2 z-10">
                    <Badge variant="gold" size="sm" icon={<Star className="w-3 h-3 fill-current" />}>
                      Principale
                    </Badge>
                  </div>
                )}

                {/* Overlay d'actions sur Desktop (au hover) + Boutons permanents tactiles sur Mobile */}
                <div className="absolute inset-0 bg-brand-navy/60 backdrop-blur-xs opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2 p-2 pointer-events-auto">
                  {!isCover && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSetAsCover(idx);
                      }}
                      className="p-2 bg-white/95 text-brand-navy hover:bg-brand-accent hover:text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer active:scale-95 min-w-[34px] min-h-[34px] flex items-center justify-center"
                      title="Définir comme photo de couverture"
                      aria-label="Définir comme photo de couverture"
                    >
                      <Star className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveImage(idx);
                    }}
                    className="p-2 bg-brand-error text-white hover:bg-red-700 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer active:scale-95 min-w-[34px] min-h-[34px] flex items-center justify-center"
                    title="Supprimer cette photo"
                    aria-label="Supprimer cette photo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Numéro d'ordre */}
                <div className="absolute bottom-1.5 right-1.5 bg-black/70 backdrop-blur-sm px-1.5 py-0.5 rounded-md text-[9px] font-mono text-white pointer-events-none">
                  #{idx + 1}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Zone de Drag & Drop + Upload Fichier */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-4 sm:p-6 text-center cursor-pointer transition-all duration-200 ${
          dragActive
            ? 'border-brand-accent bg-brand-gold-light/40 scale-[1.01]'
            : 'border-brand-border hover:border-brand-accent/60 bg-brand-beige/50 hover:bg-brand-hover/80 active:bg-brand-hover'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <div className="flex flex-col items-center space-y-2">
          <div className="p-3 bg-white rounded-2xl shadow-sm text-brand-accent border border-brand-border">
            <Upload className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-brand-text">
              <span className="sm:hidden">Touchez pour prendre une photo ou choisir un fichier</span>
              <span className="hidden sm:inline">Glissez-déposez vos photos ici, ou <span className="text-brand-accent underline">parcourez vos fichiers</span></span>
            </p>
            <p className="text-[11px] text-brand-muted mt-0.5">
              PNG, JPG, WEBP • Compression auto optimisée smartphone & réseau mobile
            </p>
          </div>
        </div>
      </div>

      {/* Ajout manuel par URL */}
      <div className="space-y-2.5 pt-1">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-brand-muted">
              <ImageIcon className="w-4 h-4" />
            </span>
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddUrl();
                }
              }}
              placeholder="Ou collez une URL directe (https://...)"
              className="w-full pl-9 pr-4 py-2.5 bg-brand-beige border border-brand-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-accent/30 text-xs font-mono"
            />
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleAddUrl()}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
            className="w-full sm:w-auto justify-center"
          >
            Ajouter URL
          </Button>
        </div>

        {/* Suggestions d'images prédéfinies HD */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[10px] text-brand-muted font-bold block w-full sm:w-auto mb-1 sm:mb-0">
            Photos suggérées :
          </span>
          {sampleImages.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                if (!images.includes(sample.url)) {
                  onChange([...images, sample.url]);
                }
              }}
              className="px-2.5 py-1.5 bg-white hover:bg-brand-gold-light active:bg-brand-gold-light border border-brand-border hover:border-brand-accent/40 rounded-lg text-[10px] font-semibold text-brand-text transition-all cursor-pointer shadow-2xs min-h-[30px]"
            >
              {sample.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
