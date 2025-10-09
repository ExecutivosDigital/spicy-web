"use client";

import { ChevronLeft, X } from "lucide-react";

export default function StepHeader({
  stepIndex,
  totalSteps,
  onBack,
  onClose,
}: {
  stepIndex: number;
  totalSteps: number;
  onBack?: () => void;
  onClose: () => void;
}) {
  return (
    <header className="relative flex items-center justify-center border-b border-white/10 px-5 py-3">
      {onBack ? (
        <button
          onClick={onBack}
          className="absolute left-3 rounded-full p-1.5 hover:bg-white/5"
          aria-label="Voltar"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      ) : (
        <span className="absolute left-3 h-5 w-5" />
      )}

      <div className="flex items-center gap-2 text-sm text-white/70">
        <span>Passo</span>
        <span className="font-medium text-white">{stepIndex}</span>
        <span>de {totalSteps}</span>
      </div>

      <button
        onClick={onClose}
        className="absolute right-3 rounded-full p-1.5 hover:bg-white/5"
        aria-label="Fechar"
      >
        <X className="h-5 w-5" />
      </button>
    </header>
  );
}
