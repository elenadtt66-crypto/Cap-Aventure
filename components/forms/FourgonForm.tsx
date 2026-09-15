import React from 'react';

interface FourgonFormProps {
  data: {
    sportsEquipmentStorage?: boolean;
    sportsEquipmentType?: string;
    allowPets?: boolean;
    notes?: string;
  };
  onChange: (key: string, value: any) => void;
}

export default function FourgonForm({ data, onChange }: FourgonFormProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h3 className="text-base font-extrabold text-brand-text">Options spécifiques - Fourgon Aménagé</h3>
        <p className="text-xs text-brand-muted mt-1">Préparez le rangement de vos équipements sportifs et de vos compagnons.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Rangement matériel de sport */}
        <div className="space-y-3 p-4 bg-white border border-brand-border rounded-xl">
          <div className="flex items-center space-x-3">
            <input
              id="sportsStorage"
              type="checkbox"
              checked={data.sportsEquipmentStorage || false}
              onChange={(e) => onChange('sportsEquipmentStorage', e.target.checked)}
              className="w-5 h-5 text-brand-accent border-brand-border rounded focus:ring-brand-accent focus:ring-2 transition-all cursor-pointer"
            />
            <label htmlFor="sportsStorage" className="text-xs font-bold text-brand-text cursor-pointer select-none">
              Besoin de soute sportive (Surf, Vélo, Skis)
            </label>
          </div>
          
          {data.sportsEquipmentStorage && (
            <div className="animate-fade-in pt-2">
              <input
                type="text"
                placeholder="Ex: 2 Planches de Surf, 1 Vélo de route..."
                value={data.sportsEquipmentType || ''}
                onChange={(e) => onChange('sportsEquipmentType', e.target.value)}
                className="w-full px-3 py-2 bg-brand-beige border border-brand-border rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-accent text-xs"
              />
            </div>
          )}
        </div>

        {/* Option animaux acceptés */}
        <button
          type="button"
          onClick={() => onChange('allowPets', !data.allowPets)}
          className={`flex items-center space-x-3 p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
            data.allowPets
              ? 'bg-brand-accent/10 border-brand-accent text-brand-accent font-semibold shadow-sm'
              : 'bg-white border-brand-border text-brand-text hover:bg-brand-hover'
          }`}
        >
          <span className="text-xl">🐕</span>
          <div>
            <span className="text-xs font-bold block">Voyage avec un animal</span>
            <span className="text-[10px] text-brand-muted leading-tight block mt-0.5">Autorise la présence de chiens ou chats de petite taille.</span>
          </div>
        </button>
      </div>

      <div className="space-y-2">
        <label htmlFor="notes" className="block text-xs font-extrabold uppercase text-brand-muted tracking-wider">
          Remarques ou besoins particuliers
        </label>
        <textarea
          id="notes"
          rows={3}
          value={data.notes || ''}
          onChange={(e) => onChange('notes', e.target.value)}
          placeholder="Ex: besoin d'un kit de vaisselle pour 4 personnes, cales de stationnement renforcées..."
          className="w-full px-4 py-3 bg-brand-beige border border-brand-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent text-sm"
        />
      </div>
    </div>
  );
}
