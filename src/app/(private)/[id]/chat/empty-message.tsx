"use client";
import { useChatContext } from "@/context/chatContext";
import { Icon } from "@iconify/react";
const EmptyMessage = () => {
  const { modelProfile } = useChatContext();

  return (
    <div className="flex h-full flex-col justify-center">
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center text-center">
          <Icon icon="typcn:messages" className="text-7xl text-[#FF0080]" />
          <div className="text-default-500 mt-4 text-lg font-medium"> </div>
          <div className="text-default-400 mt-1 text-sm font-medium">
            Comece a conversar com {modelProfile && modelProfile.name}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmptyMessage;
