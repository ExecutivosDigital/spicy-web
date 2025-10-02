"use client";

import { ChatProps, MessageProps } from "@/@types/global";
import { useCookies } from "next-client-cookies";
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
  paymentWebhookConfirmation: boolean;
  setUserId: (value: string | undefined) => void;
}

const ChatContext = createContext<ChatContextProps | undefined>(undefined);

interface ProviderProps {
  children: React.ReactNode;
}

export const ChatContextProvider = ({ children }: ProviderProps) => {
  const { GetAPI } = useApiContext();
  const cookies = useCookies();

  const [isChatsLoading, setIsChatsLoading] = useState(false);
  const [chats, setChats] = useState<ChatProps[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [selectedChat, setSelectedChat] = useState<ChatProps | null>(null);
  const [socket, setSocket] = useState<null | Socket>(null);
  const [paymentWebhookConfirmation, setPaymentWebHookConfirmation] =
    useState(false);
  const [userId, setUserId] = useState(
    cookies.get(process.env.NEXT_PUBLIC_USER_ID as string),
  );

  const [selectedChatMessages, setSelectedChatMessages] = useState<
    MessageProps[]
  >([]);
  const [isMessageLoading, setIsMessageLoading] = useState(false);

  async function handleGetChats() {
    setIsChatsLoading(true);

    const connect = await GetAPI("/chat", true);

    if (connect.status === 200) {
      setChats(connect.body.chats);
    }

    setIsChatsLoading(false);
  }

  async function handleGetChatMessages() {
    if (!selectedChatId) return;

    setIsMessageLoading(true);

    const connect = await GetAPI(`/message/${selectedChatId}`, true);

    if (connect.status === 200) {
      setSelectedChatMessages(connect.body.messages);
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
      if (userId) {
        socket.emit("connectRoom", userId);
      }

      socket.on("newMessage", (message: MessageProps) => {
        console.log("entrou aqui");
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

      socket.on("payment", () => {
        setPaymentWebHookConfirmation(true);
      });
    }
  }, [socket, selectedChatId, userId]);

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
        paymentWebhookConfirmation,
        setUserId,
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
