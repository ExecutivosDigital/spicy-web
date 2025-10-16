"use client";

import { useApiContext } from "@/context/ApiContext";
import { useModelGalleryContext } from "@/context/ModelGalleryContext";
import { getRandomItem } from "@/utils/getRandomItem";
import { maskCpfCnpj } from "@/utils/masks";
import Image from "next/image";
import { useMemo, useState } from "react";
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
  const { photos } = useModelGalleryContext();
  const { PutAPI } = useApiContext();
  const [cpf, setCpf] = useState(onlyDigits(initialCPF ?? ""));
  const [isUpdating, setIsUpdating] = useState(false);

  const banner = useMemo(
    () => getRandomItem(photos.filter((it) => it.isFreeAvailable)),
    [],
  );

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
      <div className="absolute top-0 left-0 flex h-40 w-full items-center justify-center">
        {banner ? (
          <Image
            src={banner?.photoUrl}
            alt="Gabriela"
            width={500}
            height={250}
            className="h-full w-full object-cover"
            priority
          />
        ) : (
          <Image
            src="/logo.png"
            alt="Gabriela"
            width={500}
            height={250}
            className="m-auto h-max w-2/3 object-contain"
            priority
          />
        )}
      </div>
      <div className="mt-40 flex flex-row items-center justify-center gap-4 px-4">
        <div className="h-1 w-12 rounded-full bg-gradient-to-r from-[#FF0080] to-[#7928CA]"></div>
        <div className="h-1 w-12 rounded-full bg-gradient-to-r from-[#FF0080] to-[#7928CA]"></div>
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
