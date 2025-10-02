"use client";
import { Icon } from "@iconify/react";
const EmptyMessage = () => {
  return (
    <div className="flex h-full flex-col justify-center">
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center text-center">
          <Icon icon="typcn:messages" className="text-default-300 text-7xl" />
          <div className="text-default-500 mt-4 text-lg font-medium">
            Sem Mensagens{" "}
          </div>
          <div className="text-default-400 mt-1 text-sm font-medium">
            Essa conversa ainda nao possui mensagens
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmptyMessage;
