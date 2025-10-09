"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";

type Plan = { id: string; label: string; price: string; subtitle?: string };

const PLANS: Plan[] = [
  { id: "m1", label: "1 mês", price: "R$29,90" },
  { id: "m3", label: "3 meses", price: "R$64,90", subtitle: "Economize" },
  { id: "m6", label: "6 meses", price: "R$99,90" },
  { id: "y1", label: "1 ano", price: "R$129,90", subtitle: "Melhor custo" },
];

export function StepPlans({
  selectedId,
  onNext,
}: {
  selectedId?: string;
  onNext: (planId: string) => void;
}) {
  const [selected, setSelected] = useState<string | undefined>(selectedId);

  return (
    <div className="space-y-4">
      <h2 className="text-center text-lg font-semibold">Selecione seu plano</h2>

      <ul className="space-y-2">
        {PLANS.map((p) => {
          const active = selected === p.id;
          return (
            <li
              key={p.id}
              onClick={() => setSelected(p.id)}
              className={cn(
                "flex cursor-pointer items-center justify-between rounded-xl p-3",
                "border-white/10 hover:bg-white/5",
              )}
            >
              <div className="flex flex-row items-center gap-2">
                <Image
                  alt=""
                  width={30}
                  height={30}
                  src={"/gab/photos/profile.png"}
                  className="h-10 w-10 rounded-full"
                />
                <div>
                  <span className="text-sm">{p.price}</span>
                  <p className="font-medium">{p.label}</p>
                </div>
              </div>
              {selected === p.id && (
                <div className="h-5 w-5 rounded-full border border-[#FF0080]"></div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
