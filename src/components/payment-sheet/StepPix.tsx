"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { GradientButton } from "./ui";

function generateFakePixCode(email: string, planId: string) {
  return `00020126BR.GOV.BCB.PIX01ABCDXYZ5204000053039865802BR59Shop App60SAO PAULO62070503***6304SIGN-${planId}-${email}`;
}

export function StepPix({
  email,
  planId,
  onPaid,
}: {
  email: string;
  planId: string;
  onPaid: (pixCode: string) => void;
}) {
  const [code, setCode] = useState<string>("");

  useEffect(() => {
    setCode(generateFakePixCode(email, planId));
  }, [email, planId]);
  const [hasCopied, setHasCopied] = useState(false);
  const copy = async () => {
    setHasCopied(true);

    try {
      toast.success("Copiado com sucesso");
      await navigator.clipboard.writeText(code);
      setTimeout(() => setHasCopied(false), 4000);
    } catch {}
  };
  const [canGoNext, setCanGoNext] = useState(false);
  useEffect(() => {
    setCanGoNext(false);
    setTimeout(() => setCanGoNext(true), 1000);
  }, []);
  return (
    <div className="space-y-4">
      <h2 className="text-center text-lg font-semibold">Faça seu pagamento</h2>
      <div className="flex flex-row items-center justify-center gap-4 px-4">
        <div className="h-1 w-12 rounded-full bg-gradient-to-r from-[#FF0080] to-[#7928CA]"></div>
        <div className="h-1 w-12 rounded-full bg-gradient-to-r from-[#FF0080] to-[#7928CA]"></div>
        <div className="h-1 w-12 rounded-full bg-gradient-to-r from-[#FF0080] to-[#7928CA]"></div>
        <div className="h-1 w-12 rounded-full bg-gradient-to-r from-[#FF0080] to-[#7928CA] opacity-20"></div>
      </div>
      {/* QR simulado (placeholder) */}
      <div className="mx-auto grid aspect-square w-48 place-items-center rounded-2xl bg-white">
        <div className="px-2 text-center text-xs text-black">
          QR Code PIX
          <br /> (placeholder)
        </div>
      </div>

      <div className="rounded-lg bg-[#0f0f0f] p-3 text-xs break-all">
        {code}
      </div>

      <div className="grid grid-cols-1 items-center gap-3">
        <button
          className={cn(
            "mt-4 w-full rounded-lg border bg-transparent px-4 py-3 font-medium text-white transition-all duration-300",
            hasCopied ? "bg-gradient-to-r from-[#B273DF] to-[#ff0080]" : "",
          )}
          onClick={copy}
        >
          {hasCopied ? "Copiado ✓" : "Copiar PIX"}
        </button>
      </div>

      <GradientButton disabled={!canGoNext} onClick={() => onPaid("success")}>
        {canGoNext ? "Avançar" : "Aguardando pagamento no banco"}
      </GradientButton>
    </div>
  );
}
