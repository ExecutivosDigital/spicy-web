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
import { GradientButton, TextField } from "./ui";
type Props = {
  phone: string;
  onNext: (status: string) => void;
  setPhone: React.Dispatch<React.SetStateAction<string>>;
};

const loginSchema = z.object({
  phone: z
    .string()
    // valida o número cru, só dígitos (11 dígitos no BR com DDD)
    .transform((v) => v.replace(/\D/g, ""))
    .refine((v) => v.length === 10, {
      message: "Informe um número válido com DDD (10 dígitos).",
    }),
  password: z
    .string()
    .min(4, { message: "A senha deve ter ao menos 4 caracteres." }),
  modelId: z.string().optional(),
});

export function StepPassword({ phone, setPhone, onNext }: Props) {
  const searchParams = useSearchParams();
  const modelId = searchParams.get("id") ?? undefined;
  const { setToken } = useApiContext();
  const { setCurrent } = useActionSheetsContext();
  const { PostAPI, GetAPI } = useApiContext();
  const cookies = useCookies();
  const [password, setPassword] = useState("");
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { setUserId, handleGetChats } = useChatContext();
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

    try {
      setIsLoading(true);
      const Payload = { phone: digitsPhone, password: pwd, modelId: id };
      const response = await PostAPI("user/auth", Payload, false);
      if (response.status !== 200) {
        return toast.error("Verifique os dados inseridos e tente novamente");
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
      }

      // Avança o fluxo: você pode trocar "success" por algo que seu wizard use
      onNext("success");
    } catch (err: any) {
      // Mostra erro genérico ou vindo da API
      const apiMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Não foi possível entrar. Tente novamente.";
      setErrors((prev) => ({ ...prev, general: apiMessage }));
    } finally {
      setIsLoading(false);
    }
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

      <p className="text-sm text-white/70">Seu WhatsApp:</p>
      <TextField
        type="tel"
        placeholder="(00) 00000-0000"
        maxLength={15}
        value={maskPhone(phone)}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setPhone(e.target.value)
        }
        aria-invalid={!!errors.phone}
        aria-describedby={errors.phone ? "phone-error" : undefined}
      />
      {errors.phone && (
        <span id="phone-error" className="text-xs text-red-400">
          {errors.phone}
        </span>
      )}

      <p className="text-sm text-white/70">Senha:</p>
      <TextField
        type="password"
        placeholder="••••"
        value={password}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setPassword(e.target.value)
        }
        aria-invalid={!!errors.password}
        aria-describedby={errors.password ? "password-error" : undefined}
      />
      {errors.password && (
        <span id="password-error" className="text-xs text-red-400">
          {errors.password}
        </span>
      )}
      {/* 
      <div className="flex w-full flex-row items-center gap-2">
        <button
          type="button"
          onClick={() => setIsChecked((v) => !v)}
          className={cn(
            "flex h-5 w-5 min-w-5 items-center justify-center rounded-md border border-[#FF0080] transition-colors",
            isChecked && "bg-[#FF0080]",
          )}
          aria-pressed={isChecked}
          aria-label="Salvar Informações"
        >
          {isChecked && "✓"}
        </button>
        <span className="text-xs">Salvar Informações</span>
      </div> */}

      <div className="flex w-full items-center gap-2">
        <GradientButton
          disabled={isLoading}
          onClick={() => setCurrent("register")}
          className={cn(isLoading && "opacity-80")}
        >
          {isLoading ? "Entrando..." : "Cadastrar"}
        </GradientButton>
        <GradientButton
          type="submit"
          disabled={isLoading}
          className={cn(isLoading && "opacity-80")}
        >
          {isLoading ? "Entrando..." : "Avançar"}
        </GradientButton>
      </div>
    </form>
  );
}
