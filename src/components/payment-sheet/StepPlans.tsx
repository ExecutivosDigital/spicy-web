"use client";

import { useApiContext } from "@/context/ApiContext";
import { useActionSheetsContext } from "@/context/actionSheetsContext";
import { useChatContext } from "@/context/chatContext";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useEffect, useState } from "react";
import { GradientButton } from "./ui";

export interface PriceProps {
  description: string;
  duration: number;
  id: string;
  modelId: string;
  name: string;
  price: number;
}

export function StepPlans() {
  const { modelId, userProfile } = useChatContext();
  const [prices, setPrices] = useState<PriceProps[]>([]);
  const { selectedPlan, setSelectedPlan, setCurrent } =
    useActionSheetsContext();

  const { GetAPI } = useApiContext();
  async function handleGetPlans() {
    const response = await GetAPI(`/model-price/fetch/${modelId}`, true);

    if (response.status === 200) {
      setPrices(response.body.modelPrices);
    }
  }

  useEffect(() => {
    handleGetPlans();
  }, []);

  return (
    <div className="space-y-4">
      <div className="relative m-4 overflow-hidden rounded-2xl bg-[#2A2A2E]">
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
        {prices.map((p) => {
          const active = selectedPlan === p.id;
          return (
            <li
              key={p.id}
              onClick={() => setSelectedPlan(p.id)}
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
                    src="/logoBunny.png"
                    className="h-12 w-12 rounded-full"
                  />
                  <div>
                    <span className="text-lg font-bold">
                      {p.price.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </span>
                    <p className="text-sm">{p.description}</p>
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
      <GradientButton
        onClick={() => {
          if (userProfile && userProfile.hasCpfCnpj) {
            setCurrent("pix");
          } else {
            setCurrent("cpf");
          }
        }}
      >
        Avançar
      </GradientButton>
    </div>
  );
}
