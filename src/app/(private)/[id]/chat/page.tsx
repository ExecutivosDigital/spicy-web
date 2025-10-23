"use client";
import { MessageProps } from "@/@types/global";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useActionSheetsContext } from "@/context/actionSheetsContext";
import { useChatContext } from "@/context/chatContext";
import { ArrowDown, X } from "lucide-react";
import Image from "next/image";
import { use, useEffect, useRef, useState } from "react";
import EmptyMessage from "./empty-message";
import { Header } from "./header";
import MessageFooter from "./message-footer";
import Messages from "./messages";

export type GalleryItem = {
  src: string;
  alt?: string;
  badge?: string;
  locked?: boolean;
  poster?: string;
  mediaType?: "image" | "video";
  placeholder?: boolean;
};

const ChatPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);
  const {
    selectedChatId,
    selectedChatMessages,
    isMessageLoading,
    selectedChat,
    setModelId,
  } = useChatContext();
  const { setSendToCheckout } = useActionSheetsContext();

  const [isMediaOpen, setIsMediaOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [isAutoScrollEnabled, setIsAutoScrollEnabled] = useState(true);
  const lastScrollTop = useRef(0);
  const lastMsgIdRef = useRef<string | null>(null);
  const containerRef = useRef(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setSendToCheckout(false);
  }, []);

  const handleScrollToBottom = () => {
    setIsAutoScrollEnabled(true);
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  };

  useEffect(() => {
    if (selectedChatMessages.length > 0 && isAutoScrollEnabled) {
      handleScrollToBottom();
    }
  }, [selectedChatMessages, isAutoScrollEnabled, selectedChat, selectedChatId]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const chatElement: any = containerRef.current;
    const handleScroll = () => {
      const scrollTop = chatElement.scrollTop;
      const scrollHeight = chatElement.scrollHeight;
      const clientHeight = chatElement.clientHeight;

      if (scrollTop < lastScrollTop.current) {
        setIsAutoScrollEnabled(false);
      } else if (Math.abs(scrollTop + clientHeight - scrollHeight) <= 10) {
        setIsAutoScrollEnabled(true);
      }

      lastScrollTop.current = scrollTop;
    };

    if (chatElement) {
      chatElement.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (chatElement) {
        chatElement.removeEventListener("scroll", handleScroll);
      }
    };
  }, [containerRef.current, selectedChatId, selectedChat]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const chatElement: any = containerRef.current;
    if (chatElement) {
      lastScrollTop.current = chatElement.scrollTop;
    }
  }, [selectedChatId, selectedChat]);

  useEffect(() => {
    const last = selectedChatMessages[selectedChatMessages.length - 1];
    if (!last) return;

    if (last.id !== lastMsgIdRef.current) {
      lastMsgIdRef.current = last.id;
      requestAnimationFrame(() => handleScrollToBottom());
    }
  }, [selectedChatMessages.length]);

  useEffect(() => {
    setIsAutoScrollEnabled(true);
  }, [selectedChatId]);

  useEffect(() => {
    if (id) {
      setModelId(id);
    }
  }, [id]);

  return (
    <div className="flex flex-1 justify-center gap-2 text-white xl:gap-5 rtl:space-x-reverse">
      <div className="relative h-full max-w-[540px] flex-1 overflow-hidden pb-4 md:rounded-md md:border md:px-4">
        <section className="relative flex h-full max-h-[100svh] w-[100%] flex-1 overflow-hidden">
          <div className="flex h-full w-full flex-1">
            <div className="flex h-full flex-1 space-x-5 lg:space-x-2 xl:space-x-5 rtl:space-x-reverse">
              <div className="h-full flex-1">
                <Card className="relative flex h-full flex-col">
                  <Header />
                  <CardContent className="custom-scrollbar relative flex-1 overflow-y-auto p-2 pb-8">
                    <div
                      className="custom-scrollbar flex w-full flex-1 flex-col overflow-y-auto py-4 lg:py-2 xl:py-4"
                      ref={containerRef}
                    >
                      {isMessageLoading ? (
                        <>
                          {Array.from({ length: 3 }).map((_, index) => (
                            <div key={index}>
                              <div className="group mb-4 flex max-w-[calc(100%-8px)] animate-pulse flex-col items-end justify-end gap-1 text-transparent lg:mb-2 xl:mb-4 xl:max-w-[calc(100%-50px)]">
                                <div className="flex w-60 min-w-10 justify-center gap-1 rounded-3xl rounded-br-none bg-neutral-800 p-2 shadow-sm">
                                  <div className="group flex items-center gap-1">
                                    <div className="relative z-[1] break-normal whitespace-pre-wrap">
                                      .
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center justify-start gap-2 text-xs lg:text-[8px] xl:text-xs">
                                  .
                                </div>
                              </div>
                              <div className="group mb-4 ml-2 flex max-w-[calc(100%-8px)] animate-pulse flex-col items-start justify-start gap-1 space-x-2 text-transparent lg:mb-2 xl:mb-4 xl:ml-[50px] xl:max-w-[calc(100%-50px)] rtl:space-x-reverse">
                                <div className="flex w-60 min-w-10 justify-center gap-1 rounded-3xl rounded-bl-none bg-neutral-800 p-2 shadow-sm">
                                  <div className="flex items-center gap-1">
                                    .
                                  </div>
                                </div>
                                <div className="flex w-full items-center gap-2 text-end text-xs lg:text-[8px] xl:text-xs">
                                  <span className="text-default-500">
                                    <span>.</span>.
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </>
                      ) : (
                        <>
                          {isMessageLoading ||
                          selectedChatMessages.length === 0 ? (
                            <EmptyMessage />
                          ) : (
                            selectedChatMessages.map(
                              (message: MessageProps, i: number) => (
                                <Messages
                                  key={`message-list-${i}-${message.id}`}
                                  message={message}
                                />
                              ),
                            )
                          )}
                          <div ref={bottomRef} />
                        </>
                      )}
                    </div>
                    {!isAutoScrollEnabled &&
                      !isMessageLoading &&
                      selectedChatMessages.length !== 0 && (
                        <Button
                          onClick={handleScrollToBottom}
                          size="icon"
                          variant="outline"
                          className="absolute right-1/2 bottom-4 z-[100]"
                        >
                          <ArrowDown />
                        </Button>
                      )}
                  </CardContent>
                  <CardFooter className="flex-none flex-col p-0">
                    <MessageFooter
                      onSend={() => {
                        setIsAutoScrollEnabled(true);
                        handleScrollToBottom();
                      }}
                    />
                  </CardFooter>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </div>

      {selectedItem && isMediaOpen && (
        <div
          onClick={() => {
            setSelectedItem(null);
            setIsMediaOpen(false);
          }}
          className="fixed top-0 left-0 z-[9999] flex h-full w-full bg-black/20 backdrop-blur-sm"
        >
          {selectedItem.mediaType === "image" ? (
            <div
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
              }}
              className="relative mx-auto mt-[calc(50vh-300px)] h-min max-h-[90vh] w-80 overflow-hidden rounded-lg object-contain xl:mt-[calc(50vh-400px)] xl:h-[80vh] xl:w-auto"
            >
              <X
                className="absolute top-2 left-2 cursor-pointer"
                onClick={() => {
                  setSelectedItem(null);
                  setIsMediaOpen(false);
                }}
              />
              <Image
                src={selectedItem.src}
                alt={selectedItem.alt ?? ""}
                quality={100}
                width={1000}
                height={1500}
                className="h-full w-full"
              />
            </div>
          ) : (
            <div
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
              }}
              className="relative mx-auto mt-[calc(50vh-300px)] h-min max-h-[90vh] w-80 overflow-hidden rounded-lg object-contain xl:mt-[calc(50vh-400px)] xl:h-[80vh] xl:w-auto"
            >
              <X
                className="absolute top-2 left-2 cursor-pointer"
                onClick={() => {
                  setSelectedItem(null);
                  setIsMediaOpen(false);
                }}
              />
              <video
                src={selectedItem.src}
                controls
                autoPlay
                muted
                className="h-full w-full"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatPage;
