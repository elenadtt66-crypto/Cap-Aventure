'use client';

import React, { useState } from 'react';
import { CreditCard, CheckCircle2, ShieldCheck, ArrowRight, X, Lock, Wallet, Landmark } from 'lucide-react';

interface PcsPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount?: number;
  reservationTitle?: string;
}

export default function PcsPaymentModal({
  isOpen,
  onClose,
  amount = 150,
  reservationTitle = 'Réservation Véhicule Cap-Aventure'
}: PcsPaymentModalProps) {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'card' | 'virement-guide'>('card');

  if (!isOpen) return null;

  const handleStripePayment = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          title: reservationTitle,
          reservationId: `CAP-${Math.floor(1000 + Math.random() * 9000)}`,
        }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Redirection de paiement sécurisé Stripe initialisée.');
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      alert('Impossible d\'initier le paiement. Vérifiez la connexion.');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 duration-200 text-slate-900">
        
        {/* Header Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Title Header */}
        <div className="mb-6">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100 mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            PAIEMENT SÉCURISÉ & VIREMENT BANCAIRE
          </span>
          <h3 className="font-sans text-2xl font-black text-slate-900">
            Passer au Paiement
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            Effectuez votre règlement sécurisé par carte bancaire ou par virement.
          </p>
        </div>

        {/* Tab Toggle Buttons */}
        <div className="flex rounded-2xl bg-slate-100 p-1.5 mb-6 text-xs font-bold">
          <button
            onClick={() => setActiveTab('card')}
            className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 ${
              activeTab === 'card'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <CreditCard className="w-4 h-4 text-blue-600" />
            <span>Payer par Carte ({amount} €)</span>
          </button>

          <button
            onClick={() => setActiveTab('virement-guide')}
            className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 ${
              activeTab === 'virement-guide'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Landmark className="w-4 h-4 text-emerald-600" />
            <span>Guide Virement</span>
          </button>
        </div>

        {/* TAB 1: CARD PAYMENT */}
        {activeTab === 'card' && (
          <div className="space-y-4">
            
            {/* Amount Summary Box */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">TOTAL À PAYER</span>
                <span className="text-xl font-black text-slate-900">{reservationTitle}</span>
              </div>
              <div className="font-mono text-2xl font-black text-blue-600">
                {amount} €
              </div>
            </div>

            {/* Accepted Payment Icons */}
            <div className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs text-slate-600 font-medium">
              <span className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-emerald-600" />
                Moyens acceptés :
              </span>
              <span className="font-bold text-slate-800">Visa • Mastercard • Apple Pay • Google Pay</span>
            </div>

            {/* Submit Payment CTA */}
            <button
              onClick={handleStripePayment}
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-blue-600 text-white font-bold text-sm shadow-lg shadow-blue-600/30 hover:bg-blue-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <span>Initialisation du paiement...</span>
              ) : (
                <>
                  <span>Payer {amount} € en toute sécurité</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <p className="text-[11px] text-center text-slate-400">
              Transaction chiffrée SSL 256 bits via Stripe Merchant Services.
            </p>
          </div>
        )}

        {/* TAB 2: BANK WIRE GUIDE (GUIDE VIREMENT) */}
        {activeTab === 'virement-guide' && (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-2">
              <h4 className="font-bold text-sm flex items-center gap-2 text-emerald-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Guide Virement Bancaire SEPA / Swift :
              </h4>
              <ol className="list-decimal list-inside space-y-2 text-slate-700 font-medium leading-relaxed">
                <li>
                  <strong className="text-slate-900">Récupérez les coordonnées bancaires (RIB / IBAN)</strong> inscrites sur la facture ou fournies par l'agence.
                </li>
                <li>
                  <strong className="text-slate-900">Effectuez le virement</strong> depuis votre application bancaire en indiquant le montant exact (<strong className="text-emerald-700">{amount} €</strong>).
                </li>
                <li>
                  <strong className="text-slate-900">Mentionnez la référence</strong> de votre réservation en libellé du virement.
                </li>
                <li>
                  <strong className="text-slate-900">Validation automatique</strong> : Votre réservation sera confirmée dès réception des fonds sur le compte marchand !
                </li>
              </ol>
            </div>

            <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between text-slate-600">
              <span>Des questions sur votre virement bancaire ?</span>
              <button onClick={onClose} className="text-blue-600 font-bold hover:underline">
                Contacter le support
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
