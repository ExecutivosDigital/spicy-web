"use client";
import { StepKey, useActionSheetsContext } from "@/context/actionSheetsContext";
import { useCallback, useState } from "react";
import { StepCPF } from "./payment-sheet/StepCPF";
import { StepPassword } from "./payment-sheet/StepPassword";
import { StepPix } from "./payment-sheet/StepPix";
// remove .tsx in import path
import { cn } from "@/lib/utils";
import { StepPlans } from "./payment-sheet/StepPlans";
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

  const [phone, setPhone] = useState<string>("");

  console.log("current: ", current);
  return (
    <Sheet open={open} onOpenChange={resetAndClose}>
      <SheetContent
        overlayClass="bg-black/40 backdrop-blur"
        side="bottom"
        className={cn(
          // auto height; cap to viewport; enable scroll if needed
          "z-[999999999] w-full rounded-t-4xl border-0 bg-gradient-to-b from-[#1B1418] to-[#19000c] px-1 pt-1 text-white lg:mx-auto lg:w-[500px]",
          "border border-[#FF0080]/20 border-b-transparent",
        )}
      >
        <div className={cn("flex flex-col")}>
          {/* Banner */}

          <div className="overflow-visible px-5 pt-2 pb-4">
            {/* {current === "register" && (
              <button
                onClick={() => setCurrent("password")}
                className="absolute top-3 left-3 opacity-70 transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
            )} */}
            {current === "password" && (
              <StepPassword
                phone={phone}
                setPhone={setPhone}
                onNext={closeSheet}
              />
            )}
            {current === "plans" && <StepPlans />}
            {current === "register" && (
              <RegisterCard onNext={() => setCurrent("plans")} />
            )}
            {current === "cpf" && (
              <StepCPF initialCPF={data.cpf} onNext={() => setCurrent("pix")} />
            )}
            {current === "pix" && (
              <StepPix onPaid={() => setCurrent("success")} />
            )}
            {current === "success" && <StepSuccess onClose={resetAndClose} />}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
