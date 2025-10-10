"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useChatContext } from "@/context/chatContext";
import { useMediaQuery } from "@/hook/use-media-query";
import { Menu } from "lucide-react";
import Image from "next/image";

interface Props {
  setShowInfo: (value: boolean) => void;
  showInfo: boolean;
  mblChatHandler: () => void;
}

const MessageHeader = ({ setShowInfo, showInfo, mblChatHandler }: Props) => {
  const { selectedChat } = useChatContext();
  const isLg = useMediaQuery("(max-width: 1023px)");

  return (
    <>
      <div className="flex w-full justify-between p-2">
        <div className="flex items-center gap-3">
          {isLg && (
            <Menu
              className="text-default-600 h-5 w-5 cursor-pointer"
              onClick={mblChatHandler}
            />
          )}
          <div
            onClick={() => setShowInfo(!showInfo)}
            className="relative inline-block"
          >
            <Avatar className="h-7 w-7 xl:h-10 xl:w-10">
              {selectedChat?.model.photoUrl && (
                <AvatarImage src={selectedChat?.model.photoUrl} alt="" />
              )}
              <AvatarFallback>{selectedChat?.model.name}</AvatarFallback>
            </Avatar>
          </div>
          <div className="hidden lg:block">
            <div className="text-default-900 text-[9px] font-medium xl:text-sm">
              <span className="relative">{selectedChat?.model.name}</span>
            </div>
            <span className="text-default-500 text-xs"></span>
          </div>
        </div>

        <div
          className="h-5 w-5 xl:h-8 xl:w-8"
          onClick={() => setShowInfo(!showInfo)}
        >
          <Image
            src="/Icons/profile.svg"
            alt=""
            width={300}
            height={300}
            className="w-full"
          />
        </div>
      </div>
    </>
  );
};

export default MessageHeader;
