import React from 'react';

interface ProfileFormProps {
  data: {
    bedLayout?: 'JUMEAUX' | 'CENTRAL';
    bikeRackCount?: number;
    notes?: string;
  };
  onChange: (key: string, value: any) => void;
}

export default function ProfileForm({ data, onChange }: ProfileFormProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h3 className="text-base font-extrabold text-brand-text">Options spécifiques - Camping-car Profilé</h3>
        <p className="text-xs text-brand-muted mt-1">Configurez l'aménagement et le rangement de votre camping-car.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Configuration des lits */}
        <div className="space-y-2">
          <label className="block text-xs font-extrabold uppercase text-brand-muted tracking-wider">
            Configuration Lit Arrière *
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => onChange('bedLayout', 'CENTRAL')}
              className={`py-3 px-4 rounded-xl border text-center text-sm font-semibold transition-all duration-200 cursor-pointer ${
                data.bedLayout === 'CENTRAL'
                  ? 'bg-brand-accent/10 border-brand-accent text-brand-accent shadow-sm'
                  : 'bg-white border-brand-border text-brand-text hover:bg-brand-hover'
              }`}
            >
              🛌 Lit Central (Grand lit)
            </button>
            <button
              type="button"
              onClick={() => onChange('bedLayout', 'JUMEAUX')}
              className={`py-3 px-4 rounded-xl border text-center text-sm font-semibold transition-all duration-200 cursor-pointer ${
                data.bedLayout === 'JUMEAUX'
                  ? 'bg-brand-accent/10 border-brand-accent text-brand-accent shadow-sm'
                  : 'bg-white border-brand-border text-brand-text hover:bg-brand-hover'
              }`}
            >
              🛏️ Lits Jumeaux (Sujets séparés)
            </button>
          </div>
        </div>

        {/* Porte-vélos */}
        <div className="space-y-2">
          <label htmlFor="bikeRackCount" className="block text-xs font-extrabold uppercase text-brand-muted tracking-wider">
            Porte-Vélos (Nombre de vélos)
          </label>
          <select
            id="bikeRackCount"
            value={data.bikeRackCount || 0}
            onChange={(e) => onChange('bikeRackCount', parseInt(e.target.value) || 0)}
            className="w-full px-4 py-3 bg-brand-beige border border-brand-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent text-sm"
          >
            <option value={0}>Aucun porte-vélo</option>
            <option value={2}>Pour 2 vélos</option>
            <option value={3}>Pour 3 vélos</option>
            <option value={4}>Pour 4 vélos</option>
          </select>
        </div>
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
          placeholder="Ex: besoin de chaînes à neige, ustensiles de cuisine spécifiques..."
          className="w-full px-4 py-3 bg-brand-beige border border-brand-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent text-sm"
        />
      </div>
    </div>
  );
}
