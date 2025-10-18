"use client";

import { useApiContext } from "@/context/ApiContext";
import { useModelGalleryContext } from "@/context/ModelGalleryContext";
import { useActionSheetsContext } from "@/context/actionSheetsContext";
import { useChatContext } from "@/context/chatContext";
import { cn } from "@/utils/cn";
import { GenerateCpf } from "@/utils/generate-cpf";
import { getRandomItem } from "@/utils/getRandomItem";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
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
  const { selectedPlan, setSelectedPlan, setCurrent } =
    useActionSheetsContext();
  const { modelId } = useChatContext();
  const { photos } = useModelGalleryContext();
  const { GetAPI, PutAPI } = useApiContext();

  const [prices, setPrices] = useState<PriceProps[]>([]);
  const [isGettingPrices, setIsGettingPrices] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const banner = useMemo(
    () => getRandomItem(photos.filter((it) => it.isFreeAvailable)),
    [],
  );

  async function handleGetPlans() {
    const response = await GetAPI(`/model-price/fetch/${modelId}`, true);
    if (response.status === 200) {
      setPrices(response.body.modelPrices);
      setIsGettingPrices(false);
    }
    setIsGettingPrices(false);
  }

  async function handleUpdateProfile() {
    setIsUpdating(true);
    const response = await PutAPI(
      "/user/profile",
      { cpfCnpj: GenerateCpf() },
      true,
    );
    if (response.status === 200) {
      setCurrent("pix");
      return setIsUpdating(false);
    }
    return setIsUpdating(false);
  }

  useEffect(() => {
    handleGetPlans();
  }, []);

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
        <div className="h-1 w-12 rounded-full bg-gradient-to-r from-[#FF0080] to-[#7928CA] opacity-20"></div>
        <div className="h-1 w-12 rounded-full bg-gradient-to-r from-[#FF0080] to-[#7928CA] opacity-20"></div>
      </div>
      <ul className="space-y-2">
        {isGettingPrices ? (
          <>
            {Array.from({ length: 4 }).map((_, index) => (
              <li
                key={index}
                className="flex h-[4.75rem] w-full animate-pulse cursor-pointer flex-col items-center justify-center rounded-lg border border-white/10 bg-white/5 p-3"
              >
                <div className="flex w-full flex-1 flex-row items-center justify-between" />
                <div className="mt-1 -mb-1 h-0.5 w-full rounded-full bg-white/10" />
              </li>
            ))}
          </>
        ) : (
          prices.map((p) => {
            const active = selectedPlan === p.id;
            return (
              <li
                key={p.id}
                onClick={() => setSelectedPlan(p.id)}
                className="flex w-full cursor-pointer flex-col items-center justify-center border-white/10 p-3 transition duration-150 hover:bg-white/5"
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
          })
        )}
      </ul>
      <GradientButton
        onClick={handleUpdateProfile}
        disabled={isUpdating}
        className={cn(isUpdating && "opacity-80")}
      >
        {isUpdating ? "Aguarde..." : "Avançar"}
      </GradientButton>
    </div>
  );
}
