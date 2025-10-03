"use client";
import { ChatProps } from "@/@types/global";
import { useChatContext } from "@/context/chatContext";
import { Heart } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

export function Header() {
  const { chats, selectedChatId } = useChatContext();

  const [selectedChat, setSelectedChat] = useState<ChatProps | null>(null);

  useEffect(() => {
    const chat = chats.find((chat) => chat.id === selectedChatId);
    if (chat) {
      setSelectedChat(chat);
    }
  }, [chats, selectedChatId]);

  return (
    <header className="sticky top-0 z-20 h-16 min-h-16 border-b border-neutral-500 backdrop-blur-sm">
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="relative">
          <img
            src={selectedChat?.model.photoUrl}
            alt="Gabi"
            className="h-10 w-10 rounded-full object-cover"
          />
          <span className="absolute -right-1 -bottom-1 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white" />
        </div>
        <div className="flex-1 leading-tight">
          <div className="flex items-center gap-2">
            <span className="text-[15px] font-extrabold">
              {selectedChat?.model.name}
            </span>
            <Image src="/verify.png" alt="verificada" width={16} height={16} />
          </div>
          <div className="text-[12px] text-neutral-500">online agora</div>
        </div>
        <div className="items-center gap-1 text-neutral-400 sm:flex">
          <button className="flex items-center justify-center gap-2 rounded-lg border border-red-500 p-2 text-sm">
            <Heart />
            Enviar Presente
          </button>
        </div>
      </div>
    </header>
  );
}
