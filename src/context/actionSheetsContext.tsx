"use client";
import { createContext, useContext, useState } from "react";

export type StepKey =
  | "email"
  | "password"
  | "plans"
  | "cpf"
  | "pix"
  | "register"
  | "success";
interface ActionSheetsContextProps {
  open: boolean;
  firstOpenSheet: boolean;
  openSheet: () => void;
  closeSheet: () => void;
  current: StepKey;
  setCurrent: React.Dispatch<React.SetStateAction<StepKey>>;
}

export const ActionSheetsContext = createContext<
  ActionSheetsContextProps | undefined
>(undefined);

export const ActionSheetsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [open, setOpen] = useState(false);
  const [firstOpenSheet, setFirstOpenSheet] = useState(true);
  const [current, setCurrent] = useState<StepKey>("email");

  const openSheet = () => {
    setOpen(true);
    setFirstOpenSheet(false);
  };

  const closeSheet = () => setOpen(false);

  return (
    <ActionSheetsContext.Provider
      value={{
        open,
        firstOpenSheet,
        openSheet,
        closeSheet,
        current,
        setCurrent,
      }}
    >
      {children}
    </ActionSheetsContext.Provider>
  );
};
export function useActionSheetsContext() {
  const context = useContext(ActionSheetsContext);
  if (!context) {
    throw new Error(
      "useActionSheetsContext deve ser usado dentro de um ActionSheetsProvider",
    );
  }
  return context;
}
