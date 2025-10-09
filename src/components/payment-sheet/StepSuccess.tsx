"use client";

import { Check } from "lucide-react";

export function StepSuccess({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
      <div className="grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-[#FF0080] to-[#7928CA]">
        <Check className="h-8 w-8 text-white" />
      </div>
      <div>
        <h2 className="text-lg font-semibold">Acesso liberado!</h2>
        <p className="mt-1 text-sm text-white/70">
          Compra realizada. Em alguns instantes seu acesso será liberado.
        </p>
      </div>
    </div>
  );
}
