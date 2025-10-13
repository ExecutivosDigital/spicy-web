"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useMediaQuery } from "@/hook/use-media-query";

const Blank = ({ mblChatHandler }: { mblChatHandler: () => void }) => {
  const isLg = useMediaQuery("(max-width: 1024px)");
  return (
    <Card className="flex-1">
      <CardContent className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center text-center">
          <div className="text-default-500 mt-4 text-lg font-medium md:mt-0">
            Nenhuma mensagem ainda...
          </div>
          <p className="text-default-400 mt-1 text-sm font-medium">
            Selecione um contato e comece uma nova conversa
          </p>
          {isLg && (
            <Button onClick={mblChatHandler} className="mt-2">
              Começar Conversa
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default Blank;
