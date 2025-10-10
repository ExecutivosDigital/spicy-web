"use client";

import { cn } from "@/lib/utils";
import { maskPhone } from "@/utils/masks";
import Image from "next/image";
import { useState } from "react";
import { GradientButton, TextField } from "./ui";

export function StepPassword({
  phone,
  setPhone,
  onNext,
}: {
  phone: string;
  onNext: (email: string) => void;
  setPhone: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [pwd, setPwd] = useState("");
  const [isChecked, setIsChecked] = useState<boolean>(false);
  return (
    <div className="space-y-4">
      <div className="relative m-4 overflow-hidden rounded-2xl bg-[#2A2A2E]">
        {/* Give the banner a predictable but responsive height */}
        <div className="aspect-[16/6]">
          <Image
            src="/gab/photos/7.jpeg"
            alt="Gabriela"
            fill
            className="rounded-3xl object-cover"
          />
        </div>
      </div>
      <h2 className="text-center text-lg font-semibold">Digite sua senha</h2>
      <p className="text-sm text-white/70">Seu WhatsApp:</p>
      <TextField
        type="phone"
        placeholder="(00) 00000-0000"
        value={maskPhone(phone)}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setPhone(e.target.value)
        }
      />
      <p className="text-sm text-white/70">Senha:</p>
      <TextField
        type="password"
        placeholder="****"
        value={pwd}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setPwd(e.target.value)
        }
      />
      <div className="flex w-full flex-row items-center gap-2">
        <button
          onClick={() => setIsChecked(!isChecked)}
          className={cn(
            `flex h-5 w-5 min-w-5 items-center justify-center rounded-md border border-[#FF0080]`,
            isChecked && "bg-[#FF0080]",
          )}
        >
          {isChecked && "✓"}
        </button>
        <span className="text-xs">Salvar Informações</span>
      </div>
      <GradientButton onClick={() => onNext("password")}>
        Avançar
      </GradientButton>
    </div>
  );
}
