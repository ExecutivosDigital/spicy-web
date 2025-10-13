"use client";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useEffect, useState } from "react";

export function LoadingOverlay() {
  const [delay, setDelay] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setDelay(true);
    }, 500);
  }, []);

  return (
    <div
      className={cn(
        "fixed top-0 left-0 z-[999] h-screen w-[300vw] bg-gradient-to-r from-[#FF008040] via-[#7928CA40] to-transparent backdrop-blur-md transition duration-1000",
        delay && "pointer-events-none -translate-x-[200vw] opacity-0 delay-500",
      )}
    >
      <Image
        src="/logo.png"
        alt=""
        width={500}
        height={500}
        className="absolute top-1/2 left-[50vw] h-32 w-96 -translate-x-1/2 -translate-y-1/2 scale-95 object-contain"
      />
    </div>
  );
}
