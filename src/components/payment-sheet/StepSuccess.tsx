"use client";

import { Check } from "lucide-react";
import { GradientButton } from "./ui";

export function StepSuccess({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
      <div className="flex h-full flex-col items-center justify-center">
        <h2 className="text-lg font-semibold">Acesso liberado!</h2>
        <div className="mt-4 flex flex-row items-center justify-center gap-4 px-4">
          <div className="h-1 w-12 rounded-full bg-gradient-to-r from-[#FF0080] to-[#7928CA]"></div>
          <div className="h-1 w-12 rounded-full bg-gradient-to-r from-[#FF0080] to-[#7928CA]"></div>
          <div className="h-1 w-12 rounded-full bg-gradient-to-r from-[#FF0080] to-[#7928CA]"></div>
        </div>
        <div className="mt-20 grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-[#FF0080] to-[#7928CA]">
          <Check className="h-8 w-8 text-white" />
        </div>
        <p className="mt-10">Compra realizada!</p>
        <p className="mb-20 text-sm text-white/70">
          Em alguns instantes seu acesso será liberado.
        </p>
        <GradientButton onClick={() => onClose()}>Fechar</GradientButton>
      </div>
    </div>
  );
}
