"use client";
import { useApiContext } from "@/context/ApiContext";
import { useChatContext } from "@/context/chatContext";
import { cn } from "@/lib/utils";
import { maskPhone } from "@/utils/masks";
import { useCookies } from "next-client-cookies";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
export function Locked() {
  const params = useSearchParams();

  const [phone, setPhone] = useState<string>("");
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const { PostAPI, setToken } = useApiContext();
  const { setUserId } = useChatContext();
  const cookies = useCookies();
  const USER_TOKEN_KEY = process.env.NEXT_PUBLIC_USER_TOKEN as string;
  const USER_ID_KEY = process.env.NEXT_PUBLIC_USER_ID as string;

  async function handleVerify() {
    const modelId = params.get("modelId");

    const response = await PostAPI("/user/auth", { phone, modelId }, false);
    console.log(response.body);
    if (response.status === 200) {
      cookies.set(USER_TOKEN_KEY, response.body.accessToken);
      cookies.set(USER_ID_KEY, response.body.id);
      setToken(response.body.accessToken);
      setUserId(response.body.id);
      setIsUnlocked(true);
    }
  }

  useEffect(() => {
    const cookiesExists = cookies.get(USER_TOKEN_KEY);
    if (!cookiesExists) {
      handleVerify();
    } else {
      setIsUnlocked(true);
    }
  }, []);

  return (
    <div
      className={cn(
        "fixed top-0 z-10 flex h-screen w-screen items-center justify-center bg-black/40 backdrop-blur-md",
        isUnlocked ? "hidden" : "flex",
      )}
    >
      <div className="flex flex-col items-center justify-center gap-2">
        <Image
          alt="loading"
          src="/lock.png"
          width={1000}
          height={1000}
          className="h-40 w-40"
        />
        <span className="text-2xl font-bold text-white">
          Para desbloquear as fotos e falar diretamente comigo, faça o login com
          o seu telefone abaixo
        </span>
        <input
          type="text"
          placeholder="Telefone"
          value={maskPhone(phone)}
          onChange={(e) => setPhone(e.target.value)}
          maxLength={15}
          className="w-80 rounded-md border border-white/20 bg-[#BC5DFF]/40 p-2 text-black"
        />
        <button
          onClick={() => handleVerify()}
          className="rounded-2xl border border-[#BC5DFF] bg-white p-2 text-[#BC5DFF]"
        >
          Verificar
        </button>
      </div>
    </div>
  );
}
