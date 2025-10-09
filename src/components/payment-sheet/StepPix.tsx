"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

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

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {}
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Faça seu pagamento</h2>

      {/* QR simulado (placeholder) */}
      <div className="mx-auto grid aspect-square w-48 place-items-center rounded-lg bg-white">
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
            "mt-4 w-full rounded-lg border px-4 py-3 font-medium text-white",
          )}
          onClick={copy}
        >
          Copiar PIX
        </button>
      </div>

      <p className="text-center text-xs text-white/60">
        Aguardando confirmação do pagamento no banco...
      </p>
    </div>
  );
}
