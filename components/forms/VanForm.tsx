import React from 'react';

interface VanFormProps {
  data: {
    outdoorShower?: boolean;
    portableToilet?: boolean;
    roofTent?: boolean;
    notes?: string;
  };
  onChange: (key: string, value: any) => void;
}

export default function VanForm({ data, onChange }: VanFormProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h3 className="text-base font-extrabold text-brand-text">Options spécifiques - Van Aménagé</h3>
        <p className="text-xs text-brand-muted mt-1">Personnalisez vos équipements outdoor pour votre roadtrip compact.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Douchette extérieure */}
        <button
          type="button"
          onClick={() => onChange('outdoorShower', !data.outdoorShower)}
          className={`flex flex-col items-start p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
            data.outdoorShower
              ? 'bg-brand-accent/10 border-brand-accent text-brand-accent font-semibold shadow-sm'
              : 'bg-white border-brand-border text-brand-text hover:bg-brand-hover'
          }`}
        >
          <span className="text-lg mb-2">🚿</span>
          <span className="text-xs font-bold">Douchette Extérieure</span>
          <span className="text-[10px] text-brand-muted mt-1 leading-tight">Douche solaire portable sous pression.</span>
        </button>

        {/* Toilette portable */}
        <button
          type="button"
          onClick={() => onChange('portableToilet', !data.portableToilet)}
          className={`flex flex-col items-start p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
            data.portableToilet
              ? 'bg-brand-accent/10 border-brand-accent text-brand-accent font-semibold shadow-sm'
              : 'bg-white border-brand-border text-brand-text hover:bg-brand-hover'
          }`}
        >
          <span className="text-lg mb-2">🚽</span>
          <span className="text-xs font-bold">WC Chimiques Portables</span>
          <span className="text-[10px] text-brand-muted mt-1 leading-tight">Toilette Porta Potti avec produits biodégradables.</span>
        </button>

        {/* Tente de toit */}
        <button
          type="button"
          onClick={() => onChange('roofTent', !data.roofTent)}
          className={`flex flex-col items-start p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
            data.roofTent
              ? 'bg-brand-accent/10 border-brand-accent text-brand-accent font-semibold shadow-sm'
              : 'bg-white border-brand-border text-brand-text hover:bg-brand-hover'
          }`}
        >
          <span className="text-lg mb-2">⛺</span>
          <span className="text-xs font-bold">Tente de Toit (+2 Couchages)</span>
          <span className="text-[10px] text-brand-muted mt-1 leading-tight">Pour passer à 4 couchages confortables.</span>
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
          placeholder="Ex: besoin d'un porte-vélo additionnel, voyage avec de jeunes enfants..."
          className="w-full px-4 py-3 bg-brand-beige border border-brand-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent text-sm"
        />
      </div>
    </div>
  );
}
