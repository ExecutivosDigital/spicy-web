"use client";

import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export function Footer() {
  const pathname = usePathname();
  function HomeIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M12 3l9 8h-3v9h-5v-6H11v6H6v-9H3l9-8z" />
      </svg>
    );
  }
  function GridIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z" />
      </svg>
    );
  }
  function HeartIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M12 21s-7-4.6-9.5-7.7C.7 10.3 2.4 6 6.4 6c2.2 0 3.6 1.3 4.6 2.6C12.9 7.3 14.3 6 16.5 6c4 0 5.7 4.3 3.9 7.3C19 16.4 12 21 12 21z" />
      </svg>
    );
  }
  function UserIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M12 12a5 5 0 100-10 5 5 0 000 10zm0 2c-5 0-9 2.7-9 6v2h18v-2c0-3.3-4-6-9-6z" />
      </svg>
    );
  }
  return (
    <footer className="fixed right-0 bottom-0 left-0">
      <div className="mx-auto w-full max-w-[520px]">
        <div className="mb-2 flex items-center justify-between rounded-2xl bg-gradient-to-br from-[#FF0080] to-[#7928CA] px-8 py-3 text-xs text-white/80">
          {[
            { label: "Chat", icon: GridIcon, route: "/" },
            { label: "Galeria", icon: HomeIcon, route: "/new" },
            { label: "Perfil", icon: UserIcon, route: "/chat" },
          ].map((it, idx) => (
            <button
              key={idx}
              onClick={() => (window.location.href = it.route)}
              className={cn(
                `flex h-12 w-16 flex-col items-center justify-center gap-1 hover:text-white`,
                pathname === it.route &&
                  "rounded-lg bg-white px-4 text-[#FF0080]",
              )}
            >
              <it.icon className="h-5 w-5" />
              {it.label}
            </button>
          ))}
        </div>
      </div>
    </footer>
  );
}
