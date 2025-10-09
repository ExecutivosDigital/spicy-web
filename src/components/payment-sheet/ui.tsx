"use client";

import { cn } from "@/lib/utils";
import * as React from "react";

export function GradientButton({
  className,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "mt-4 w-full rounded-lg px-4 py-3 font-medium text-white",
        "bg-gradient-to-br from-[#FF0080] to-[#7928CA]",
        "disabled:opacity-50",
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function TextField({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "w-full rounded-lg border border-white/10 bg-[#0f0f0f] px-4 py-3 text-sm text-white",
        "placeholder:text-white/40 focus:ring-2 focus:ring-pink-500/40 focus:outline-none",
        className,
      )}
      {...props}
    />
  );
}
