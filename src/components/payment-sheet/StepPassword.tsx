"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { TextField } from "./ui";

export function StepPassword({
  onNext,
}: {
  onNext: (password: string) => void;
}) {
  const [pwd, setPwd] = useState("");
  const [phone, setPhone] = useState<string>("");
  const [isChecked, setIsChecked] = useState<boolean>(false);
  return (
    <div className="space-y-4">
      <h2 className="text-center text-lg font-semibold">Digite sua senha</h2>
      <p className="text-sm text-white/70">Seu WhatsApp:</p>
      <TextField
        type="phone"
        placeholder="(00) 00000-0000"
        value={phone}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setPhone(e.target.value)
        }
      />
      <p className="text-sm text-white/70">Senha:</p>
      <TextField
        type="password"
        placeholder="****"
        value={phone}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setPhone(e.target.value)
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
    </div>
  );
}
