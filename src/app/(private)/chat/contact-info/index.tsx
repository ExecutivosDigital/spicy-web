"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChatContext } from "@/context/chatContext";
import { Icon } from "@iconify/react";
import { Settings } from "lucide-react";
import "swiper/css";
import { twMerge } from "tailwind-merge";

interface Props {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  searchScrollId: string | null;
  scrollToMessage: (messageId: string | null) => void;
}

const ContactInfo = ({ isOpen, setIsOpen }: Props) => {
  const { selectedChat } = useChatContext();

  return (
    <>
      <div
        className={twMerge(
          "right-0 z-50 flex h-full w-[285px] flex-col",
          isOpen ? "absolute xl:relative" : "hidden xl:relative",
        )}
      >
        <div className="bg-card text-card-foreground flex h-full flex-col rounded-md shadow-sm">
          <CardHeader className="relative mb-0 py-2 lg:space-y-1 lg:p-1 xl:space-y-1.5 xl:p-2">
            <Button
              onClick={() => {}}
              className="absolute top-4 right-4 h-6 w-6 p-1 lg:top-2 lg:right-2 xl:top-4 xl:right-4 xl:h-8 xl:w-8"
              size="icon"
            >
              <Settings size={14} />
            </Button>
            <div className="absolute xl:hidden">
              <Button
                size="icon"
                className="bg-default-100 text-default-500 hover:bg-default-200 rounded-full"
                onClick={() => setIsOpen(!isOpen)}
              >
                <Icon icon="formkit:arrowright" className="text-sm" />
              </Button>
            </div>
            <div className="flex flex-col items-center">
              <Avatar className="bg-primary/10 h-8 w-8 rounded-full p-1 xl:h-16 xl:w-16">
                {selectedChat?.model.photoUrl && (
                  <AvatarImage
                    src={selectedChat?.model.photoUrl}
                    alt=""
                    className="rounded-full"
                  />
                )}
                <AvatarFallback>{selectedChat?.model.name}</AvatarFallback>
              </Avatar>
              <div className="text-default-900 mt-1 text-xs font-semibold xl:text-xl">
                {selectedChat?.model.name}
              </div>
              <span className="text-default-600 mt-2 text-[9px] italic lg:mt-0 xl:mt-2 xl:text-xs">
                {/* {selectedChat?.} */}
              </span>
              <span className="text-default-600 line-clamp-1 text-center text-xs capitalize"></span>
            </div>
          </CardHeader>

          <ScrollArea className="h-full w-72 overflow-x-auto">
            <Accordion
              type="single"
              collapsible
              className="dark:bg-accent w-full divide-y border-y dark:shadow-none"
            >
              <AccordionItem
                value="item-1"
                className="dark:bg-accent rounded-t-none rounded-b border border-x-0 shadow-none lg:p-2 xl:p-3 dark:shadow-none"
              >
                <AccordionTrigger className="text-xs xl:text-sm">
                  Arquivos e Imagens
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex w-full items-center justify-center gap-4">
                    <Button
                      size="sm"
                      className="w-max text-xs lg:h-max lg:px-2 lg:py-1 xl:h-9 xl:px-3 xl:py-2 xl:text-sm"
                    >
                      Mídia
                    </Button>
                    <Button
                      size="sm"
                      className="w-max text-xs lg:h-max lg:px-2 lg:py-1 xl:h-9 xl:px-3 xl:py-2"
                    >
                      Arquivos
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="item-3"
                className="dark:bg-accent rounded-none border border-x-0 border-b-0 shadow-none lg:p-2 xl:p-3 dark:shadow-none"
              >
                <AccordionTrigger className="text-xs xl:text-sm">
                  Tarefas
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex w-full items-center justify-around gap-4">
                    <Button
                      className="lg:h-max lg:px-2 lg:py-1 xl:h-9 xl:px-3 xl:py-2"
                      variant="outline"
                    >
                      Ver Tarefas do Cliente
                    </Button>
                    <Button className="lg:h-max lg:px-2 lg:py-1 xl:h-9 xl:px-3 xl:py-2">
                      +
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="item-5"
                className="dark:bg-accent rounded-none shadow-none lg:p-2 xl:p-3 dark:shadow-none"
              >
                <AccordionTrigger className="text-xs xl:text-sm">
                  Observações do Cliente
                </AccordionTrigger>
              </AccordionItem>
            </Accordion>
          </ScrollArea>
        </div>
      </div>
    </>
  );
};

export default ContactInfo;
