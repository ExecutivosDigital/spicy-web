"use client";

import { ChatProps, MessageProps } from "@/@types/global";
import { createContext, useContext, useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";
import { useApiContext } from "./ApiContext";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

interface ChatContextProps {
  isChatsLoading: boolean;
  chats: ChatProps[];
  selectedChatId: string | null;
  selectedChat: ChatProps | null;
  selectedChatMessages: MessageProps[];
  isMessageLoading: boolean;
  setIsChatsLoading: (value: boolean) => void;
  setChats: (value: ChatProps[]) => void;
  setSelectedChatId: (value: string | null) => void;
  setSelectedChat: (value: ChatProps | null) => void;
  setSelectedChatMessages: (value: MessageProps[]) => void;
  setIsMessageLoading: (value: boolean) => void;
}

const ChatContext = createContext<ChatContextProps | undefined>(undefined);

interface ProviderProps {
  children: React.ReactNode;
}

export const ChatContextProvider = ({ children }: ProviderProps) => {
  const { GetAPI } = useApiContext();

  const [isChatsLoading, setIsChatsLoading] = useState(false);
  const [chats, setChats] = useState<ChatProps[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [selectedChat, setSelectedChat] = useState<ChatProps | null>(null);
  const [socket, setSocket] = useState<null | Socket>(null);

  const [selectedChatMessages, setSelectedChatMessages] = useState<
    MessageProps[]
  >([]);
  const [isMessageLoading, setIsMessageLoading] = useState(false);

  async function handleGetChats() {
    setIsChatsLoading(true);

    const connect = await GetAPI("/chat", false);

    if (connect.status === 200) {
      setChats(connect.body.chats);
    }

    setIsChatsLoading(false);
  }

  async function handleGetChatMessages() {
    if (!selectedChatId) return;

    setIsMessageLoading(true);

    const connect = await GetAPI(`/message/${selectedChatId}`, false);

    if (connect.status === 200) {
      setSelectedChatMessages(connect.body.messages);
      setSelectedChat(connect.body.chat);
    }

    setIsMessageLoading(false);
  }

  useEffect(() => {
    if (!socket) {
      const newSocket = io(baseURL, {
        extraHeaders: { "ngrok-skip-browser-warning": "any" },
      });
      setSocket(newSocket);
    } else {
      socket.on("newMessage", (message: MessageProps) => {
        if (message.chatId === selectedChatId) {
          setSelectedChatMessages((prev) => [...prev, message]);
        }
        setChats((prev) => {
          const chatIndex = prev.findIndex(
            (chat) => chat.id === message.chatId,
          );

          if (chatIndex !== -1) {
            const updatedChats = [...prev];
            const [movedChat] = updatedChats.splice(chatIndex, 1);
            movedChat.lastMessage = message.text;
            movedChat.lastMessageDate = message.createdAt;
            updatedChats.unshift(movedChat);
            return updatedChats;
          } else {
            return prev;
          }
        });
      });
    }
  }, [socket, selectedChatId]);

  useEffect(() => {
    handleGetChatMessages();
  }, [selectedChatId]);

  useEffect(() => {
    handleGetChats();
  }, []);

  return (
    <ChatContext.Provider
      value={{
        isChatsLoading,
        chats,
        selectedChatId,
        selectedChat,
        selectedChatMessages,
        isMessageLoading,
        setIsChatsLoading,
        setChats,
        setSelectedChatId,
        setSelectedChat,
        setSelectedChatMessages,
        setIsMessageLoading,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export function useChatContext() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error(
      "useChatContext deve ser usado dentro de um ChatContextProvider",
    );
  }
  return context;
}
