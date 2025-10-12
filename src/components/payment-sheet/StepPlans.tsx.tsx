"use client";

import { useApiContext } from "@/context/ApiContext";
import { cn } from "@/lib/utils";
import Image, { StaticImageData } from "next/image";
import { useEffect, useState } from "react";
import { GradientButton } from "./ui";
import plan1Img from "/public/gab/photos/11.jpeg";
import plan2Img from "/public/gab/photos/12.jpeg";
import plan3Img from "/public/gab/photos/13.jpeg";
import plan4Img from "/public/gab/photos/profile.png";
type Plan = {
  id: string;
  label: string;
  price: string;
  subtitle?: string;
  image: StaticImageData;
};

const PLANS: Plan[] = [
  { id: "m1", label: "1 mês", price: "R$29,90", image: plan1Img },
  { id: "m3", label: "3 meses", price: "R$64,90", image: plan2Img },
  {
    id: "m6",
    label: "6 meses",
    price: "R$99,90",
    subtitle: "Economize",
    image: plan3Img,
  },
  {
    id: "y1",
    label: "1 ano",
    price: "R$129,90",
    subtitle: "Melhor custo",
    image: plan4Img,
  },
];

export function StepPlans({
  selectedId,
  onNext,
}: {
  selectedId?: string;
  onNext: (planId: string) => void;
}) {
  const [selected, setSelected] = useState<string | undefined>(selectedId);
  const { GetAPI } = useApiContext();
  async function handleGetPlans() {
    const response = await GetAPI(`/signature-plan`, true);
    console.log("responseVerify", response);
  }
  useEffect(() => {
    handleGetPlans();
  }, []);
  return (
    <div className="space-y-4">
      <div className="relative m-4 overflow-hidden rounded-2xl bg-[#2A2A2E]">
        {/* Give the banner a predictable but responsive height */}
        <div className="relative flex aspect-[16/6] w-full items-center justify-center">
          <Image
            src="/gab/photos/10.jpeg"
            alt="Gabriela"
            fill
            className="rounded-xl object-cover"
          />
          <div className="absolute flex w-full items-center justify-center gap-3 select-none">
            <div className="flex flex-row items-center rounded-lg bg-black/60 p-2">
              <h2 className="text-center text-lg font-semibold">
                Selecione seu plano
              </h2>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-row items-center justify-center gap-4 px-4">
        <div className="h-1 w-12 rounded-full bg-gradient-to-r from-[#FF0080] to-[#7928CA]"></div>
        <div className="h-1 w-12 rounded-full bg-gradient-to-r from-[#FF0080] to-[#7928CA] opacity-20"></div>
        <div className="h-1 w-12 rounded-full bg-gradient-to-r from-[#FF0080] to-[#7928CA] opacity-20"></div>
        <div className="h-1 w-12 rounded-full bg-gradient-to-r from-[#FF0080] to-[#7928CA] opacity-20"></div>
      </div>
      <ul className="space-y-2">
        {PLANS.map((p) => {
          const active = selected === p.id;
          return (
            <li
              key={p.id}
              onClick={() => setSelected(p.id)}
              className={cn(
                "flex w-full cursor-pointer flex-col items-center justify-center p-3",
                "border-white/10 hover:bg-white/5",
              )}
            >
              <div className="flex w-full flex-1 flex-row items-center justify-between">
                <div className="flex flex-row items-center gap-2">
                  <Image
                    alt=""
                    width={30}
                    height={30}
                    src={p.image}
                    className="h-12 w-12 rounded-full"
                  />
                  <div>
                    <span className="text-lg font-bold">{p.price}</span>
                    <p className="text-sm">{p.label}</p>
                  </div>
                </div>
                <div
                  className={cn(
                    `h-5 w-5 rounded-full bg-gradient-to-br from-[#FF0080] to-[#7928CA] p-[2px]`,
                    active && "",
                  )}
                >
                  {active ? (
                    <div className="h-full w-full rounded-full bg-gradient-to-br from-[#FF0080] to-[#7928CA]" />
                  ) : (
                    <div className="h-full w-full rounded-full bg-[#2A2A2E]" />
                  )}
                </div>
              </div>
              <div className="mt-1 -mb-1 h-0.5 w-full rounded-full bg-white/10" />
            </li>
          );
        })}
      </ul>
      <GradientButton onClick={() => onNext("pix")}>Avançar</GradientButton>
    </div>
  );
}
