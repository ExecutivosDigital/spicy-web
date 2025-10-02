"use client";
import { MessageProps } from "@/@types/global";
import PixSheetSteps from "@/components/PixSheetSteps";
import { GiftsBento } from "@/components/bento-cards";
import { GalleryMosaicPager } from "@/components/galery";
import { Header } from "@/components/header";
import {
  gallery1,
  gallery2,
  gallery3,
  gallery4,
  gallery5,
} from "@/components/midia";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useApiContext } from "@/context/ApiContext";
import { useChatContext } from "@/context/chatContext";
import { useMediaQuery } from "@/hook/use-media-query";
import { cn } from "@/lib/utils";
import clsx from "clsx";
import { motion } from "framer-motion";
import {
  ArrowDown,
  ChevronLeft,
  ImageIcon,
  LayoutGrid,
  MessageCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import Blank from "./blank";
import ContactList from "./contact-list";
import EmptyMessage from "./empty-message";
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

const ChatPage = () => {
  const router = useRouter();
  const {
    chats,
    isChatsLoading,
    selectedChatId,
    setSelectedChatId,
    selectedChatMessages,
    isMessageLoading,
    setSelectedChat,
    selectedChat,
  } = useChatContext();
  const [page, setPage] = useState<0 | 1 | 2>(1);
  const pagesX = ["0%", "-33.3333%", "-66.6666%"];
  const initialPageRef = useRef(page);
  const lastMsgIdRef = useRef<string | null>(null);
  const containerRef = useRef(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [openQrCode, setOpenQrCode] = useState<boolean>(false);

  const handleScrollToBottom = () => {
    setIsAutoScrollEnabled(true);
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  };

  const [isAutoScrollEnabled, setIsAutoScrollEnabled] = useState(true);
  const lastScrollTop = useRef(0);

  useEffect(() => {
    if (selectedChatMessages.length > 0 && isAutoScrollEnabled) {
      handleScrollToBottom();
    }
  }, [selectedChatMessages, isAutoScrollEnabled, selectedChat, selectedChatId]);

  useEffect(() => {
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
    const chatElement: any = containerRef.current;
    if (chatElement) {
      lastScrollTop.current = chatElement.scrollTop;
    }
  }, [selectedChatId, selectedChat]);

  useEffect(() => {
    const last = selectedChatMessages[selectedChatMessages.length - 1];
    if (!last) return;

    // If the last message changed, we just appended one → scroll
    if (last.id !== lastMsgIdRef.current) {
      lastMsgIdRef.current = last.id;
      // next frame to ensure layout is ready
      requestAnimationFrame(() => handleScrollToBottom());
    }
  }, [selectedChatMessages.length]); // only care that the list grew

  useEffect(() => {
    setIsAutoScrollEnabled(true);
  }, [selectedChatId]);

  const [showContactSidebar, setShowContactSidebar] = useState<boolean>(false);

  const [showInfo, setShowInfo] = useState<boolean>(false);
  const { GetAPI } = useApiContext();

  async function handleVerify(chatId: string) {
    const chat = chats.find((chat) => chat.id === chatId);

    if (!chat) return;
    const response = await GetAPI(
      `/signature/validation/${chat?.model.id}`,
      true,
    );
    console.log("response: ", response);
    if (response.status === 403) {
      setOpenQrCode(true);
    }
    setSelectedChat(chat);
    setSelectedChatId(chatId);
  }

  const openChat = (chatId: string) => {
    router.replace(`/?id=${chatId}`);
    handleVerify(chatId);
    setShowInfo(false);
    setIsAutoScrollEnabled(true);
    setShowContactSidebar(false);
  };

  // async function handleSetUnreadMessages(id: string) {
  //   const userToken = cookies.get(token);

  //   const connect = await AuthPutAPI(`/message/status/${id}`, {}, userToken);

  //   if (connect.status === 200) {
  //     const chat = chats.find((chat) => chat.id === id);

  //     if (chat) {
  //       setChats((prevChats) => {
  //         return prevChats.map((chat) => {
  //           if (chat.id === id) {
  //             return { ...chat, hasUnreadMessages: true };
  //           }
  //           return chat;
  //         });
  //       });
  //     }

  //     if (selectedChatId === id && selectedChat) {
  //       setSelectedChat(null);
  //       setSelectedChatId(null);
  //       router.replace(`/chat`);
  //     }
  //   }
  // }

  // useEffect(() => {
  //   setPageName("Chat de Clientes");
  // }, []);

  const isLg = useMediaQuery("(max-width: 1023px)");

  // function nameContainsQuery(name: string) {
  //   return normalizeName(name).includes(normalizeName(query));
  // }

  // function sortByQueryMatch(clients: ClientChatProps[]) {
  //   return clients.sort((a, b) => {
  //     const aMatch = nameContainsQuery(a.name);
  //     const bMatch = nameContainsQuery(b.name);

  //     if (aMatch && !bMatch) return -1; // a vem antes
  //     if (!aMatch && bMatch) return 1; // b vem antes
  //     return 0; // mantém a ordem
  //   });
  // }

  function BottomBar() {
    return (
      <nav className="w-full pb-4">
        <div className="mx-auto max-w-md px-3 pb-[env(safe-area-inset-bottom)]">
          <div className="flex h-12 items-stretch justify-around rounded-2xl border border-neutral-200 bg-white shadow-lg">
            {[
              { i: 0, label: "Presentes", Icon: LayoutGrid },
              { i: 1, label: "Chat", Icon: MessageCircle },
              { i: 2, label: "Galeria", Icon: ImageIcon },
            ].map(({ i, label, Icon }) => (
              <button
                key={i}
                onClick={() => setPage(i as 0 | 1 | 2)}
                className={clsx(
                  "flex flex-1 items-center justify-center gap-1 text-[12px] font-semibold",
                  page === i ? "text-violet-600" : "text-neutral-500",
                )}
                aria-label={label}
              >
                <Icon className="h-5 w-5" />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>
    );
  }

  /* ========================= Chat ========================= */
  // function Bubble({ msg }: { msg: ChatMessage }) {
  //   const mine = msg.sender === "me";
  //   return (
  //     <div
  //       className={clsx(
  //         "flex items-end gap-2",
  //         mine ? "justify-end" : "justify-start"
  //       )}
  //     >
  //       {!mine && (
  //         <img
  //           src="/gab/avt.png"
  //           className="h-6 w-6 rounded-full object-cover"
  //           alt="Gabi"
  //         />
  //       )}
  //       <div
  //         className={cn(
  //           "max-w-[78%] rounded-2xl flex flex-col bg-neutral-100 text-lg font-semibold text-neutral-900 rounded-bl-none px-3 py-2  shadow-sm",
  //           msg.kind === "image" && "px-1 py-1 bg-transparent",
  //           mine && "bg-[#E55C00] rounded-bl-2xl rounded-br-none  text-white "
  //         )}
  //       >
  //         {msg.kind === "text" && <p>{msg.text}</p>}
  //         {msg.kind === "image" && (
  //           <img
  //             src={msg.url}
  //             alt="enviado"
  //             className="rounded-lg max-h-[220px] object-cover"
  //           />
  //         )}
  //         {msg.kind === "audio" && (
  //           <audio src={msg.url} controls className="w-48" />
  //         )}
  //         <div
  //           className={clsx(
  //             "mt-1 text-sm opacity-70",
  //             mine ? "text-white self-end" : "text-neutral-500"
  //           )}
  //         >
  //           {new Date(msg.ts).toLocaleTimeString()}
  //         </div>
  //       </div>
  //       {!mine && (
  //         <button
  //           aria-label="Curtir"
  //           onClick={() =>
  //             setMessages((m) =>
  //               m.map((x) => (x.id === msg.id ? { ...x, liked: !x.liked } : x))
  //             )
  //           }
  //           className="p-1 -mb-0.5"
  //         >
  //           <Heart
  //             className={clsx(
  //               "h-5 w-5 transition",
  //               msg.liked
  //                 ? "fill-rose-500 text-rose-500"
  //                 : "text-neutral-400 hover:text-rose-500"
  //             )}
  //           />
  //         </button>
  //       )}
  //     </div>
  //   );
  // }

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [selectedTab, setSelectedTab] = useState(0); // 0: tudo, 1: fotos desbloq, 2: fotos bloqueadas (dot), 3: vídeos (dot)
  function isVideoItem(it: GalleryItem) {
    if (it.mediaType) return it.mediaType === "video";
    return /\.(mp4|webm|ogg)$/i.test(it.src);
  }
  type TabKey = "all" | "photos_unlocked" | "videos";

  function filterByTab(items: GalleryItem[], tabKey: TabKey) {
    switch (tabKey) {
      case "photos_unlocked":
        return items.filter((it) => !isVideoItem(it) && !it.locked);
      case "videos":
        return items.filter((it) => isVideoItem(it));
      case "all":
      default:
        return items;
    }
  }

  // lista plana com tudo (desordenado como você já tem)
  const allItems: GalleryItem[] = useMemo(
    () => [...gallery1, ...gallery2, ...gallery3, ...gallery4, ...gallery5],
    [],
  );

  // map de abas para a mesma regra usada no pager interno
  const tabMap: Record<number, TabKey> = {
    0: "all",
    1: "photos_unlocked",
    2: "videos",
  };

  // coleção filtrada — usada pela Lightbox para ficar consistente com o Pager
  const filtered = useMemo(
    () => filterByTab(allItems, tabMap[selectedTab] ?? "all"),
    [allItems, selectedTab],
  );

  // Lightbox aceita fotos e vídeos; passamos poster/mediaType se houver
  const lightboxItems = useMemo(
    () =>
      filtered.map((it) => ({
        src: it.src,
        alt: it.alt ?? "",
        poster: it.poster,
        mediaType: it.mediaType,
      })),
    [filtered, tabMap],
  );
  const viewportRef = useRef<HTMLDivElement | null>(null);

  return (
    <div className="flex h-screen flex-col pb-20 lg:gap-2 xl:gap-5 xl:pb-0 rtl:space-x-reverse">
      {isLg && showInfo && (
        <div
          className="bg-background/60 absolute inset-0 z-40 w-full flex-1 rounded-md backdrop-blur-sm backdrop-filter"
          onClick={() => setShowInfo(false)}
        ></div>
      )}
      <div className="relative flex-1 overflow-hidden">
        <motion.div
          className="flex h-full w-[300vw]"
          initial={false}
          style={{ x: pagesX[initialPageRef.current] }} // render in the right spot
          animate={{ x: pagesX[page] }} // animate only on later changes
          transition={{ type: "spring", damping: 30, stiffness: 250 }}
        >
          {/* 0 – Bento gifts */}
          <section className="w-[100%] overflow-y-auto">
            <GiftsBento />
          </section>

          {/* 1 – Chat */}
          <section className="flex w-[100%] overflow-hidden">
            {/* <Chat /> */}
            <div
              className={cn("flex-none transition-all duration-150", {
                "absolute top-0 z-[999] h-full w-80 max-w-[400px]": isLg,
                "flex-none lg:max-w-[250px] lg:min-w-[250px] xl:max-w-[350px] xl:min-w-[350px]":
                  !isLg,
                "left-screen bg-white": isLg && showContactSidebar,
                "-left-full": isLg && !showContactSidebar,
              })}
            >
              <Card className="h-full rounded-none pb-0">
                <div className="relative h-16 border-b border-neutral-100">
                  <ChevronLeft
                    className="absolute top-1/2 left-2 -translate-y-1/2 lg:hidden"
                    onClick={() => setShowContactSidebar(false)}
                  />
                  <span className="flex h-full items-center justify-center text-sm font-semibold xl:text-lg">
                    Mensagens
                  </span>
                </div>
                <CardContent className="w-full p-0 lg:h-[calc(100%-130px)] xl:h-[calc(100%-180px)]">
                  <div className="flex h-full flex-col">
                    <span className="ml-2 font-semibold text-zinc-400 lg:text-[7px] xl:text-xs">
                      Conversas Gerais
                    </span>
                    <ScrollArea className="w-full">
                      {isChatsLoading ? (
                        <div
                          className={cn(
                            "animate-puls flex h-14 cursor-pointer border-l-2 border-transparent bg-zinc-200 px-3 py-2 transition duration-150 lg:max-w-[250px] lg:min-w-[250px] lg:gap-2 lg:px-2 lg:py-1 xl:max-w-[350px] xl:min-w-[350px] xl:gap-4 xl:px-3 xl:py-2",
                          )}
                        />
                      ) : chats.length !== 0 ? (
                        chats.map((chat) => (
                          <>
                            <ContactList
                              key={chat.id}
                              contact={chat}
                              openChat={openChat}
                            />
                          </>
                        ))
                      ) : (
                        <div className="mt-[50%] w-full text-center">
                          <span className="w-full text-center font-medium italic">
                            Nenhuma conversa encontrada <br /> com os filtros
                            selecionados
                          </span>
                        </div>
                      )}
                    </ScrollArea>
                  </div>
                </CardContent>
              </Card>
            </div>
            {selectedChatId ? (
              <div className="flex-1">
                <div className="flex h-full space-x-5 lg:space-x-2 xl:space-x-5 rtl:space-x-reverse">
                  <div className="flex-1">
                    <Card className="flex h-full flex-col">
                      <Header />
                      <CardContent className="relative h-full overflow-y-auto p-2">
                        <div
                          className="flex h-full w-full flex-col overflow-y-auto py-4 lg:py-2 xl:py-4"
                          ref={containerRef}
                        >
                          {isMessageLoading ? (
                            <>
                              {Array.from({ length: 3 }).map((_, index) => (
                                <div key={index}>
                                  <div className="group mb-4 flex max-w-[calc(100%-50px)] items-end justify-end space-x-2 lg:mb-2 xl:mb-4">
                                    <div className="flex w-60 animate-pulse flex-col items-end gap-1 rounded-2xl rounded-br-none bg-zinc-200 px-3 py-2 text-transparent">
                                      <div className="flex w-full items-center gap-2 text-end lg:text-[8px] xl:text-xs">
                                        <span>
                                          <span>.</span>.
                                        </span>
                                        <span></span>
                                        <div className="rounded-full lg:h-5 lg:w-5 xl:h-8 xl:w-8"></div>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        .
                                      </div>
                                    </div>
                                  </div>
                                  <div className="group mb-4 ml-[50px] flex max-w-[calc(100%-50px)] items-start justify-start space-x-2 lg:mb-2 xl:mb-4 rtl:space-x-reverse">
                                    <div className="flex w-60 animate-pulse flex-col items-end gap-1 rounded-2xl rounded-bl-none bg-zinc-200 px-3 py-2 text-transparent">
                                      <div className="flex w-full items-center gap-2 text-end lg:text-[8px] xl:text-xs">
                                        <span>
                                          <span>.</span>.
                                        </span>
                                        <span></span>
                                        <div className="rounded-full lg:h-5 lg:w-5 xl:h-8 xl:w-8"></div>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        .
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </>
                          ) : (
                            <>
                              {isMessageLoading ? (
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
                            // ensure future appends keep scrolling
                            setIsAutoScrollEnabled(true);
                            handleScrollToBottom();
                          }}
                        />
                      </CardFooter>
                    </Card>
                  </div>
                </div>
              </div>
            ) : (
              <Blank mblChatHandler={() => setShowContactSidebar(true)} />
            )}
          </section>

          {/* 2 – Galeria */}
          <section className="w-[100%] overflow-y-auto">
            {" "}
            <GalleryMosaicPager
              items={allItems}
              selectedTab={selectedTab}
              onItemClick={(globalIndex, _item) => {
                // índice já é relativo ao filtrado; a Lightbox usa a mesma coleção `filtered`
                setLightboxIndex(globalIndex);
                setLightboxOpen(true);
              }}
            />
          </section>
        </motion.div>
      </div>
      <BottomBar />
      {/* <Lightbox
        open={lightboxOpen}
        images={lightboxItems}
        index={lightboxIndex}
        onClose={() => setLightboxOpen(false)}
        setIndex={(i: number) => setLightboxIndex(i)}
        setOpenQrCode={() => console.log(false)}
      /> */}
      {selectedChat && openQrCode && (
        <PixSheetSteps
          open={openQrCode}
          onClose={() => setOpenQrCode(false)}
          modelId={selectedChat.model.id}
          modelName={selectedChat?.model.name}
        />
      )}
    </div>
  );
};

export default ChatPage;
