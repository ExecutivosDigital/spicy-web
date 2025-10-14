"use client";

import { useApiContext } from "@/context/ApiContext";
import { maskCpfCnpj } from "@/utils/masks";
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
  const [isUpdating, setIsUpdating] = useState(false);
  const { PutAPI } = useApiContext();

  async function handleUpdateProfile() {
    setIsUpdating(true);
    try {
      const response = await PutAPI("/user/profile", { cpfCnpj: cpf }, true);
      if (response.status === 200) {
        onNext(cpf);
      } else {
        console.error("Failed to update CPF:", response);
      }
    } catch (error) {
      console.error("Error updating CPF:", error);
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="relative m-4 overflow-hidden rounded-2xl">
        <div className="relative flex aspect-[16/6] w-full items-center justify-center">
          <Image
            src="/gab/photos/10.jpeg"
            alt="Gabriela"
            fill
            className="rounded-xl object-cover"
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
        placeholder="000.000.000-00"
        value={maskCpfCnpj(cpf)}
        onChange={(e) => setCpf(onlyDigits(e.target.value))}
        maxLength={15}
      />
      <GradientButton disabled={isUpdating} onClick={handleUpdateProfile}>
        {isUpdating ? "Atualizando..." : "Avançar"}
      </GradientButton>
      <p className="text-center text-[10px] text-white/50">
        Suas informações são utilizadas somente para gerar o pix
      </p>
    </div>
  );
}
