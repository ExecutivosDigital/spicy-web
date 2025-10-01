"use client";
import { useRef, useState } from "react";

import { useCookies } from "next-client-cookies";

import { MessageProps } from "@/@types/global";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChatContext } from "@/context/chatContext";
import { useMediaQuery } from "@/hook/use-media-query";
import { cn } from "@/lib/utils";
import { ArrowDown, Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import Blank from "./blank";
import ContactInfo from "./contact-info";
import ContactList from "./contact-list";
import EmptyMessage from "./empty-message";
import MessageFooter from "./message-footer";
import MessageHeader from "./message-header";
import Messages from "./messages";
import MyProfileHeader from "./my-profile-header";

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
    setChats,
    setSelectedChat,
    selectedChat,
  } = useChatContext();

  //region
  const [searchScrollId, setSearchScrollId] = useState<string | null>(null);
  const containerRef = useRef(null);
  const messageRefs = useRef<any>({});

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

  const openChat = (chatId: string) => {
    router.replace(`/chat?id=${chatId}`);
    setSelectedChatId(chatId);
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

  return (
    <div className="max-lg:app-height xl:app-height flex h-[calc(100vh-200px)] gap-5 lg:h-[calc(100vh-100px)] lg:gap-2 xl:gap-5 rtl:space-x-reverse">
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
      <div
        className={cn("flex-none transition-all duration-150", {
          "absolute top-0 z-[999] h-screen w-10/12 max-w-[400px]": isLg,
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
              <div className="border-t pt-2"></div>
            </div>
          </CardContent>
        </Card>
      </div>
      {selectedChatId ? (
        <div className="flex-1">
          <div className="flex h-full space-x-5 lg:space-x-2 xl:space-x-5 rtl:space-x-reverse">
            <div className="flex-1">
              <Card className="flex h-full flex-col">
                <CardHeader className="mb-0 flex-none p-0">
                  <MessageHeader
                    setShowInfo={setShowInfo}
                    showInfo={showInfo}
                    mblChatHandler={() => setShowContactSidebar(true)}
                  />
                </CardHeader>

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
                <CardFooter className="border-border flex-none flex-col border-t px-0 py-4 lg:py-2 xl:py-4">
                  <MessageFooter />
                </CardFooter>
              </Card>
            </div>

            <ContactInfo
              isOpen={showInfo}
              setIsOpen={setShowInfo}
              searchScrollId={searchScrollId}
              scrollToMessage={(id) => scrollToMessage(id)}
            />
          </div>
        </div>
      ) : (
        <Blank mblChatHandler={() => setShowContactSidebar(true)} />
      )}
    </div>
  );
};

export default ChatPage;
