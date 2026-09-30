import React from 'react';

interface IntegralFormProps {
  data: {
    hasLargeVehicleExperience?: boolean;
    luxuryLinenPack?: boolean;
    finalCleaningService?: boolean;
    notes?: string;
  };
  onChange: (key: string, value: any) => void;
}

export default function IntegralForm({ data, onChange }: IntegralFormProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h3 className="text-base font-extrabold text-brand-text">Options & Engagements - Camping-car Intégral</h3>
        <p className="text-xs text-brand-muted mt-1">Les camping-cars intégraux font plus de 7 mètres et nécessitent des options et attestations spécifiques.</p>
      </div>

      {/* Attestation expérience conduite */}
      <div className="flex items-start space-x-3 p-4 bg-brand-accent/5 border border-brand-accent/20 rounded-xl">
        <input
          id="largeVehicleExp"
          type="checkbox"
          checked={data.hasLargeVehicleExperience || false}
          onChange={(e) => onChange('hasLargeVehicleExperience', e.target.checked)}
          className="w-5 h-5 text-brand-accent border-brand-border rounded focus:ring-brand-accent focus:ring-2 transition-all cursor-pointer mt-0.5"
        />
        <div className="space-y-1">
          <label htmlFor="largeVehicleExp" className="text-xs font-bold text-brand-text cursor-pointer select-none">
            Attestation d'expérience de conduite *
          </label>
          <p className="text-[10px] text-brand-muted leading-tight">
            Je certifie avoir déjà conduit des véhicules volumineux (camionnettes, utilitaires ou camping-cars de plus de 6,5m) ou avoir plus de 5 ans de permis B actif.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Pack draps luxe */}
        <button
          type="button"
          onClick={() => onChange('luxuryLinenPack', !data.luxuryLinenPack)}
          className={`flex items-center space-x-3 p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
            data.luxuryLinenPack
              ? 'bg-brand-accent/10 border-brand-accent text-brand-accent font-semibold shadow-sm'
              : 'bg-white border-brand-border text-brand-text hover:bg-brand-hover'
          }`}
        >
          <span className="text-xl">🛏️</span>
          <div>
            <span className="text-xs font-bold block">Pack Linge & Draps Luxe</span>
            <span className="text-[10px] text-brand-muted leading-tight block mt-0.5">Draps brodés, oreillers et serviettes de bain premium.</span>
          </div>
        </button>

        {/* Forfait ménage de fin de séjour */}
        <button
          type="button"
          onClick={() => onChange('finalCleaningService', !data.finalCleaningService)}
          className={`flex items-center space-x-3 p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
            data.finalCleaningService
              ? 'bg-brand-accent/10 border-brand-accent text-brand-accent font-semibold shadow-sm'
              : 'bg-white border-brand-border text-brand-text hover:bg-brand-hover'
          }`}
        >
          <span className="text-xl">🧹</span>
          <div>
            <span className="text-xs font-bold block">Ménage de Fin de Séjour</span>
            <span className="text-[10px] text-brand-muted leading-tight block mt-0.5">Rendez le camping-car sans vous soucier du nettoyage.</span>
          </div>
        </button>
      </div>

      <div className="space-y-2">
        <label htmlFor="notes" className="block text-xs font-extrabold uppercase text-brand-muted tracking-wider">
          Remarques ou demandes spéciales
        </label>
        <textarea
          id="notes"
          rows={3}
          value={data.notes || ''}
          onChange={(e) => onChange('notes', e.target.value)}
          placeholder="Ex: demande de convertisseur 12v/220v supplémentaire pour équipement médical, etc..."
          className="w-full px-4 py-3 bg-brand-beige border border-brand-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent text-sm"
        />
      </div>
    </div>
  );
}
