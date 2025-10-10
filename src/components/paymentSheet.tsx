"use client";
import { StepKey, useActionSheetsContext } from "@/context/actionSheetsContext";
import { useCallback, useMemo, useState } from "react";
import { StepCPF } from "./payment-sheet/StepCPF";
import { StepEmail } from "./payment-sheet/StepEmail";
import { StepPassword } from "./payment-sheet/StepPassword";
import { StepPix } from "./payment-sheet/StepPix";
// remove .tsx in import path
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import { StepPlans } from "./payment-sheet/StepPlans.tsx";
import RegisterCard from "./payment-sheet/StepRegister";
import { StepSuccess } from "./payment-sheet/StepSuccess";
import { Sheet, SheetContent } from "./sheet";

export type PaymentData = {
  email?: string;
  password?: string;
  planId?: string;
  cpf?: string;
  pixCode?: string;
  register?: string;
};

const ORDER: StepKey[] = [
  "email",
  "password",
  "plans",
  "cpf",
  "pix",
  "success",
  "register",
];

export function PaymentSheet() {
  const { open, closeSheet, current, setCurrent } = useActionSheetsContext();
  const [data, setData] = useState<PaymentData>({});

  const index = useMemo(() => ORDER.indexOf(current), [current]);
  const total = ORDER.length;

  const goNext = useCallback(
    (patch?: Partial<PaymentData>) => {
      setData((d) => ({ ...d, ...patch }));
      setCurrent((prev) => {
        const i = ORDER.indexOf(prev);
        return ORDER[Math.min(i + 1, ORDER.length - 1)];
      });
      if (current === "success") closeSheet();
    },
    [closeSheet, current, setCurrent],
  );

  const goBack = useCallback(() => {
    setCurrent((prev) => {
      const i = ORDER.indexOf(prev);
      return ORDER[Math.max(i - 1, 0)];
    });
  }, [setCurrent]);

  const resetAndClose = useCallback(() => {
    setCurrent("email");
    setData({});
    closeSheet();
  }, [closeSheet, setCurrent]);

  const handleNext = useCallback(() => goNext(), [goNext]);
  const [phone, setPhone] = useState<string>("");
  return (
    <Sheet open={open} onOpenChange={resetAndClose}>
      <SheetContent
        side="bottom"
        className={cn(
          // auto height; cap to viewport; enable scroll if needed
          "z-[999999999] w-full border-0 bg-gradient-to-b from-[#1B1418] to-[#19000c] px-1 pt-1 text-white lg:mx-auto lg:w-[500px]",
          "border border-[#FF0080]/20 border-b-transparent",
        )}
      >
        {/* Content wrapper uses natural height; no forced h/min-h */}
        <div className={cn("flex flex-col")}>
          {/* Banner */}

          {/* Scrollable body: it only scrolls when content exceeds max-h cap of the sheet */}
          <div className="overflow-visible px-5 pt-2 pb-4">
            {current !== "success" &&
              current !== "email" &&
              current !== "password" && (
                <button
                  onClick={goBack}
                  className="focus:ring-ring data-[state=open]:bg-secondary absolute top-4 left-2 opacity-70 ring-offset-[#FF0080] transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:pointer-events-none"
                >
                  <ArrowLeft className="h-6 w-6" />
                </button>
              )}

            {current === "email" && (
              <StepEmail
                phone={phone}
                setPhone={setPhone}
                initialEmail={data.email}
                onNext={(email) => goNext({ email })}
              />
            )}
            {current === "password" && (
              <StepPassword
                phone={phone}
                setPhone={setPhone}
                onNext={(password) => goNext({ password })}
              />
            )}
            {current === "plans" && (
              <StepPlans
                selectedId={"m1"}
                onNext={(planId) => goNext({ planId })}
              />
            )}
            {current === "register" && (
              <RegisterCard onNext={(register) => goNext({ register })} />
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

          {/* Sticky footer button: always visible without forcing the sheet height */}
        </div>
      </SheetContent>
    </Sheet>
  );
}
