"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { TextField } from "./ui";

export function StepEmail({
  initialEmail,
  onNext,
}: {
  initialEmail?: string;
  onNext: (email: string) => void;
}) {
  const [email, setEmail] = useState(initialEmail ?? "");

  const [isChecked, setIsChecked] = useState<boolean>(false);
  return (
    <div className="space-y-4">
      <h2 className="text-center text-lg font-semibold">
        Falar com a Gabriela Ferreira
      </h2>
      <p className="text-sm text-white/70">Seu WhatsApp:</p>
      <TextField
        type="phone"
        placeholder="(00) 00000-0000"
        value={email}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setEmail(e.target.value)
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
          Aceito os <strong>termos de uso e política de privacidade</strong>e
          tenho mais de +18 anos
        </span>
      </div>
    </div>
  );
}
