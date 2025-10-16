"use client";

import { useApiContext } from "@/context/ApiContext";
import { useActionSheetsContext } from "@/context/actionSheetsContext";
import { useChatContext } from "@/context/chatContext";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { CopyBlock } from "../CopyBlock";
import { QrBlock } from "../QrBlock";
import { GradientButton } from "./ui";

export function StepPix({}: { onPaid: (pixCode: string) => void }) {
  const { selectedPlan, setCurrent } = useActionSheetsContext();
  const { modelId, isPaymentConfirmed } = useChatContext();
  const { PostAPI } = useApiContext();
  const [generatingPix, setGeneratingPix] = useState(true);
  const [hasCopied, setHasCopied] = useState(false);
  const [pix, setPix] = useState<{
    encodedImage: string;
    payload: string;
  } | null>(null);

  async function handleGeneratePix() {
    setGeneratingPix(true);
    try {
      const response = await PostAPI(
        `/user-signature/pix/${selectedPlan}`,
        {
          modelId,
        },
        true,
      );

      if (response.status === 200) {
        setPix(response.body.payment);
      } else {
        toast.error("Erro ao gerar PIX. Tente novamente.");
      }
    } catch (error) {
      console.error("Erro ao gerar PIX:", error);
      toast.error("Erro ao gerar PIX. Tente novamente.");
    } finally {
      setGeneratingPix(false);
    }
  }

  useEffect(() => {
    handleGeneratePix();
  }, []);

  useEffect(() => {
    if (isPaymentConfirmed) {
      toast.success("Pagamento confirmado!");
      setCurrent("success");
    }
  }, [isPaymentConfirmed]);

  const handleCopyFallback = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(pix?.payload as string);
      setHasCopied(true);
    } catch {
      alert(
        "Não foi possível copiar automaticamente. Selecione o texto e copie manualmente.",
      );
    }
  }, [pix?.payload]);

  return (
    <div className="space-y-4">
      <h2 className="text-center text-lg font-semibold">Faça seu pagamento</h2>
      <div className="flex flex-row items-center justify-center gap-4 px-4">
        <div className="h-1 w-12 rounded-full bg-gradient-to-r from-[#FF0080] to-[#7928CA]"></div>
        <div className="h-1 w-12 rounded-full bg-gradient-to-r from-[#FF0080] to-[#7928CA]"></div>
        <div className="h-1 w-12 rounded-full bg-gradient-to-r from-[#FF0080] to-[#7928CA] opacity-20"></div>
      </div>
      {generatingPix || !pix ? (
        <div className="flex h-80 w-full flex-col items-center justify-center gap-8">
          <Image alt="fire" width={400} height={400} src="/logo.png" />
          <span>Estamos gerando o Pagamento</span>
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <>
          <QrBlock dataUrl={`data:image/png;base64,${pix?.encodedImage}`} />
          <CopyBlock
            copyAndPaste={pix?.payload}
            copied={hasCopied}
            onCopy={handleCopyFallback}
          />
        </>
      )}
      <GradientButton disabled={true} onClick={handleGeneratePix}>
        {"Aguardando pagamento no banco"}
      </GradientButton>
    </div>
  );
}
