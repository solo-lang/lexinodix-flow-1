import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useTranslation } from '../../lib/i18n';
import Button from './Button';

export default function ConfirmDialog() {
  const { confirmDialog, closeConfirm, language } = useApp();
  const { t } = useTranslation(language);

  if (!confirmDialog) return null;

  const handleConfirm = () => {
    confirmDialog.onConfirm?.();
    closeConfirm();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#011C26]/80 backdrop-blur-sm" onClick={closeConfirm} />
      <div className="relative w-full max-w-md bg-[#072A40] border border-[#BFACA4]/20 rounded-2xl shadow-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="shrink-0 w-10 h-10 rounded-full bg-red-900/30 border border-red-700/30 flex items-center justify-center">
            <AlertTriangle size={18} className="text-red-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-semibold text-white mb-2">Confirm Action</h3>
            <p className="text-sm text-[#BFACA4]">{confirmDialog.message}</p>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 mt-6">
          <Button variant="ghost" size="sm" onClick={closeConfirm}>{t.actions.cancel}</Button>
          <Button variant="danger" size="sm" onClick={handleConfirm}>{t.actions.confirm}</Button>
        </div>
      </div>
    </div>
  );
}
