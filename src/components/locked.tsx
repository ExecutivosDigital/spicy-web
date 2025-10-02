"use client";
import { useApiContext } from "@/context/ApiContext";
import { useChatContext } from "@/context/chatContext";
import { cn } from "@/lib/utils";
import { maskPhone } from "@/utils/masks";
import { Loader2 } from "lucide-react";
import { useCookies } from "next-client-cookies";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
export function Locked() {
  const params = useSearchParams();

  const [phone, setPhone] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const { PostAPI, setToken } = useApiContext();
  const { setUserId } = useChatContext();
  const cookies = useCookies();
  const USER_TOKEN_KEY = process.env.NEXT_PUBLIC_USER_TOKEN as string;
  const USER_ID_KEY = process.env.NEXT_PUBLIC_USER_ID as string;

  async function handleVerify() {
    const modelId = params.get("modelId");

    const response = await PostAPI("/user/auth", { phone, modelId }, false);
    if (response.status === 200) {
      cookies.set(USER_TOKEN_KEY, response.body.accessToken);
      cookies.set(USER_ID_KEY, response.body.id);
      setToken(response.body.accessToken);
      setUserId(response.body.id);
      setIsUnlocked(true);
      return setIsLoading(false);
    }

    setIsLoading(false);
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
        isUnlocked
          ? "pointer-events-none opacity-0 transition duration-500"
          : "flex",
      )}
    >
      <div className="flex h-[40vh] w-[90vw] flex-col items-center justify-center gap-2 rounded-2xl bg-white p-4 shadow-sm shadow-[#BC5DFF] xl:w-[40vw]">
        {isLoading ? (
          <Loader2 className="animate-spin" />
        ) : (
          <>
            <Image
              alt="loading"
              src="/lock.png"
              width={1000}
              height={1000}
              className="h-20 w-auto object-contain"
            />
            <span className="text-center text-2xl font-bold text-[#BC5DFF]">
              Para desbloquear as fotos e falar diretamente comigo, <br />
              faça o login com o seu telefone abaixo
            </span>
            <input
              type="text"
              placeholder="Telefone"
              value={maskPhone(phone)}
              onChange={(e) => setPhone(e.target.value)}
              maxLength={15}
              className="w-80 rounded-md border border-zinc-200 p-2 text-black focus:border-[#BC5DFF] focus:outline-none"
            />
            <button
              onClick={() => {
                if (!phone) return toast.error("Preencha o telefone");
                if (phone.length < 15) return toast.error("Telefone inválido");
                handleVerify();
              }}
              className="cursor-pointer rounded-2xl border border-[#BC5DFF] bg-white p-2 text-[#BC5DFF]"
            >
              Verificar
            </button>
          </>
        )}
      </div>
    </div>
  );
}
