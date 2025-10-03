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
  const { setUserId, handleGetChats } = useChatContext();
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const cookies = useCookies();
  const USER_TOKEN_KEY = process.env.NEXT_PUBLIC_USER_TOKEN as string;
  const USER_ID_KEY = process.env.NEXT_PUBLIC_USER_ID as string;

  async function handleVerify() {
    setIsVerifying(true);
    const modelId = params.get("modelId");
    const response = await PostAPI("/user/auth", { phone, modelId }, false);
    if (response.status === 200) {
      cookies.set(USER_TOKEN_KEY, response.body.accessToken);
      cookies.set(USER_ID_KEY, response.body.id);
      setToken(response.body.accessToken);
      setUserId(response.body.id);
      setIsUnlocked(true);
      setIsVerifying(false);
      handleGetChats();
      return setIsLoading(false);
    }
    setIsVerifying(false);
    return setIsLoading(false);
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
      <div className="flex h-[40vh] w-[90vw] flex-col justify-center gap-2 rounded-2xl bg-neutral-900 p-4 xl:w-[30vw]">
        <Image
          alt="loading"
          src="/logo.png"
          width={1000}
          height={1000}
          className="mx-auto h-20 w-auto object-contain"
        />
        {isLoading ? (
          <Loader2 className="mx-auto animate-spin text-white" />
        ) : (
          <>
            <span className="w-80 text-center text-xl font-semibold text-white">
              Para acessar o conteúdo e falar diretamente comigo, informe o seu
              telefone abaixo
            </span>
            <input
              type="text"
              placeholder="Telefone"
              value={maskPhone(phone)}
              onChange={(e) => setPhone(e.target.value)}
              maxLength={15}
              className={cn(
                "w-80 rounded-md border-2 border-neutral-500 p-2 text-center text-white placeholder:text-neutral-500 focus:border-[#E77988] focus:outline-none",
                phone.length === 15 && "border-[#E77988]",
              )}
            />

            <button
              onClick={() => {
                if (!phone) return toast.error("Preencha o telefone");
                if (phone.length < 15) return toast.error("Telefone inválido");
                handleVerify();
              }}
              disabled={isVerifying}
              className="flex w-80 cursor-pointer items-center justify-center gap-1 rounded-lg border-2 border-[#E77988] bg-[#E77988] p-2 text-lg font-bold text-white"
            >
              {isVerifying ? (
                <>
                  <Loader2 className="animate-spin" />
                  Verificando
                </>
              ) : (
                "Verificar"
              )}
            </button>
            <label
              className="flex items-center gap-2 text-xs text-white"
              htmlFor="check"
            >
              <input
                type="checkbox"
                id="check"
                className="bg-transparent fill-transparent accent-[#E77988]"
              />{" "}
              Tenho mais de 18 anos e aceito os termos de uso
            </label>
          </>
        )}
      </div>
    </div>
  );
}
