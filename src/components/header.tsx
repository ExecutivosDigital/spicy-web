"use client";
import { ChatProps } from "@/@types/global";
import { useChatContext } from "@/context/chatContext";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import PixSheetSteps from "./PixSheetSteps";
type IconProps = { route: string; className?: string };

type ButtonProps = {
  route: string;
  className?: string;
  icon: React.ComponentType<IconProps>; // << aceita className
  label: string;
};
export function Header() {
  const { chats, selectedChatId, modelId, modelProfile } = useChatContext();
  const [openQrCode, setOpenQrCode] = useState<boolean>(false);
  const [selectedChat, setSelectedChat] = useState<ChatProps | null>(null);
  const router = useRouter();
  useEffect(() => {
    const chat = chats.find((chat) => chat.id === selectedChatId);
    if (chat) {
      setSelectedChat(chat);
    }
  }, [chats, selectedChatId]);
  type IconProps = { route: string; className?: string };

  type ButtonProps = {
    route: string;
    className?: string;
    icon: React.ComponentType<IconProps>; // << aceita className
    label: string;
  };
  const pathname = usePathname();
  function HomeIcon({ route, className }: IconProps) {
    const isActive = pathname === route;
    return (
      <Image
        src={isActive ? "/heart-pink.png" : "/heart.png"}
        alt="heart"
        width={20}
        height={20}
        className={cn("h-5 w-5", className)}
      />
    );
  }

  function GridIcon({ route, className }: IconProps) {
    const isActive = pathname === route;
    return (
      <Image
        src={isActive ? "/gallery-pink.png" : "/galery.png"}
        alt="gallery"
        width={20}
        height={20}
        className={cn("h-5 w-5", className)}
      />
    );
  }
  return (
    <>
      <header className="sticky top-0 z-20 flex flex-col justify-between border-b border-neutral-500/20 py-1 backdrop-blur-sm">
        <div className="flex flex-1 items-center gap-3 px-4 py-3 pt-0">
          <div className="relative">
            <img
              src={
                modelProfile ? modelProfile.photoUrl : "/gab/photos/profile.png"
              }
              alt="Gabi"
              className="h-10 w-10 rounded-full object-cover"
            />
            <span className="absolute -right-1 -bottom-1 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white" />
          </div>
          <div className="flex-1 leading-tight">
            <div className="flex items-center gap-2">
              <span className="text-[15px] font-extrabold">
                {modelProfile && modelProfile.name}
              </span>
              <Image
                src="/verify.png"
                alt="verificada"
                width={16}
                height={16}
              />
            </div>
            <div className="text-[12px] text-neutral-500">online agora</div>
          </div>
          <div className="items-center gap-1 text-neutral-400 sm:flex">
            <div className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-br from-[#FF0080] to-[#7928CA] px-2 py-2 text-xs text-white/80 opacity-100">
              {[
                // { label: "Chat", icon: HomeIcon, route: `/${modelId}/chat` },
                { label: "Galeria", icon: GridIcon, route: `/${modelId}` },
                // { label: "Perfil", icon: UserIcon as unknown as React.ComponentType<IconProps>, route: "/chat" },
              ].map((it: ButtonProps, idx) => (
                <button
                  key={idx}
                  onClick={() => (window.location.href = it.route)}
                  className={cn(
                    "flex flex-col items-center justify-center gap-1 px-2.5 py-1 hover:text-white",
                    pathname === it.route &&
                      "cursor-pointer rounded-full bg-white text-[#FF0080]",
                  )}
                >
                  <it.icon route={it.route} className="h-5 w-5" />
                  {it.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>
      {selectedChat && openQrCode && (
        <PixSheetSteps
          open={openQrCode}
          onClose={() => setOpenQrCode(false)}
          modelId={selectedChat.model.id}
          modelName={selectedChat?.model.name}
          modelPhoto={selectedChat?.model.photoUrl}
        />
      )}
    </>
  );
}
