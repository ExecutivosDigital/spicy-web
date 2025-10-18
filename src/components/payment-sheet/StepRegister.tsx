"use client";
import { useActionSheetsContext } from "@/context/actionSheetsContext";
import { useApiContext } from "@/context/ApiContext";
import { useChatContext } from "@/context/chatContext";
import { useModelGalleryContext } from "@/context/ModelGalleryContext";
import { cn } from "@/utils/cn";
import { getRandomItem } from "@/utils/getRandomItem";
import { maskPhone } from "@/utils/masks";
import { fakerPT_BR } from "@faker-js/faker";
import { Check } from "lucide-react";
import { useCookies } from "next-client-cookies";
import Image from "next/image";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { GradientButton } from "./ui";

export type RegisterData = {
  nome: string;
  telefone: string;
  senha: string;
  aceitouTermos: boolean;
};

export default function RegisterCard({
  onNext,
  phone,
}: {
  onNext: () => void;
  phone: string;
}) {
  const { handleGetChats, setUserId, handleVerify, modelId } = useChatContext();
  const { setCurrent } = useActionSheetsContext();
  const { photos } = useModelGalleryContext();
  const { PostAPI, setToken } = useApiContext();
  const cookies = useCookies();

  const [registerData, setRegisterData] = useState<RegisterData>({
    nome: fakerPT_BR.person.fullName(),
    telefone: phone,
    senha: "",
    aceitouTermos: true,
  });

  const [loading, setLoading] = useState(false);
  const [tocado, setTocado] = useState<{ [k: string]: boolean }>({});

  const banner = useMemo(
    () => getRandomItem(photos.filter((it) => it.isFreeAvailable)),
    [],
  );

  const errors = useMemo(() => {
    const e: Partial<Record<keyof RegisterData, string>> = {};
    if (!registerData.nome.trim()) e.nome = "Informe seu nome";
    if (registerData.telefone.length < 11) e.telefone = "Telefone inválido";
    // if (registerData.senha.length < 4) e.senha = "Mínimo 4 caracteres";
    if (!registerData.aceitouTermos)
      e.aceitouTermos = "É necessário aceitar os termos";
    return e;
  }, [registerData]);

  const invalid = Object.keys(errors).length > 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTocado({ nome: true, telefone: true, aceitouTermos: true });
    if (invalid) return;
    setLoading(true);
    const response = await PostAPI(
      "user/register",
      {
        name: registerData.nome,
        phone: registerData.telefone,
        password: registerData.telefone.replace(/[^0-9]/g, ""),
        modelId: modelId,
      },
      false,
    );
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
      onNext();
    } else if (response.status === 409) {
      toast.error("Telefone ja cadastrado");
    } else {
      toast.error("Erro ao registrar");
    }
    setLoading(false);
  }

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
      <form onSubmit={handleSubmit} className="mt-40 w-full text-white">
        <h1 className="mt-6 text-xl font-semibold">
          Faça seu Cadastro Gratuito
        </h1>

        {/* <label className="mt-6 block text-sm text-white/80">
          Insira seu Nome
        </label>
        <GradientInput>
          <input
            type="text"
            value={registerData.nome}
            onChange={(e) =>
              setRegisterData((prev) => ({ ...prev, nome: e.target.value }))
            }
            onBlur={() => setTocado((t) => ({ ...t, nome: true }))}
            placeholder="Seu nome completo"
            className="w-full bg-transparent px-4 py-3 text-base outline-none placeholder:text-white/30"
          />
        </GradientInput>
        {tocado.nome && errors.nome && (
          <p className="mt-1 text-xs text-red-400">{errors.nome}</p>
        )} */}

        <label className="mt-4 block text-sm text-white/80">
          Insira seu Telefone
        </label>
        <GradientInput>
          <input
            type="tel"
            value={maskPhone(registerData.telefone)}
            onChange={(e) =>
              setRegisterData((prev) => ({ ...prev, telefone: e.target.value }))
            }
            onBlur={() => setTocado((t) => ({ ...t, telefone: true }))}
            inputMode="numeric"
            maxLength={15}
            placeholder="(xx) xxxxx-xxxx"
            className="w-full bg-transparent px-4 py-3 text-base outline-none placeholder:text-white/30"
          />
        </GradientInput>
        {tocado.telefone && errors.telefone && (
          <p className="mt-1 text-xs text-red-400">{errors.telefone}</p>
        )}

        {/* <label className="mt-4 block text-sm text-white/80">
          Digite sua Senha
        </label>
        <GradientInput>
          <input
            type="password"
            value={registerData.senha}
            onChange={(e) =>
              setRegisterData((prev) => ({ ...prev, senha: e.target.value }))
            }
            onBlur={() => setTocado((t) => ({ ...t, senha: true }))}
            placeholder="••••"
            className="w-full bg-transparent px-4 py-3 text-base outline-none placeholder:text-white/30"
          />
        </GradientInput>
        {tocado.senha && errors.senha && (
          <p className="mt-1 text-xs text-red-400">{errors.senha}</p>
        )} */}

        <div
          onClick={() =>
            setRegisterData((prev) => ({
              ...prev,
              aceitouTermos: !prev.aceitouTermos,
            }))
          }
          className="mt-4 flex items-start gap-3"
        >
          <button
            type="button"
            className={cn(
              "mt-0.5 grid h-5 w-5 place-items-center rounded-md border border-[#FF0080]",
              registerData.aceitouTermos ? "bg-[#FF0080]" : "bg-transparent",
            )}
            aria-pressed={registerData.aceitouTermos}
          >
            {registerData.aceitouTermos && <Check className="h-4 w-4" />}
          </button>
          <p className="text-xs leading-5 text-white/80">
            Aceito os{" "}
            <a className="underline">termos de uso e política de privacidade</a>
            <br />e tenho mais de +18 anos
          </p>
        </div>
        {tocado.aceitouTermos && errors.aceitouTermos && (
          <p className="mt-1 text-xs text-red-400">{errors.aceitouTermos}</p>
        )}

        <div className="flex w-full items-center gap-2">
          <button
            disabled={loading}
            onClick={() => setCurrent("password")}
            className="mt-4 w-full rounded-lg border-2 border-[#FF0080] px-4 py-3 font-medium text-white disabled:opacity-50"
          >
            Tenho Conta
          </button>
          <GradientButton
            type="submit"
            disabled={loading}
            className={cn(loading && "opacity-80")}
          >
            {loading ? "Cadastrando..." : "Cadastrar"}
          </GradientButton>
        </div>
        {/*        
        <button
          type="submit"
          disabled={invalid || loading}
          className="mt-6 w-full rounded-xl bg-gradient-to-r from-[#FF0080] to-[#7928CA] p-[2px] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <div className="w-full rounded-[10px]">
            <div className="px-6 py-3 text-center text-lg font-bold text-white">
              {loading ? "Enviando..." : "Cadastrar - se"}
            </div>
          </div>
        </button> */}
      </form>
    </div>
  );
}

/**
 * Wrapper que cria a moldura de gradiente ao redor do input,
 * imitando o look do mock.
 */
export function GradientInput({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-2 rounded-xl bg-gradient-to-r from-pink-500/70 via-fuchsia-500/70 to-purple-600/70 p-[1.5px]">
      <div className="rounded-[11px] bg-[#141414] ring-1 ring-white/5 transition duration-150 focus-within:ring-2 focus-within:ring-pink-500">
        {children}
      </div>
    </div>
  );
}
