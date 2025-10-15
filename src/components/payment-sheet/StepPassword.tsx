"use client";

import { useApiContext } from "@/context/ApiContext";
import { useActionSheetsContext } from "@/context/actionSheetsContext";
import { useChatContext } from "@/context/chatContext";
import { cn } from "@/lib/utils";
import { maskPhone } from "@/utils/masks";
import { useCookies } from "next-client-cookies";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { z } from "zod";
import { GradientInput } from "./StepRegister";
import { GradientButton } from "./ui";
type Props = {
  phone: string;
  onNext: (status: string) => void;
  setPhone: React.Dispatch<React.SetStateAction<string>>;
};

const loginSchema = z.object({
  phone: z
    .string()
    .min(11, { message: "O telefone deve ter ao menos 11 dígitos." }),
  password: z
    .string()
    .min(4, { message: "A senha deve ter ao menos 4 caracteres." }),
  modelId: z.string().optional(),
});

export function StepPassword({ phone, setPhone, onNext }: Props) {
  const searchParams = useSearchParams();
  const { setToken } = useApiContext();
  const { setCurrent } = useActionSheetsContext();
  const { PostAPI } = useApiContext();
  const cookies = useCookies();
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { setUserId, handleGetChats, modelId } = useChatContext();
  const [errors, setErrors] = useState<{
    phone?: string;
    password?: string;
    general?: string;
  }>({});
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});

    // validação com Zod
    const result = loginSchema.safeParse({ phone, password, modelId });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const path = issue.path[0] as string;
        // só mostra a primeira mensagem por campo
        if (!fieldErrors[path]) fieldErrors[path] = issue.message;
      }
      setErrors({ phone: fieldErrors.phone, password: fieldErrors.password });
      return;
    }

    const { phone: digitsPhone, password: pwd, modelId: id } = result.data;

    setIsLoading(true);
    const Payload = { phone: digitsPhone, password: pwd, modelId: modelId };
    console.log("Payload: ", Payload);
    const response = await PostAPI("user/auth", Payload, false);
    if (response.status !== 200) {
      toast.error("Verifique os dados inseridos e tente novamente");
      return setIsLoading(false);
    }
    if (response.status === 200) {
      cookies.set(
        process.env.NEXT_PUBLIC_USER_TOKEN as string,
        response.body.accessToken,
      );
      cookies.set(
        process.env.NEXT_PUBLIC_USER_ID as string,
        response.body.userId,
      );
      setToken(response.body.accessToken);
      setUserId(response.body.userId);
      handleGetChats();
      onNext("success");
      return setIsLoading(false);
    }
    return setIsLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative m-4 overflow-hidden rounded-2xl bg-[#2A2A2E]">
        <div className="aspect-[16/6]">
          <Image
            src="/gab/photos/7.jpeg"
            alt="Gabriela"
            fill
            className="rounded-3xl object-cover"
            priority
          />
        </div>
      </div>

      <h2 className="text-center text-lg font-semibold">Digite sua senha</h2>

      {errors.general && (
        <div className="rounded-md border border-red-500/40 bg-red-500/10 p-2 text-sm text-red-300">
          {errors.general}
        </div>
      )}

      <label className="mt-6 block text-sm text-white/80">Seu Whatsapp:</label>
      <GradientInput>
        <input
          type="tel"
          value={maskPhone(phone)}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setPhone(e.target.value)
          }
          maxLength={15}
          placeholder="(00) 00000-0000"
          className="w-full bg-transparent px-4 py-3 text-base outline-none placeholder:text-white/30"
        />
      </GradientInput>
      {errors.phone && (
        <p className="mt-1 text-xs text-red-400">{errors.phone}</p>
      )}

      <label className="mt-4 block text-sm text-white/80">
        Digite sua Senha
      </label>
      <GradientInput>
        <input
          type="password"
          placeholder="••••"
          value={password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setPassword(e.target.value)
          }
          className="w-full bg-transparent px-4 py-3 text-base outline-none placeholder:text-white/30"
        />
      </GradientInput>
      {errors.password && (
        <p className="mt-1 text-xs text-red-400">{errors.password}</p>
      )}

      <div className="flex w-full items-center gap-2">
        <GradientButton
          type="submit"
          disabled={isLoading}
          className={cn(isLoading && "opacity-80")}
        >
          {isLoading ? "Entrando..." : "Entrar"}
        </GradientButton>
        <button
          disabled={isLoading}
          onClick={() => setCurrent("register")}
          className="mt-4 w-full rounded-lg border-2 border-[#FF0080] px-4 py-3 font-medium text-white disabled:opacity-50"
        >
          Cadastrar
        </button>
      </div>
    </form>
  );
}
