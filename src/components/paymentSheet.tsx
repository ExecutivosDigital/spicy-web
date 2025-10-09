"use client";

import { useActionSheetsContext } from "@/context/actionSheetsContext";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useCallback, useMemo, useState } from "react";
import { StepCPF } from "./payment-sheet/StepCPF";
import { StepEmail } from "./payment-sheet/StepEmail";
import { StepPassword } from "./payment-sheet/StepPassword";
import { StepPix } from "./payment-sheet/StepPix";
import { StepPlans } from "./payment-sheet/StepPlans.tsx";
import { StepSuccess } from "./payment-sheet/StepSuccess";
import { GradientButton } from "./payment-sheet/ui";
import { Sheet, SheetContent } from "./ui/sheet";

// steps

export type PaymentData = {
  email?: string;
  password?: string;
  planId?: string;
  cpf?: string;
  pixCode?: string;
};

export type StepKey =
  | "email"
  | "password"
  | "plans"
  | "cpf"
  | "pix"
  | "success";

const ORDER: StepKey[] = [
  "email",
  "password",
  "plans",
  "cpf",
  "pix",
  "success",
];

export function PaymentSheet() {
  const { open, closeSheet } = useActionSheetsContext();
  const [current, setCurrent] = useState<StepKey>("email");
  const [data, setData] = useState<PaymentData>({});

  const index = useMemo(() => ORDER.indexOf(current), [current]);
  const total = ORDER.length;

  const goNext = useCallback((patch?: Partial<PaymentData>) => {
    setData((d) => ({ ...d, ...patch }));
    setCurrent((prev) => {
      const i = ORDER.indexOf(prev);
      return ORDER[Math.min(i + 1, ORDER.length - 1)];
    });
    if (current === "success") closeSheet();
  }, []);

  const goBack = useCallback(() => {
    setCurrent((prev) => {
      const i = ORDER.indexOf(prev);
      return ORDER[Math.max(i - 1, 0)];
    });
  }, []);

  const resetAndClose = useCallback(() => {
    setCurrent("email");
    setData({});
    closeSheet();
  }, [closeSheet]);
  const handleNext = useCallback(() => goNext(), [goNext]);
  return (
    <Sheet open={open} onOpenChange={resetAndClose} defaultOpen>
      <SheetContent
        side="bottom"
        className={cn(
          "z-[999999999] flex min-h-[60vh] w-full flex-col justify-between rounded-t-2xl border-0 p-0",
          "lg:mx-auto lg:w-[500px]",
          "border border-[#FF0080] bg-[#171717] text-white",
        )}
      >
        <div
          className={cn(
            `flex h-[60vh] flex-col p-4`,
            current === "pix" && "h-[80vh]",
            current === "plans" && "h-[70vh]",
          )}
        >
          <div className="relative h-32 overflow-hidden rounded-2xl bg-[#2A2A2E]">
            <div className="absolute inset-0 flex items-center justify-center">
              <Image
                src="/banner1.png"
                alt="Gabriela"
                width={10000}
                height={10000}
                className="h-[100%] w-[100%] rounded-xl bg-white"
              />
            </div>

            <span className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[11px] text-emerald-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Online
            </span>
          </div>

          <div className="mt-4 flex-1 overflow-y-auto px-5 pt-1 pb-2">
            {current === "email" && (
              <StepEmail
                initialEmail={data.email}
                onNext={(email) => goNext({ email })}
              />
            )}
            {current === "password" && (
              <StepPassword onNext={(password) => goNext({ password })} />
            )}
            {current === "plans" && (
              <StepPlans
                selectedId={data.planId}
                onNext={(planId) => goNext({ planId })}
              />
            )}
            {current === "cpf" && (
              <StepCPF
                initialCPF={data.cpf}
                onNext={(cpf) => goNext({ cpf })}
              />
            )}
            {current === "pix" && (
              <StepPix
                email={data.email!}
                planId={data.planId!}
                onPaid={(pixCode) => goNext({ pixCode })}
              />
            )}
            {current === "success" && <StepSuccess onClose={resetAndClose} />}
          </div>
          <GradientButton onClick={() => handleNext()}>
            {current === "success"
              ? "Fechar"
              : current === "pix"
                ? "Ja fiz o pagamento"
                : "Avançar"}
          </GradientButton>
          {/* <StepFooter stepIndex={index} totalSteps={total} /> */}
        </div>
      </SheetContent>
    </Sheet>
  );
}
