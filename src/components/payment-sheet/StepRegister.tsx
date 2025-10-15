"use client";

import { useActionSheetsContext } from "@/context/actionSheetsContext";
import { useApiContext } from "@/context/ApiContext";
import { useChatContext } from "@/context/chatContext";
import { cn } from "@/lib/utils";
import { maskPhone } from "@/utils/masks";
import { useCookies } from "next-client-cookies";
import Image from "next/image";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { GradientButton } from "./ui";

/**
 * RegisterCard
 * ————————————————————————————————————————————
 * Componente de registro inspirado no layout do screenshot.
 *
 * • Next.js/React + TailwindCSS
 * • Validação simples no cliente
 * • Máscara de telefone brasileira
 * • Botão com gradiente
 * • Inputs com borda/halo em gradiente
 * • Callback onSubmit para integrar com seu backend
 */

export type RegisterData = {
  nome: string;
  telefone: string;
  senha: string;
  aceitouTermos: boolean;
};

export default function RegisterCard({ onNext }: { onNext: () => void }) {
  const cookies = useCookies();
  const { setToken } = useApiContext();
  const { handleGetChats, setUserId, handleVerify, modelId } = useChatContext();
  const { setCurrent } = useActionSheetsContext();

  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState("");
  const [aceitouTermos, setAceitouTermos] = useState(true);
  const [loading, setLoading] = useState(false);
  const [tocado, setTocado] = useState<{ [k: string]: boolean }>({});
  // helpers ————————————————————————————————————————
  const telMask = (v: string) => {
    // remove tudo que não é dígito
    v = v.replace(/\D/g, "");

    // (xx) xxxxx-xxxx
    if (v.length > 11) v = v.slice(0, 11);
    if (v.length > 6)
      return `(${v.slice(0, 2)}) ${v.slice(2, 7)}-${v.slice(7)}`;
    if (v.length > 2) return `(${v.slice(0, 2)}) ${v.slice(2)}`;
    if (v.length > 0) return `(${v}`;
    return v;
  };

  const telefoneFormatado = useMemo(() => telMask(telefone), [telefone]);

  const errors = useMemo(() => {
    const e: Partial<Record<keyof RegisterData, string>> = {};
    if (!nome.trim()) e.nome = "Informe seu nome";
    if (telefone.length < 11) e.telefone = "Telefone inválido";
    if (senha.length < 4) e.senha = "Mínimo 4 caracteres";
    if (!aceitouTermos) e.aceitouTermos = "É necessário aceitar os termos";
    return e;
  }, [nome, telefoneFormatado, senha, aceitouTermos]);

  const invalid = Object.keys(errors).length > 0;
  const { PostAPI } = useApiContext();
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTocado({ nome: true, telefone: true, senha: true, aceitouTermos: true });
    if (invalid) return;
    try {
      setLoading(true);
      const response = await PostAPI(
        "user/register",
        {
          name: nome,
          password: senha,
          phone: telefoneFormatado,
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
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="relative m-4 overflow-hidden">
        {/* Give the banner a predictable but responsive height */}
        <div className="relative flex aspect-[16/6] w-full items-center justify-center">
          <Image
            src="/gab/photos/10.jpeg"
            alt="Gabriela"
            fill
            className="rounded-3xl object-cover"
          />
          <div className="absolute flex w-full items-center justify-center gap-3 select-none">
            <div className="flex flex-row items-center rounded-lg bg-black/60 p-2">
              <Image
                src="/logoBunny.png"
                alt="Spicy.ai"
                width={32}
                height={32}
                className="h-8 w-8 min-w-8 object-contain"
              />
              <div className="rounded-full p-2 leading-tight">
                <p className="text-sm tracking-widest text-white">
                  MODELS.CLUB
                </p>
                <p className="text-[10px] tracking-[0.3em] text-white uppercase">
                  Digital Models
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="w-full text-white">
        {/* header */}

        <h1 className="mt-6 text-xl font-semibold">
          Faça seu Cadastro Gratuito
        </h1>

        {/* NOME */}
        <label className="mt-6 block text-sm text-white/80">
          Insira seu Nome
        </label>
        <GradientInput>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            onBlur={() => setTocado((t) => ({ ...t, nome: true }))}
            placeholder="Seu nome completo"
            className="w-full bg-transparent px-4 py-3 text-base outline-none placeholder:text-white/30"
          />
        </GradientInput>
        {tocado.nome && errors.nome && (
          <p className="mt-1 text-xs text-red-400">{errors.nome}</p>
        )}

        {/* TELEFONE */}
        <label className="mt-4 block text-sm text-white/80">
          Insira seu Telefone
        </label>
        <GradientInput>
          <input
            type="tel"
            value={maskPhone(telefone)}
            onChange={(e) => setTelefone(e.target.value)}
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

        {/* SENHA */}
        <label className="mt-4 block text-sm text-white/80">
          Digite sua Senha
        </label>
        <GradientInput>
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            onBlur={() => setTocado((t) => ({ ...t, senha: true }))}
            placeholder="••••"
            className="w-full bg-transparent px-4 py-3 text-base outline-none placeholder:text-white/30"
          />
        </GradientInput>
        {tocado.senha && errors.senha && (
          <p className="mt-1 text-xs text-red-400">{errors.senha}</p>
        )}

        {/* termos */}
        <div
          onClick={() => setAceitouTermos((v) => !v)}
          className="mt-4 flex items-start gap-3"
        >
          <button
            type="button"
            className={`mt-0.5 grid h-5 w-5 place-items-center rounded-md border border-[#FF0080] ${
              aceitouTermos ? "bg-[#FF0080]" : "bg-transparent"
            }`}
            aria-pressed={aceitouTermos}
          >
            {aceitouTermos && <span className="text-xs">✓</span>}
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
          <GradientButton
            type="submit"
            disabled={loading}
            className={cn(loading && "opacity-80")}
          >
            {loading ? "Cadastrando..." : "Cadastrar"}
          </GradientButton>
          <button
            disabled={loading}
            onClick={() => setCurrent("password")}
            className="mt-4 w-full rounded-lg border-2 border-[#FF0080] px-4 py-3 font-medium text-white disabled:opacity-50"
          >
            Tenho Conta
          </button>
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
