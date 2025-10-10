"use client";

import { cn } from "@/lib/utils";
import { maskPhone } from "@/utils/masks";
import Image from "next/image";
import React, { useState } from "react";
import { GradientButton, TextField } from "./ui";

export function StepEmail({
  initialEmail,
  onNext,
  phone,
  setPhone,
}: {
  initialEmail?: string;
  onNext: (email: string) => void;
  phone: string;
  setPhone: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [isChecked, setIsChecked] = useState<boolean>(true);
  return (
    <div className="space-y-4">
      <div className="relative m-4 overflow-hidden rounded-2xl bg-[#2A2A2E]">
        {/* Give the banner a predictable but responsive height */}
        <div className="aspect-[16/6]">
          <Image
            src="/gab/photos/9.jpeg"
            alt="Gabriela"
            fill
            className="rounded-xl"
          />
        </div>
      </div>
      <h2 className="text-center text-lg font-semibold">
        Falar com a Gabriela Ferreira
      </h2>
      <p className="text-sm text-white/70">Seu WhatsApp:</p>
      <TextField
        type="tel"
        placeholder="(00) 00000-0000"
        value={maskPhone(phone)}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setPhone(e.target.value)
        }
      />
      <div className="flex flex-row items-center justify-center gap-2">
        <button
          onClick={() => setIsChecked(!isChecked)}
          className={cn(
            `flex h-5 w-5 min-w-5 items-center justify-center rounded-md border border-[#FF0080]`,
            isChecked && "bg-[#FF0080]",
          )}
        >
          {isChecked && "✓"}
        </button>
        <span className="text-xs">
          Aceito os{" "}
          <button className="cursor-pointer font-bold">
            termos de uso e política de privacidade
          </button>{" "}
          e tenho mais de +18 anos
        </span>
      </div>
      <GradientButton onClick={() => onNext("password")}>
        Avançar
      </GradientButton>
    </div>
  );
}
