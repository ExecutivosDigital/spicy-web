import { Sheet, SheetContent } from "@/components/sheet";
import { useApiContext } from "@/context/ApiContext";
import { useChatContext } from "@/context/chatContext";
import { cn } from "@/lib/utils";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import Image from "next/image";
import * as React from "react";
import toast from "react-hot-toast";
import { CopyBlock } from "./CopyBlock";
import { QrBlock } from "./QrBlock";

export type StepKey = "intro" | "qr_copy" | "qr_confirm" | "plans" | "whatsapp";

export type Plan = {
  id: string;
  priceLabel: string; // ex: "R$29,90"
  periodLabel: string; // ex: "15 dias"
  avatars?: string[]; // urls das fotos
  value: number;
  best?: boolean; // destaca como melhor custo
};

export type Props = {
  open: boolean;
  onClose: () => void;
  modelName?: string;
  modelPhoto?: string;
  // titleIntro?: string;
  // subtitleIntro?: string;
  // dataUrl?: string;
  // copyAndPaste?: string;
  // copied?: boolean;
  // onCopy?: () => void;
  // onConfirmPayment?: () => void;
  // plans?: Plan[];
  // selectedPlanId?: string;
  // onPlanSelect?: (id: string) => void;
  // whatsAppPlans?: Plan[];
  // selectedWhatsAppPlanId?: string;
  // onWhatsAppPlanSelect?: (id: string) => void;
  // initialStep?: StepKey;
  // onStepChange?: (s: StepKey) => void;
  // className?: string;
  // autoIntroToPlans?: boolean;
  // introDelayMs?: number;
  modelId: string;
};

const stepOrder: StepKey[] = ["intro", "qr_copy", "qr_confirm", "plans"];

const plans: Plan[] = [
  {
    id: "1",
    priceLabel: "R$29,90",
    periodLabel: "15 dias",
    avatars: [],
    value: 29.9,
  },
];

export default function PixSheetSteps({
  open,
  onClose,
  modelId,
  modelName = "Modelo",
  modelPhoto,
  // titleIntro,
  // subtitleIntro,
  // dataUrl,
  // copyAndPaste,
  // copied,
  // onCopy,
  // onConfirmPayment,
  // plans = [],
  // selectedPlanId,
  // onPlanSelect,
  // initialStep = "intro",
  // onStepChange,
  // className,
  // autoIntroToPlans = true,
  // introDelayMs = 1500,
}: Props) {
  const { paymentWebhookConfirmation } = useChatContext();
  const { PostAPI } = useApiContext();
  const [step, setStep] = React.useState<StepKey>("intro");
  const [showHeaderHero, setShowHeaderHero] = React.useState(false);
  const [plansReady, setPlansReady] = React.useState(false);
  const [planValue, setPlanValue] = React.useState(0);
  const [localQrBase64, setLocalQrBase64] = React.useState<string>("");
  const [localPayload, setLocalPayload] = React.useState<string>("");
  const [loadingPix, setLoadingPix] = React.useState<boolean>(false);
  const [selectedPlanId, setSelectedPlanId] = React.useState<string>("");

  const localDataUrl = localQrBase64
    ? `data:image/png;base64,${localQrBase64}`
    : undefined;

  React.useEffect(() => {
    if (open) {
      setStep("intro");
      setShowHeaderHero(false);
      setPlansReady(false);
      setLocalQrBase64("");
      setLocalPayload("");
    }
  }, [open]);

  React.useEffect(() => {
    if (!open || step !== "intro") return;
    const t = setTimeout(() => setShowHeaderHero(true), Math.max(0, 1500));
    return () => clearTimeout(t);
  }, [open, step]);

  React.useEffect(() => {
    if (!showHeaderHero) return;
    const t = setTimeout(() => {
      setStepSafe("plans");
      setPlansReady(true);
    }, 450); // tempo da animação do hero
    return () => clearTimeout(t);
  }, [showHeaderHero]);

  const setStepSafe = (s: StepKey) => {
    setStep(s);
  };

  const next = () => {
    const i = stepOrder.indexOf(step);
    if (i < stepOrder.length - 1) setStepSafe(stepOrder[i + 1]);
  };

  const [copied, setCopied] = React.useState(false);

  // Efeito para resetar o estado de 'copiado' após um tempo
  React.useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 20000); // Resetar após 2 segundos
      return () => clearTimeout(timer);
    }
  }, [copied]);

  // Handler padrão de cópia caso o pai não forneça
  const handleCopyFallback = React.useCallback(async () => {
    try {
      await navigator.clipboard.writeText(localPayload);
      setCopied(true);
    } catch {
      alert(
        "Não foi possível copiar automaticamente. Selecione o texto e copie manualmente.",
      );
    }
  }, [localPayload]);

  const generatePix = async () => {
    const planValueValid = typeof planValue === "number" && planValue >= 0;

    if (planValue === 0) return toast.error("Selecione um plano");

    if (!planValueValid) {
      alert("Selecione um valor válido para continuar.");
      return false;
    }

    setLoadingPix(true);

    const payload = {
      modelId,
      value: planValue,
    };

    const response = await PostAPI("/signature/pix", payload, true);
    setLoadingPix(false);

    if (response.status !== 200) {
      return alert("Não foi possível gerar o Pix agora. Tente novamente.");
    }

    setLocalQrBase64(response.body.payment.encodedImage);
    setLocalPayload(response.body.payment.payload);
    setLoadingPix(false);
    setStepSafe("qr_copy");
    return true;
  };

  React.useEffect(() => {
    if (paymentWebhookConfirmation && step === "qr_copy") {
      setStepSafe("qr_confirm");
    }
  }, [paymentWebhookConfirmation]);

  return (
    <>
      <Sheet open={open} onOpenChange={onClose}>
        <SheetContent
          side="bottom"
          className={clsx(
            "z-[90999] flex min-h-1/2 w-[100vw] flex-col items-center justify-between gap-0 self-center rounded-t-4xl bg-neutral-900 p-0 outline-none md:rounded-t-none md:border-0 md:bg-transparent",
          )}
          overlayClass="bg-[#ff0080]/5 backdrop-blur-sm "
          onKeyDown={(e: React.KeyboardEvent) => e.key === "Enter" && next()}
        >
          {/* container "cartão" */}
          <div className="flex h-full min-h-[40vh] w-full p-2 text-neutral-900 md:min-h-[50vh] md:rounded-t-4xl md:bg-neutral-900 lg:w-[500px]">
            <div className="flex w-full flex-col overflow-hidden rounded-2xl">
              {/* header */}
              <header className="relative flex items-center justify-between gap-3 px-4 py-3 sm:px-5 sm:py-4">
                <div className="pointer-events-none absolute inset-0">
                  <div className="flex h-full w-full items-center px-4 sm:px-5">
                    <AnimatePresence initial={false}>
                      {showHeaderHero && (
                        <motion.div
                          layoutId="hero"
                          className="flex items-center gap-3"
                        >
                          <Image
                            alt="fire"
                            width={400}
                            height={400}
                            src={"/fire.png"}
                            className="h-6 w-6"
                          />
                          <div className="leading-tight text-white">
                            <div className="t text-sm font-extrabold">
                              Apoie o criador de Conteúdos
                            </div>
                            <div className="text-[11px] text-neutral-500">
                              Receba acesso ao chat e a conteúdos exclusivos
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </header>

              {/* conteúdo por step */}
              <div className="flex flex-1 flex-col gap-5 p-2">
                {/* STEP: Intro (origem do HERO) */}
                {step === "intro" && (
                  <div className="grid place-items-center gap-6">
                    <AnimatePresence initial={true}>
                      {!showHeaderHero && (
                        <motion.div
                          layoutId="hero"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 1 }}
                          className="grid place-items-center gap-3"
                        >
                          <Image
                            alt="fire"
                            width={400}
                            height={400}
                            src={"/fire.png"}
                            className="h-12 w-12"
                          />
                          <div className="text-center">
                            <h4 className="text-lg font-extrabold">
                              Apoie o criador de Conteúdos
                            </h4>
                            <p className="mt-1 text-sm text-neutral-500">
                              Receba acesso ao chat e a conteúdos exclusivos
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
                {step === "qr_copy" && (
                  <>
                    {/* Prioriza dados locais; se vazio, usa os props do pai */}
                    <QrBlock dataUrl={localDataUrl} />
                    <CopyBlock
                      copyAndPaste={localPayload}
                      copied={copied}
                      onCopy={handleCopyFallback}
                    />

                    <div className="flex items-center justify-between gap-2 pt-1">
                      <button
                        onClick={() => setStepSafe("plans")}
                        className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold transition hover:bg-neutral-50"
                      >
                        Voltar
                      </button>
                      <button
                        onClick={() => setStepSafe("qr_confirm")}
                        className="rounded-xl bg-gradient-to-r from-[#B273DF] to-[#ff0080] px-4 py-2 text-sm font-black text-white"
                      >
                        Confirmar Pagamento
                      </button>
                    </div>
                  </>
                )}

                {step === "qr_confirm" && (
                  <div className="flex flex-1 flex-col justify-between">
                    {/* <QrBlock dataUrl={localDataUrl || dataUrl} /> */}
                    <div className="flex flex-col items-center gap-2">
                      <div className="h-28 w-28 min-w-28 overflow-hidden rounded-full border-4 border-white shadow-xl">
                        <img
                          src={modelPhoto}
                          alt="avatar"
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex flex-row items-center gap-2">
                        <div className="font-extrabold text-white">
                          {modelName}
                        </div>
                        <Image
                          src="/verify.png"
                          alt="gabi"
                          width={20}
                          height={20}
                          className="h-6 w-6"
                        />
                      </div>
                      <p className="-mt-1 text-center text-xs text-neutral-500">
                        Você contribuiu, e eu fico muito feliz
                      </p>
                    </div>
                    <div className="flex items-center justify-between gap-2 pt-1">
                      <button
                        onClick={() => setStepSafe("qr_confirm")}
                        className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold transition hover:bg-neutral-50"
                      >
                        Voltar
                      </button>
                      <button
                        onClick={() => onClose()}
                        className="rounded-xl bg-gradient-to-r from-[#B273DF] to-[#ff0080] px-4 py-2 text-sm font-black text-white"
                      >
                        Finalizar
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP: Planos */}
                {step === "plans" && (
                  <>
                    <motion.p
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 }}
                      className="text-sm text-neutral-500"
                    >
                      Desbloqueie todos os conteúdos com os planos abaixo.
                    </motion.p>

                    <motion.div
                      variants={containerVariants}
                      initial="initial"
                      animate={plansReady ? "animate" : "initial"}
                      className="grid gap-2"
                    >
                      {plans.map((p) => {
                        const selected = selectedPlanId === p.id;
                        return (
                          <motion.button
                            key={p.id}
                            variants={itemVariants}
                            onClick={() => {
                              if (selectedPlanId !== "") {
                                setSelectedPlanId("");
                                setPlanValue(0);
                                return;
                              }
                              setSelectedPlanId(p.id);
                              setPlanValue(p.value);
                            }}
                            className={clsx(
                              "flex w-full items-center justify-between rounded-xl border-2 bg-transparent px-3 py-3 text-white",
                              selected
                                ? "border-[#ff0080]"
                                : "border-neutral-500",
                            )}
                          >
                            <div className="flex w-full items-center justify-between gap-3">
                              <div className="relative flex items-center gap-2">
                                <div
                                  className={cn(
                                    "flex items-center justify-center rounded-full border-2 p-1",
                                    selected
                                      ? "border-[#ff0080]"
                                      : "border-neutral-500",
                                  )}
                                >
                                  {selected ? (
                                    <Check className="h-5 w-5 rounded-full text-[#ff0080]" />
                                  ) : (
                                    <div className="h-5 w-5 rounded-full" />
                                  )}
                                </div>
                                <div className="text-[15px] leading-tight font-extrabold">
                                  {p.priceLabel}
                                </div>
                              </div>
                              <div className="text-[12px]">{p.periodLabel}</div>
                            </div>
                          </motion.button>
                        );
                      })}
                    </motion.div>

                    <motion.button
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      onClick={generatePix}
                      className="mt-2 w-full rounded-xl bg-gradient-to-r from-[#B273DF] to-[#ff0080] px-4 py-3 text-sm font-black text-white"
                    >
                      {loadingPix ? (
                        <Loader2 className="m-auto h-4 w-4 animate-spin" />
                      ) : planValue !== 0 ? (
                        "Gerar Pagamento"
                      ) : planValue === 0 ? (
                        "Selecione um plano"
                      ) : (
                        ""
                      )}
                    </motion.button>
                  </>
                )}
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

/* ===== Variants de animação ===== */
const containerVariants = {
  initial: {},
  animate: {
    transition: { staggerChildren: 0.06, delayChildren: 0.02 },
  },
};

const itemVariants = {
  initial: { opacity: 0, x: -24 },
  animate: { opacity: 1, x: 0 },
};
