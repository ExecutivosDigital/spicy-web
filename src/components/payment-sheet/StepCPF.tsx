"use client";

import Image from "next/image";
import { useState } from "react";
import { GradientButton, TextField } from "./ui";

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
      <div className="relative m-4 overflow-hidden rounded-2xl bg-[#2A2A2E]">
        {/* Give the banner a predictable but responsive height */}
        <div className="aspect-[16/6]">
          <Image
            src="/gab/photos/8.jpeg"
            alt="Gabriela"
            fill
            className="rounded-3xl object-cover"
          />
        </div>
      </div>
      <div className="flex flex-row items-center justify-center gap-4 px-4">
        <div className="h-1 w-12 rounded-full bg-gradient-to-r from-[#FF0080] to-[#7928CA]"></div>
        <div className="h-1 w-12 rounded-full bg-gradient-to-r from-[#FF0080] to-[#7928CA]"></div>
        <div className="h-1 w-12 rounded-full bg-gradient-to-r from-[#FF0080] to-[#7928CA] opacity-20"></div>
        <div className="h-1 w-12 rounded-full bg-gradient-to-r from-[#FF0080] to-[#7928CA] opacity-20"></div>
      </div>
      <h2 className="text-center text-lg font-semibold">Informe seu CPF</h2>
      <TextField
        inputMode="numeric"
        placeholder="00000000000"
        value={cpf}
        onChange={(e) => setCpf(onlyDigits(e.target.value))}
      />
      <GradientButton onClick={() => onNext("pix")}>Avançar</GradientButton>
      <p className="text-center text-[10px] text-white/50">
        Suas informações são utilizadas somente para gerar o pix
      </p>
    </div>
  );
}
