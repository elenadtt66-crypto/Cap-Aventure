'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Coins, 
  ShieldCheck, 
  CalendarDays, 
  Upload, 
  Check, 
  ChevronRight, 
  Plus, 
  HeartHandshake,
  CheckCircle2,
  HelpCircle,
  Sparkles
} from 'lucide-react';

export default function ProprietairePage() {
  const [formStep, setFormStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);

  // Simulateur de gains
  const [simType, setSimType] = useState('van');
  const [simDays, setSimDays] = useState(30);

  const estimatedGains = useMemo(() => {
    const rates: Record<string, number> = {
      'van': 85,
      'fourgon': 105,
      'profile': 120,
      'integral': 160
    };
    const rate = rates[simType] || 85;
    return rate * simDays;
  }, [simType, simDays]);

  // Formulaire d'annonce
  const [vType, setVType] = useState('van_amenege');
  const [vBrand, setVBrand] = useState('');
  const [vModel, setVModel] = useState('');
  const [vYear, setVYear] = useState('2024');
  const [vPrice, setVPrice] = useState(90);
  const [vDesc, setVDesc] = useState('');
  
  const [ownerName, setOwnerName] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [ownerCity, setOwnerCity] = useState('');

  const [amenities, setAmenities] = useState<string[]>([]);

  const toggleAmenity = (name: string) => {
    if (amenities.includes(name)) {
      setAmenities(amenities.filter(a => a !== name));
    } else {
      setAmenities([...amenities, name]);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formStep < 3) {
      setFormStep(formStep + 1);
    } else {
      setShowSuccess(true);
    }
  };

  const handleReset = () => {
    setFormStep(1);
    setShowSuccess(false);
    setVBrand('');
    setVModel('');
    setVYear('2024');
    setVPrice(90);
    setVDesc('');
    setOwnerName('');
    setOwnerEmail('');
    setOwnerPhone('');
    setOwnerCity('');
    setAmenities([]);
  };

  return (
    <main className="flex-1 bg-brand-beige min-h-screen pb-24 relative overflow-hidden">
      {/* Background grain noise visual overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] grain-bg"></div>

      {/* Hero Banner */}
      <section className="relative bg-brand-text text-white py-20 px-6 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-accent/15 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-accent/5 rounded-full blur-3xl"></div>
        
        <div className="max-w-6xl mx-auto space-y-6 relative z-10">
          <Link 
            href="/" 
            className="inline-flex items-center space-x-2 text-xs font-bold text-white/70 hover:text-brand-secondary transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour à l'accueil</span>
          </Link>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-brand-secondary font-extrabold text-xs uppercase tracking-widest block">
                Espace Propriétaires
              </span>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
                Louez votre véhicule de loisirs en toute sérénité
              </h1>
              <p className="text-sm md:text-base text-white/70 leading-relaxed max-w-lg">
                Rentabilisez votre van ou camping-car lorsqu'il dort au garage. Bénéficiez d'une couverture d'assurance tous risques automatique pour chaque location.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <a
                  href="#create-ad"
                  className="px-6 py-3.5 bg-brand-accent hover:bg-brand-accent-hover text-white rounded-xl text-xs font-extrabold shadow-lg transition-all duration-200"
                >
                  Déposer une annonce gratuite
                </a>
                <a
                  href="#simulator"
                  className="px-6 py-3.5 bg-white/10 hover:bg-white/15 text-white border border-white/20 rounded-xl text-xs font-extrabold transition-all duration-200"
                >
                  Estimer mes gains
                </a>
              </div>
            </div>
            <div className="hidden lg:block relative h-[380px] rounded-3xl overflow-hidden shadow-2xl border border-white/10">
              <img 
                src="https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=800&q=80" 
                alt="Propriétaire heureux"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur p-5 rounded-2xl border border-brand-border text-brand-text flex items-center space-x-4">
                <div className="p-3 bg-brand-accent/10 text-brand-accent rounded-xl">
                  <Coins className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase text-brand-muted">Gains constatés</p>
                  <p className="text-lg font-extrabold">Jusqu'à 3 200€ par an</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits section */}
      <section className="py-20 px-6 max-w-6xl mx-auto w-full space-y-16">
        <div className="text-center max-w-xl mx-auto space-y-4">
          <span className="text-brand-accent font-extrabold text-xs uppercase tracking-widest block">Les avantages</span>
          <h2 className="text-3xl font-extrabold text-brand-text tracking-tight">Pourquoi louer sur Cap Aventure ?</h2>
          <p className="text-xs md:text-sm text-brand-muted leading-relaxed">
            Nous mettons tout en œuvre pour vous offrir une expérience d'une sécurité totale et d'une simplicité absolue.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: Coins,
              title: "Revenus attractifs",
              desc: "Couvrez vos frais annuels d'entretien, de garage et d'assurance en louant seulement quelques semaines par an. Vous fixez vous-même vos prix."
            },
            {
              icon: ShieldCheck,
              title: "Assurance Tous Risques",
              desc: "Votre contrat d'assurance personnel n'est jamais impacté. Chaque location est couverte par notre partenaire assureur à hauteur de 150 000€."
            },
            {
              icon: CalendarDays,
              title: "Contrôle total du calendrier",
              desc: "C'est votre véhicule avant tout. Vous choisissez vos dates de disponibilité, acceptez les profils de locataires qui vous conviennent, et fixez vos conditions."
            }
          ].map((item, idx) => (
            <div key={idx} className="bg-white border border-brand-border p-8 rounded-3xl shadow-sm hover-lift transition-all duration-300 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-accent/10 text-brand-accent flex items-center justify-center">
                <item.icon className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-brand-text text-lg">{item.title}</h3>
              <p className="text-xs text-brand-muted leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Simulator Section */}
      <section id="simulator" className="py-16 bg-[#FAFBF9] border-y border-brand-border px-6">
        <div className="max-w-4xl mx-auto bg-white border border-brand-border rounded-[2.5rem] p-8 md:p-12 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-extrabold text-brand-text tracking-tight leading-tight">
              Combien pouvez-vous gagner ?
            </h2>
            <p className="text-xs text-brand-muted leading-relaxed">
              Sélectionnez votre type de véhicule et faites glisser le curseur pour estimer vos revenus locatifs potentiels par an.
            </p>
            
            {/* Type selector */}
            <div className="space-y-2">
              <label className="block text-[10px] font-extrabold uppercase text-brand-muted tracking-wider">Type de véhicule</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { key: 'van', label: 'Van Aménagé' },
                  { key: 'fourgon', label: 'Fourgon' },
                  { key: 'profile', label: 'CC Profilé' },
                  { key: 'integral', label: 'CC Intégral' }
                ].map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setSimType(t.key)}
                    className={`py-2 px-4 rounded-xl text-xs font-bold border transition-all duration-200 cursor-pointer ${
                      simType === t.key 
                        ? 'bg-brand-accent border-brand-accent text-white shadow-md shadow-brand-accent/15'
                        : 'bg-brand-beige border-brand-border text-brand-text hover:bg-brand-hover'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Days slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-brand-muted">Nombre de jours loués / an</span>
                <span className="text-brand-accent">{simDays} jours</span>
              </div>
              <input 
                type="range" 
                min="5" 
                max="90" 
                value={simDays}
                onChange={(e) => setSimDays(parseInt(e.target.value))}
                className="w-full h-2 bg-brand-beige rounded-lg appearance-none cursor-pointer accent-brand-accent"
              />
            </div>
          </div>

          {/* Results Block */}
          <div className="bg-brand-beige/50 border border-brand-border p-8 rounded-3xl text-center space-y-6 flex flex-col justify-center items-center">
            <p className="text-xs font-bold uppercase text-brand-muted tracking-wider">Gains annuels estimés</p>
            <div className="space-y-1">
              <p className="text-4xl md:text-5xl font-extrabold text-brand-accent tracking-tight font-mono">
                {estimatedGains} €
              </p>
              <p className="text-[10px] text-brand-muted font-medium">Taux moyen journalier appliqué</p>
            </div>
            <div className="border-t border-brand-border/60 pt-4 w-full text-[10px] text-brand-muted space-y-1.5 font-medium leading-relaxed">
              <p>✓ Assurance tous risques incluse</p>
              <p>✓ Frais de service et gestion du dossier inclus</p>
              <p>✓ Assistance routière 24h/24 & 7j/7</p>
            </div>
          </div>
        </div>
      </section>

      {/* Ad Creation Form Section */}
      <section id="create-ad" className="py-20 px-6 max-w-4xl mx-auto w-full">
        {showSuccess ? (
          <div className="bg-white border border-brand-border p-12 rounded-[2.5rem] shadow-lg text-center space-y-6 animate-scale-up">
            <div className="w-16 h-16 rounded-full bg-brand-success/10 text-brand-success flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl md:text-3xl font-extrabold text-brand-text">Félicitations !</h2>
              <p className="text-sm text-brand-muted max-w-md mx-auto leading-relaxed">
                Votre annonce pour le véhicule <span className="font-bold text-brand-text">{vBrand} {vModel}</span> a été soumise avec succès à l'équipe Cap Aventure. Nous la validerons et la mettrons en ligne sous 24h.
              </p>
            </div>
            <div className="pt-4 flex justify-center space-x-4">
              <button
                onClick={handleReset}
                className="px-6 py-3 bg-brand-accent hover:bg-brand-accent-hover text-white rounded-xl text-xs font-extrabold shadow-md cursor-pointer"
              >
                Créer une autre annonce
              </button>
              <Link
                href="/"
                className="px-6 py-3 bg-brand-beige hover:bg-brand-hover text-brand-text border border-brand-border rounded-xl text-xs font-extrabold cursor-pointer"
              >
                Retour à l'accueil
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-brand-border rounded-[2.5rem] p-8 md:p-12 shadow-md space-y-8">
            <div className="flex items-center justify-between border-b border-brand-border pb-6">
              <div className="space-y-1">
                <h2 className="text-2xl font-extrabold text-brand-text tracking-tight">Déposez votre annonce</h2>
                <p className="text-xs text-brand-muted">Mettez en location votre van ou camping-car en quelques étapes simples.</p>
              </div>
              <div className="flex items-center space-x-2 text-xs font-bold text-brand-accent">
                <span>Étape {formStep} sur 3</span>
              </div>
            </div>

            {/* Steps indicator */}
            <div className="flex items-center space-x-2">
              {[1, 2, 3].map((step) => (
                <div 
                  key={step}
                  className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                    step <= formStep ? 'bg-brand-accent' : 'bg-brand-beige'
                  }`}
                />
              ))}
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-8">
              
              {/* STEP 1: INFORMATIONS DU VÉHICULE */}
              {formStep === 1 && (
                <div className="space-y-6 animate-fade-in">
                  <h3 className="text-lg font-bold text-brand-text flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-brand-accent/10 text-brand-accent flex items-center justify-center text-xs">1</span>
                    Caractéristiques du véhicule
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-[10px] font-extrabold uppercase text-brand-muted tracking-wider">Catégorie du véhicule</label>
                      <select
                        value={vType}
                        onChange={(e) => setVType(e.target.value)}
                        className="w-full px-4 py-3 bg-brand-beige border border-brand-border rounded-xl text-xs font-semibold focus:outline-none focus:border-brand-accent cursor-pointer"
                      >
                        <option value="van_amenege">Van Aménagé</option>
                        <option value="camping_car_profile">Camping-car Profilé</option>
                        <option value="camping_car_integral">Camping-car Intégral</option>
                        <option value="fourgon_amenege">Fourgon Aménagé</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-[10px] font-extrabold uppercase text-brand-muted tracking-wider">Année de mise en circulation</label>
                      <select
                        value={vYear}
                        onChange={(e) => setVYear(e.target.value)}
                        className="w-full px-4 py-3 bg-brand-beige border border-brand-border rounded-xl text-xs font-semibold focus:outline-none focus:border-brand-accent cursor-pointer"
                      >
                        {Array.from({ length: 15 }).map((_, i) => {
                          const yr = String(new Date().getFullYear() - i);
                          return <option key={yr} value={yr}>{yr}</option>;
                        })}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-[10px] font-extrabold uppercase text-brand-muted tracking-wider">Marque</label>
                      <input
                        type="text"
                        required
                        value={vBrand}
                        onChange={(e) => setVBrand(e.target.value)}
                        placeholder="Ex: Volkswagen, Challenger, Rapido"
                        className="w-full px-4 py-3 bg-brand-beige border border-brand-border rounded-xl text-xs focus:outline-none focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/15"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-[10px] font-extrabold uppercase text-brand-muted tracking-wider">Modèle</label>
                      <input
                        type="text"
                        required
                        value={vModel}
                        onChange={(e) => setVModel(e.target.value)}
                        placeholder="Ex: California T6, Graphite 260"
                        className="w-full px-4 py-3 bg-brand-beige border border-brand-border rounded-xl text-xs focus:outline-none focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/15"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: DÉTAILS, PRIX & ÉQUIPEMENTS */}
              {formStep === 2 && (
                <div className="space-y-6 animate-fade-in">
                  <h3 className="text-lg font-bold text-brand-text flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-brand-accent/10 text-brand-accent flex items-center justify-center text-xs">2</span>
                    Tarifs & Équipements
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <label className="block text-[10px] font-extrabold uppercase text-brand-muted tracking-wider">Tarif souhaité / jour</label>
                        <span className="text-xs font-bold text-brand-accent">{vPrice} €</span>
                      </div>
                      <input 
                        type="range" 
                        min="50" 
                        max="300" 
                        value={vPrice}
                        onChange={(e) => setVPrice(parseInt(e.target.value))}
                        className="w-full h-2 bg-brand-beige rounded-lg appearance-none cursor-pointer accent-brand-accent"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-[10px] font-extrabold uppercase text-brand-muted tracking-wider">Description de votre véhicule</label>
                      <textarea
                        required
                        value={vDesc}
                        onChange={(e) => setVDesc(e.target.value)}
                        rows={3}
                        placeholder="Décrivez l'aménagement, l'état général de conduite, la literie, etc."
                        className="w-full px-4 py-3 bg-brand-beige border border-brand-border rounded-xl text-xs focus:outline-none focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/15 resize-none"
                      />
                    </div>
                  </div>

                  {/* Amenities checklist */}
                  <div className="space-y-3">
                    <label className="block text-[10px] font-extrabold uppercase text-brand-muted tracking-wider">Équipements inclus</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {[
                        "GPS Intégré",
                        "Chauffage stationnaire",
                        "Climatisation",
                        "Porte-vélos",
                        "Store extérieur",
                        "Caméra de recul",
                        "Panneau solaire",
                        "Cuisine équipée",
                        "Animaux acceptés"
                      ].map((item) => {
                        const isChecked = amenities.includes(item);
                        return (
                          <button
                            key={item}
                            type="button"
                            onClick={() => toggleAmenity(item)}
                            className={`flex items-center space-x-2 p-3 border rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                              isChecked 
                                ? 'bg-brand-accent/10 border-brand-accent text-brand-accent' 
                                : 'bg-brand-beige border-brand-border text-brand-muted hover:bg-brand-hover'
                            }`}
                          >
                            <span className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${isChecked ? 'bg-brand-accent border-brand-accent text-white' : 'border-brand-muted/40 bg-white'}`}>
                              {isChecked && <Check className="w-3 h-3" />}
                            </span>
                            <span>{item}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: INFOS PROPRIÉTAIRE & CONFIRMATION */}
              {formStep === 3 && (
                <div className="space-y-6 animate-fade-in">
                  <h3 className="text-lg font-bold text-brand-text flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-brand-accent/10 text-brand-accent flex items-center justify-center text-xs">3</span>
                    Vos coordonnées
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-[10px] font-extrabold uppercase text-brand-muted tracking-wider">Votre nom complet</label>
                      <input
                        type="text"
                        required
                        value={ownerName}
                        onChange={(e) => setOwnerName(e.target.value)}
                        placeholder="Ex: Robert Durand"
                        className="w-full px-4 py-3 bg-brand-beige border border-brand-border rounded-xl text-xs focus:outline-none focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/15"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-[10px] font-extrabold uppercase text-brand-muted tracking-wider">Ville de stationnement du véhicule</label>
                      <input
                        type="text"
                        required
                        value={ownerCity}
                        onChange={(e) => setOwnerCity(e.target.value)}
                        placeholder="Ex: Bordeaux, Cenon"
                        className="w-full px-4 py-3 bg-brand-beige border border-brand-border rounded-xl text-xs focus:outline-none focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/15"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-[10px] font-extrabold uppercase text-brand-muted tracking-wider">Adresse email</label>
                      <input
                        type="email"
                        required
                        value={ownerEmail}
                        onChange={(e) => setOwnerEmail(e.target.value)}
                        placeholder="Ex: robert.durand@gmail.com"
                        className="w-full px-4 py-3 bg-brand-beige border border-brand-border rounded-xl text-xs focus:outline-none focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/15"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-[10px] font-extrabold uppercase text-brand-muted tracking-wider">Numéro de téléphone</label>
                      <input
                        type="tel"
                        required
                        value={ownerPhone}
                        onChange={(e) => setOwnerPhone(e.target.value)}
                        placeholder="Ex: 06 12 34 56 78"
                        className="w-full px-4 py-3 bg-brand-beige border border-brand-border rounded-xl text-xs focus:outline-none focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/15"
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-brand-accent/5 border border-brand-accent/20 rounded-2xl flex items-start space-x-3 text-brand-accent">
                    <HeartHandshake className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <div className="space-y-1">
                      <p className="text-xs font-bold">Confiance & Sécurité</p>
                      <p className="text-[10px] text-brand-accent/80 leading-relaxed font-semibold">
                        En publiant votre annonce, vous acceptez que chaque location initiée sur Cap Aventure fasse l'objet d'un contrat de location pré-rempli et d'une couverture d'assurance tous risques automatique.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Form Buttons */}
              <div className="pt-6 border-t border-brand-border flex items-center justify-between">
                {formStep > 1 ? (
                  <button
                    type="button"
                    onClick={() => setFormStep(formStep - 1)}
                    className="px-6 py-3.5 bg-brand-beige hover:bg-brand-hover text-brand-text border border-brand-border rounded-xl text-xs font-extrabold transition-all duration-200 cursor-pointer"
                  >
                    Précédent
                  </button>
                ) : (
                  <div></div>
                )}
                
                <button
                  type="submit"
                  className="flex items-center space-x-2 px-6 py-3.5 bg-brand-accent hover:bg-brand-accent-hover text-white rounded-xl text-xs font-extrabold shadow-lg transition-all duration-200 cursor-pointer"
                >
                  <span>{formStep === 3 ? "Soumettre l'annonce" : "Continuer"}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        )}
      </section>
    </main>
  );
}
