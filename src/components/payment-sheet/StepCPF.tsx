"use client";

import { useState } from "react";
import { TextField } from "./ui";

function onlyDigits(v: string) {
  return v.replace(/\D+/g, "").slice(0, 11);
}

export function StepCPF({
  initialCPF,
  onNext,
}: {
  initialCPF?: string;
  onNext: (cpf: string) => void;
}) {
  const [cpf, setCpf] = useState(onlyDigits(initialCPF ?? ""));

  return (
    <div className="space-y-4">
      <h2 className="text-center text-lg font-semibold">Informe seu CPF</h2>
      <TextField
        inputMode="numeric"
        placeholder="00000000000"
        value={cpf}
        onChange={(e) => setCpf(onlyDigits(e.target.value))}
      />
      <p className="text-center text-xs text-white/50">
        Suas informações são somente utilizadas para gerar o pix
      </p>
    </div>
  );
}
