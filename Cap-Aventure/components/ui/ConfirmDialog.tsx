'use client';

import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  variant?: 'danger' | 'warning' | 'primary';
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirmer la suppression',
  message = 'Êtes-vous sûr de vouloir effectuer cette action ? Cette opération est irréversible.',
  confirmText = 'Supprimer définitivement',
  cancelText = 'Annuler',
  isLoading = false,
  variant = 'danger'
}: ConfirmDialogProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={isLoading ? () => {} : onClose}
      maxWidth="md"
    >
      <div className="space-y-6 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
          <div className="p-4 bg-brand-error/10 text-brand-error rounded-2xl flex-shrink-0">
            <Trash2 className="w-7 h-7" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-xl font-extrabold text-brand-text tracking-tight">
              {title}
            </h3>
            <div className="text-xs sm:text-sm text-brand-muted leading-relaxed">
              {message}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col-reverse sm:flex-row justify-end items-center gap-3 pt-4 border-t border-brand-border">
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={onClose}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            variant="danger"
            size="md"
            isLoading={isLoading}
            onClick={onConfirm}
            className="w-full sm:w-auto bg-brand-error text-white hover:bg-red-700 shadow-md shadow-brand-error/20"
            leftIcon={<Trash2 className="w-4 h-4" />}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
