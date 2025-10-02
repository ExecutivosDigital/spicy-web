"use client";
import { useMemo, useRef, useState } from "react";

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
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useApiContext } from "@/context/ApiContext";
import { useChatContext } from "@/context/chatContext";
import { useMediaQuery } from "@/hook/use-media-query";
import { cn } from "@/lib/utils";
import clsx from "clsx";
import { motion } from "framer-motion";
import {
  ArrowDown,
  ImageIcon,
  LayoutGrid,
  Loader,
  MessageCircle,
} from "lucide-react";
import { useCookies } from "next-client-cookies";
import { useRouter } from "next/navigation";
import Blank from "./blank";
import ContactList from "./contact-list";
import EmptyMessage from "./empty-message";
import MessageFooter from "./message-footer";
import Messages from "./messages";
import MyProfileHeader from "./my-profile-header";

export type GalleryItem = {
  src: string;
  alt?: string;
  badge?: string;
  locked?: boolean;
  poster?: string;
  mediaType?: "image" | "video";
  placeholder?: boolean;
};

const ChatPage = ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const router = useRouter();
  const cookies = useCookies();

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
  //region
  const [searchScrollId, setSearchScrollId] = useState<string | null>(null);
  const containerRef = useRef(null);
  const messageRefs = useRef<any>({});
  const [openQrCode, setOpenQrCode] = useState<boolean>(false);

  // const handleScrollToBottom = () => {
  //   const messageFilters = selectedChatMessages.filter((message) =>
  //     selectedChat?.instanceId
  //       ? message.instanceId === selectedChat?.instanceId
  //       : true,
  //   );

  //   const lastMessage = messageFilters[messageFilters.length - 1];

  //   if (!lastMessage) return;

  //   const container: any = containerRef.current;
  //   const messageElement = messageRefs.current[lastMessage.id];

  //   setIsAutoScrollEnabled(true);
  //   if (container && messageElement) {
  //     const containerRect = container.getBoundingClientRect();
  //     const messageRect = messageElement.getBoundingClientRect();
  //     const offset = messageRect.top - containerRect.top + container.scrollTop;

  //     container.scrollTo({
  //       top: offset,
  //       behavior: "smooth",
  //     });
  //   }
  // };

  const scrollToMessage = (id: string | null) => {
    setSearchScrollId(id);
    if (!id) return;
    const container: any = containerRef.current;
    const messageElement = messageRefs.current[id];

    if (container && messageElement) {
      const containerRect = container.getBoundingClientRect();
      const messageRect = messageElement.getBoundingClientRect();
      const offset = messageRect.top - containerRect.top + container.scrollTop;

      container.scrollTo({
        top: offset,
        behavior: "smooth",
      });
    }
  };

  //endregion

  const [isAutoScrollEnabled, setIsAutoScrollEnabled] = useState(true);
  const lastScrollTop = useRef(0);

  // useEffect(() => {
  //   if (
  //     selectedChatMessages.length > 0 &&
  //     query === "" &&
  //     isAutoScrollEnabled
  //   ) {
  //     handleScrollToBottom();
  //   }

  //   if (
  //     query !== "" &&
  //     chatMessageQuery !== query &&
  //     selectedChatMessages.length > 0 &&
  //     isAutoScrollEnabled
  //   ) {
  //     const messages = selectedChatMessages.filter((message) =>
  //       normalizeName(message.text).includes(normalizeName(query)),
  //     );

  //     setFilteredMessages(messages);

  //     setChatMessageQuery(query);

  //     if (messages.length > 0) {
  //       const lastMessage = messages[messages.length - 1];
  //       scrollToMessage(lastMessage.id);
  //     } else {
  //       handleScrollToBottom();
  //     }
  //   }
  // }, [
  //   selectedChatMessages,
  //   isAutoScrollEnabled,
  //   selectedChat?.instanceId,
  //   selectedChatId,
  // ]);

  // useEffect(() => {
  //   const chatElement: any = containerRef.current;
  //   const handleScroll = () => {
  //     const scrollTop = chatElement.scrollTop;
  //     const scrollHeight = chatElement.scrollHeight;
  //     const clientHeight = chatElement.clientHeight;

  //     // Se o usuário fez scroll para cima, desativa o auto scroll
  //     if (scrollTop < lastScrollTop.current) {
  //       setIsAutoScrollEnabled(false);
  //     }
  //     // Se o usuário fez scroll para baixo e chegou ao final da página
  //     else if (Math.abs(scrollTop + clientHeight - scrollHeight) <= 10) {
  //       setIsAutoScrollEnabled(true);
  //     }

  //     lastScrollTop.current = scrollTop;
  //   };

  //   if (chatElement) {
  //     chatElement.addEventListener("scroll", handleScroll);
  //   }

  //   return () => {
  //     if (chatElement) {
  //       chatElement.removeEventListener("scroll", handleScroll);
  //     }
  //   };
  // }, [containerRef.current, selectedChatId, selectedChat?.instanceId]);

  // useEffect(() => {
  //   const chatElement: any = containerRef.current;
  //   if (chatElement) {
  //     lastScrollTop.current = chatElement.scrollTop;
  //   }
  // }, [selectedChatId, selectedChat?.instanceId]);

  // useEffect(() => {
  //   setIsAutoScrollEnabled(true);
  // }, [selectedChatId]);

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
    router.replace(`/chat?id=${chatId}`);
    handleVerify(chatId);
    setShowInfo(false);
    setIsAutoScrollEnabled(true);
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
    <div className="flex h-screen flex-col lg:gap-2 xl:gap-5 rtl:space-x-reverse">
      {isLg && showContactSidebar && (
        <div
          className="bg-background/60 absolute inset-0 z-[998] w-screen flex-1 rounded-md backdrop-blur-sm backdrop-filter"
          onClick={() => setShowContactSidebar(false)}
        ></div>
      )}
      {isLg && showInfo && (
        <div
          className="bg-background/60 absolute inset-0 z-40 w-full flex-1 rounded-md backdrop-blur-sm backdrop-filter"
          onClick={() => setShowInfo(false)}
        ></div>
      )}
      <Header />
      <div className="relative flex-1 overflow-hidden">
        <motion.div
          ref={viewportRef}
          className="flex h-full w-[300vw]"
          animate={{
            x: page === 0 ? "0%" : page === 1 ? "-33.333%" : "-66.6666%",
          }}
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
                "absolute top-0 z-[999] w-10/12 max-w-[400px]": isLg,
                "flex-none lg:max-w-[250px] lg:min-w-[250px] xl:max-w-[350px] xl:min-w-[350px]":
                  !isLg,
                "left-0": isLg && showContactSidebar,
                "-left-full": isLg && !showContactSidebar,
              })}
            >
              <Card className="h-full pb-0">
                <CardHeader className="mb-0 border-none p-0">
                  <MyProfileHeader />
                </CardHeader>
                <CardContent className="w-full p-0 lg:h-[calc(100%-130px)] xl:h-[calc(100%-180px)]">
                  <div className="flex h-full flex-col">
                    <span className="ml-2 font-semibold text-zinc-400 lg:text-[7px] xl:text-xs">
                      Conversas Gerais
                    </span>
                    <ScrollArea className="w-full">
                      {isChatsLoading ? (
                        <Loader />
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
                      <CardContent className="relative h-full overflow-y-auto p-2">
                        <div
                          className="flex h-full w-full flex-col overflow-y-auto py-4 lg:py-2 xl:py-4"
                          ref={containerRef}
                        >
                          {isMessageLoading ? (
                            <Loader />
                          ) : (
                            <>
                              {isMessageLoading ? (
                                <EmptyMessage />
                              ) : (
                                selectedChatMessages.map(
                                  (message: MessageProps, i: number) => (
                                    <Messages
                                      key={`message-list-${i}`}
                                      message={message}
                                    />
                                  ),
                                )
                              )}
                            </>
                          )}
                        </div>
                        {!isAutoScrollEnabled &&
                          !isMessageLoading &&
                          selectedChatMessages.length !== 0 && (
                            <Button
                              // onClick={handleScrollToBottom}
                              size="icon"
                              variant="outline"
                              className="absolute right-1/2 bottom-4 z-[100]"
                            >
                              <ArrowDown />
                            </Button>
                          )}
                      </CardContent>
                      <CardFooter className="flex-none flex-col px-0 py-4 lg:py-2 xl:py-4">
                        <MessageFooter />
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
      {selectedChat && (
        <PixSheetSteps
          open={openQrCode}
          onOpenChange={setOpenQrCode}
          modelId={selectedChat.model.id}
          modelName={selectedChat?.model.name}
        />
      )}
    </div>
  );
};

export default ChatPage;
