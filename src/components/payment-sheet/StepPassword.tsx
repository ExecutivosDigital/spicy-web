"use client";

import { useApiContext } from "@/context/ApiContext";
import { useModelGalleryContext } from "@/context/ModelGalleryContext";
import { useActionSheetsContext } from "@/context/actionSheetsContext";
import { useChatContext } from "@/context/chatContext";
import { cn } from "@/utils/cn";
import { getRandomItem } from "@/utils/getRandomItem";
import { maskPhone } from "@/utils/masks";
import { fakerPT_BR } from "@faker-js/faker";
import { useCookies } from "next-client-cookies";
import Image from "next/image";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { z } from "zod";
import { GradientInput, RegisterData } from "./StepRegister";
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
  modelId: z.string().optional(),
});

export function StepPassword({ phone, setPhone, onNext }: Props) {
  const { setUserId, handleGetChats, modelId, handleVerify } = useChatContext();
  const { setCurrent } = useActionSheetsContext();
  const { photos } = useModelGalleryContext();
  const { setToken } = useApiContext();
  const { PostAPI } = useApiContext();
  const cookies = useCookies();

  // const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<{
    phone?: string;
    password?: string;
    general?: string;
  }>({});
  const [registerData] = useState<RegisterData>({
    nome: fakerPT_BR.person.fullName(),
    telefone: phone,
    senha: "",
    aceitouTermos: true,
  });

  const banner = useMemo(
    () => getRandomItem(photos.filter((it) => it.isFreeAvailable)),
    [],
  );

  async function handleRegister() {
    const response = await PostAPI(
      "user/register",
      {
        name: registerData.nome,
        phone,
        password: phone,
        modelId: modelId,
      },
      false,
    );
    console.log("register: ", response);
    if (response.status === 200) {
      toast.success("Registrado com sucesso!");
      handleVerify();
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
      setCurrent("plans");
    } else if (response.status === 409) {
      toast.error("Telefone já cadastrado");
    } else {
      toast.error("Erro ao registrar");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});

    const result = loginSchema.safeParse({ phone, modelId });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const path = issue.path[0] as string;
        if (!fieldErrors[path]) fieldErrors[path] = issue.message;
      }
      setErrors({ phone: fieldErrors.phone, password: fieldErrors.password });
      return;
    }

    const { phone: digitsPhone } = result.data;

    setIsLoading(true);
    const Payload = { phone: digitsPhone, modelId: modelId };
    const response = await PostAPI(
      "user/auth",
      {
        ...Payload,
        password: digitsPhone.replace(/[^0-9]/g, ""),
      },
      false,
    );
    console.log("login: ", response);
    if (response.status !== 200) {
      await handleRegister();
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

      <h2 className="mt-40 text-center text-lg font-semibold">
        Digite seu telefone
      </h2>

      {errors.general && (
        <div className="rounded-md border border-red-500/40 bg-red-500/10 p-2 text-sm text-red-300">
          {errors.general}
        </div>
      )}

      <label className="mt-6 block text-sm text-white/80">Seu Whatsapp:</label>
      <GradientInput>
        <input
          type="tel"
          value={phone}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setPhone(maskPhone(e.target.value))
          }
          maxLength={15}
          placeholder="(00) 00000-0000"
          className="w-full bg-transparent px-4 py-3 text-base outline-none placeholder:text-white/30"
        />
      </GradientInput>
      {errors.phone && (
        <p className="mt-1 text-xs text-red-400">{errors.phone}</p>
      )}

      {/* <label className="mt-4 block text-sm text-white/80">
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
      )} */}

      <div className="flex w-full items-center gap-2">
        {/* <button
          disabled={isLoading}
          onClick={() => setCurrent("register")}
          className="mt-4 w-full rounded-lg border-2 border-[#FF0080] px-4 py-3 font-medium text-white disabled:opacity-50"
        >
          Cadastrar
        </button> */}
        <GradientButton
          type="submit"
          disabled={isLoading}
          className={cn(isLoading && "opacity-80")}
        >
          {isLoading ? "Entrando..." : "Entrar"}
        </GradientButton>
      </div>
    </form>
  );
}
