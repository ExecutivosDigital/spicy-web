import { Sheet, SheetContent } from "@/components/sheet";
import { ApiCall } from "@/utils/apiCall";
import { maskPhone } from "@/utils/masks";
import { phoneNumberRegex } from "@/utils/phoneNumberRegex";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import * as React from "react";
import { CopyBlock } from "./CopyBlock";
import { QrBlock } from "./QrBlock";
import { AvatarGroup } from "./avatar-block";

export type StepKey =
  | "intro"
  | "qr_copy"
  | "phone"
  | "qr_confirm"
  | "plans"
  | "whatsapp";

export type Plan = {
  id: string;
  priceLabel: string; // ex: "R$29,90"
  periodLabel: string; // ex: "15 dias"
  avatars?: string[]; // urls das fotos
  value?: number;
  best?: boolean; // destaca como melhor custo
};

export type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  /** textos */
  modelName?: string; // ex: "Gabi"
  titleIntro?: string;
  subtitleIntro?: string;

  /** QRCode (opcional vindo do pai — o componente agora prioriza os valores locais) */
  dataUrl?: string; // "data:image/png;base64,..."
  copyAndPaste?: string; // payload pix
  copied?: boolean;
  onCopy?: () => void;

  /** confirmação */
  onConfirmPayment?: () => void;

  /** planos */
  plans?: Plan[];
  selectedPlanId?: string;
  onPlanSelect?: (id: string) => void;

  /** whatsapp */
  whatsAppPlans?: Plan[];
  selectedWhatsAppPlanId?: string;
  onWhatsAppPlanSelect?: (id: string) => void;

  /** controle de step (opcional) */
  initialStep?: StepKey;
  onStepChange?: (s: StepKey) => void;

  /** telefone do usuário (controlado pelo pai) */
  phoneNumber: string;
  setPhoneNumber: (phone: string) => void;

  className?: string;

  /** animação automática da intro para planos (padrão: true) */
  autoIntroToPlans?: boolean;
  /** tempo antes de animar a intro (ms) — padrão 1500 */
  introDelayMs?: number;
};

const stepOrder: StepKey[] = [
  "intro",
  "phone",
  "qr_copy",
  "qr_confirm",
  "plans",
];

export default function PixSheetSteps({
  open,
  onOpenChange,
  modelName = "Modelo",
  titleIntro,
  subtitleIntro,
  dataUrl,
  copyAndPaste,
  copied,
  onCopy,
  onConfirmPayment,
  plans = [],
  selectedPlanId,
  onPlanSelect,
  phoneNumber,
  setPhoneNumber,
  initialStep = "intro",
  onStepChange,
  className,
  autoIntroToPlans = true,
  introDelayMs = 1500,
}: Props) {
  const [step, setStep] = React.useState<StepKey>(initialStep);
  const [showHeaderHero, setShowHeaderHero] = React.useState(false);
  const [plansReady, setPlansReady] = React.useState(false);
  const router = useRouter();
  // Valores selecionados (mantidos como no seu componente)
  const [planValue, setPlanValue] = React.useState(0);

  // === NOVO: estados para os dados gerados pelo ApiCall ===
  const [localQrBase64, setLocalQrBase64] = React.useState<string>("");
  const [localPayload, setLocalPayload] = React.useState<string>("");
  const [loadingPix, setLoadingPix] = React.useState<boolean>(false);
  const localDataUrl = localQrBase64
    ? `data:image/png;base64,${localQrBase64}`
    : undefined;

  React.useEffect(() => {
    if (open) {
      setStep(initialStep);
      setShowHeaderHero(false);
      setPlansReady(false);
      // limpar QR/payload quando reabrir
      setLocalQrBase64("");
      setLocalPayload("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initialStep]);

  // sequência automática: esperar introDelayMs → mover hero para o topo → quando acabar, mostrar planos
  React.useEffect(() => {
    if (!open || step !== "intro" || !autoIntroToPlans) return;
    const t = setTimeout(
      () => setShowHeaderHero(true),
      Math.max(0, introDelayMs)
    );
    return () => clearTimeout(t);
  }, [open, step, autoIntroToPlans, introDelayMs]);

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
    onStepChange?.(s);
  };

  const next = () => {
    const i = stepOrder.indexOf(step);
    if (i < stepOrder.length - 1) setStepSafe(stepOrder[i + 1]);
  };

  // Handler padrão de cópia caso o pai não forneça
  const handleCopyFallback = React.useCallback(async () => {
    try {
      await navigator.clipboard.writeText(localPayload || copyAndPaste || "");
    } catch {
      alert(
        "Não foi possível copiar automaticamente. Selecione o texto e copie manualmente."
      );
    }
  }, [localPayload, copyAndPaste]);

  // Geração do Pix via ApiCall (você já possui este util)
  const generatePix = React.useCallback(async () => {
    const phone = phoneNumberRegex(phoneNumber);

    if (!phone) {
      alert("Digite seu telefone para gerar o Pix.");
      return false;
    }
    const planValueValid = typeof planValue === "number" && planValue >= 0;

    if (!planValueValid) {
      alert("Selecione um plano válido para continuar.");
      return false;
    }

    try {
      setLoadingPix(true);
      const response = await ApiCall({
        phone,
        value: planValue > 0 ? planValue : 30,
        name: modelName,
      });
      setLocalQrBase64(response.encodedImage);
      setLocalPayload(response.payload);
      return true;
    } catch {
      alert("Não foi possível gerar o Pix agora. Tente novamente.");
      return false;
    } finally {
      setLoadingPix(false);
    }
  }, [ApiCall, phoneNumber, planValue]);
  console.log("planValue: ", planValue);

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="bottom"
          className={clsx(
            "min-h-1/2 self-center flex z-[90999] flex-col items-center md:border-0 rounded-t-4xl md:rounded-t-none md:bg-transparent bg-white   w-[100vw]  justify-between",
            className
          )}
          overlayClass="bg-[#BC5DFF]/20 backdrop-blur-sm"
          onKeyDown={(e: React.KeyboardEvent) => e.key === "Enter" && next()}
        >
          {/* container "cartão" */}
          <div className="w-full min-h-[40vh] md:min-h-[50vh] md:rounded-t-4xl lg:w-[500px] md:bg-white h-full flex p-2 text-neutral-900">
            <div className="rounded-2xl  flex flex-col w-full overflow-hidden">
              {/* header */}
              <header className="relative flex items-center justify-between gap-3 px-4 py-3 sm:px-5 sm:py-4">
                <div className="absolute inset-0 pointer-events-none">
                  <div className="h-full w-full px-4 sm:px-5 flex items-center">
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
                          <div className="leading-tight text-black">
                            <div className="text-sm t font-extrabold">
                              {titleIntro}
                            </div>
                            <div className="text-[11px] text-neutral-500">
                              {subtitleIntro}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </header>

              {/* conteúdo por step */}
              <div className="p-2 flex flex-1 flex-col gap-5">
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
                              {titleIntro}
                            </h4>
                            <p className="mt-1 text-sm text-neutral-500">
                              {subtitleIntro}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {step === "phone" && (
                  <div className="w-full flex-1 flex flex-col gap-4">
                    <span>Estamos quase lá</span>
                    <span>Para gerar o Pix, digite o seu telefone</span>

                    <div className="flex flex-col flex-1 gap-2">
                      <label className="text-sm font-semibold">Telefone</label>
                      <div className="flex flex-col gap-2">
                        <input
                          type="tel"
                          className="w-full rounded-xl border border-neutral-200 px-4 py-2 text-sm"
                          placeholder="DDD XXXXXX"
                          maxLength={15}
                          value={maskPhone(phoneNumber)}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => router.push("/terms")}
                        className="text-center cursor-pointer mt-auto"
                      >
                        <span>
                          Ao continuar você aceita nosso{" "}
                          <span className="underline">
                            termos de uso e politica de privacidade
                          </span>
                        </span>
                      </button>
                    </div>

                    <div className="flex mt-auto flex-row gap-1">
                      <motion.button
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        onClick={() => setStepSafe("plans")}
                        className="mt-2 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 px-4 py-3 text-sm font-black text-white"
                      >
                        Voltar
                      </motion.button>

                      <motion.button
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        onClick={async () => {
                          const ok = await generatePix();
                          if (ok) setStepSafe("qr_copy");
                        }}
                        className="mt-2 flex-1 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 px-4 py-3 text-sm font-black text-white disabled:opacity-60"
                        disabled={loadingPix || !phoneNumber}
                      >
                        {loadingPix
                          ? "Gerando Pix..."
                          : `Ver Pix ${
                              modelName === "José" ? "do" : "da"
                            } ${modelName}`}
                      </motion.button>
                    </div>
                  </div>
                )}

                {step === "qr_copy" && (
                  <>
                    {/* Prioriza dados locais; se vazio, usa os props do pai */}
                    <QrBlock dataUrl={localDataUrl || dataUrl} />
                    <CopyBlock
                      copyAndPaste={localPayload || copyAndPaste}
                      copied={copied}
                      onCopy={onCopy ?? handleCopyFallback}
                      modelName={modelName}
                    />

                    <div className="flex items-center justify-between gap-2 pt-1">
                      <button
                        onClick={() => setStepSafe("plans")}
                        className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold hover:bg-neutral-50 transition"
                      >
                        Voltar
                      </button>
                      <button
                        onClick={() => setStepSafe("qr_confirm")}
                        className="rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 px-4 py-2 text-sm font-black text-white"
                      >
                        Confirmar Pagamento
                      </button>
                    </div>
                  </>
                )}

                {step === "qr_confirm" && (
                  <div className=" flex-1 flex flex-col justify-between ">
                    {/* <QrBlock dataUrl={localDataUrl || dataUrl} /> */}
                    <div className="flex flex-col items-center gap-2">
                      <div className="h-28 w-28 min-w-28 overflow-hidden rounded-full bg-red-500 border-4 border-white shadow-xl">
                        <img
                          src={
                            modelName === "José"
                              ? "/ze/photos/avt.png"
                              : "/gab/avt.png"
                          }
                          alt="avatar"
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex flex-row gap-2 items-center">
                        <div className="font-extrabold">
                          {modelName === "José"
                            ? "@ze.rodrigues66"
                            : "@gabi_ferreiraofc"}
                        </div>
                        <Image
                          src="/verify.png"
                          alt="gabi"
                          width={20}
                          height={20}
                          className="h-6 w-6"
                        />
                      </div>
                      <p className="text-xs text-neutral-500 text-center -mt-1">
                        Você contribuiu, e eu fico muito feliz
                      </p>
                    </div>
                    <div className="flex items-center justify-between gap-2 pt-1">
                      <button
                        onClick={() => setStepSafe("phone")}
                        className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold hover:bg-neutral-50 transition"
                      >
                        Voltar
                      </button>
                      <button
                        onClick={onConfirmPayment}
                        className="rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 px-4 py-2 text-sm font-black text-white"
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
                              onPlanSelect?.(p.id);
                              setPlanValue(p.value || 0);
                            }}
                            className={clsx(
                              "flex w-full items-center justify-between rounded-xl border px-3 py-3",
                              selected
                                ? "border-violet-500 bg-violet-50"
                                : "border-neutral-200 bg-white"
                            )}
                          >
                            <div className="flex items-center gap-3">
                              <div className="flex relative items-center justify-center">
                                <AvatarGroup urls={p.avatars} />
                                {selected && (
                                  <div className="rounded-full absolute items-center justify-center flex p-1 bg-white">
                                    <Check className="h-5 w-5 text-emerald-500 rounded-full" />
                                  </div>
                                )}
                              </div>
                              <div className="text-left">
                                <div className="text-[15px] font-extrabold leading-tight">
                                  {p.priceLabel}
                                </div>
                                <div className="text-[12px] text-neutral-500">
                                  {p.periodLabel}
                                </div>
                              </div>
                            </div>
                          </motion.button>
                        );
                      })}
                    </motion.div>

                    <motion.button
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      onClick={() => setStepSafe("phone")}
                      className="mt-2 w-full rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 px-4 py-3 text-sm font-black text-white"
                    >
                      Continuar
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
