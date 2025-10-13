"use client";

import {
  ChatProps,
  MessageProps,
  ModelProps,
  UserProps,
} from "@/@types/global";
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
  setSelectedChatMessages: React.Dispatch<React.SetStateAction<MessageProps[]>>;
  setIsMessageLoading: (value: boolean) => void;
  paymentWebhookConfirmation: boolean;
  setUserId: (value: string | undefined) => void;
  handleGetChats: () => Promise<void>;
  handleVerify: () => Promise<void>;
  isPaymentConfirmed: boolean;
  setIsPaymentConfirmed: (value: boolean) => void;
  userProfile: UserProps | null;
  modelId: string | undefined;
  modelProfile: ModelProps | null;
  setModelId: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const ChatContext = createContext<ChatContextProps | undefined>(undefined);

interface ProviderProps {
  children: React.ReactNode;
}

export const ChatContextProvider = ({ children }: ProviderProps) => {
  const { GetAPI, token } = useApiContext();
  const cookies = useCookies();

  const [modelId, setModelId] = useState<string | undefined>();
  const [modelProfile, setModelProfile] = useState<ModelProps | null>(null);
  const [userProfile, setUserProfile] = useState<UserProps | null>(null);
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
  const [isPaymentConfirmed, setIsPaymentConfirmed] = useState(false);

  const [selectedChatMessages, setSelectedChatMessages] = useState<
    MessageProps[]
  >([]);
  const [isMessageLoading, setIsMessageLoading] = useState(false);

  async function handleGetChats() {
    setIsChatsLoading(true);
    const connect = await GetAPI("/chat", true);
    if (connect.status === 200) {
      setChats(connect.body.chats);
      if (connect.body.chats.length > 0) {
        setSelectedChatId(connect.body.chats[0].id!);
        setSelectedChat(connect.body.chats[0]);
      }
    }

    setIsChatsLoading(false);
  }

  async function profile() {
    const connect = await GetAPI("/user/profile", true);
    if (connect.status === 200) {
      setUserProfile(connect.body.user);
    }
  }

  async function getModelProfile() {
    if (!modelId) return;
    const connect = await GetAPI(`/model/profile/${modelId}`, true);
    console.log(connect);
    if (connect.status === 200) {
      setModelProfile(connect.body.model);
    }
  }

  useEffect(() => {
    getModelProfile();
  }, [modelId]);

  async function handleGetChatMessages() {
    if (!selectedChatId) return;
    setIsMessageLoading(true);
    const connect = await GetAPI(`/message/${selectedChatId}`, true);
    if (connect.status === 200) {
      setSelectedChatMessages(connect.body.messages);
    }

    setIsMessageLoading(false);
  }

  async function handleVerify() {
    if (!selectedChat) return;

    const response = await GetAPI(
      `/user-signature/validation/${selectedChat?.model.id}`,
      true,
    );

    if (response.status === 403) {
      // setOpenQrCode(true);
      setIsPaymentConfirmed(false);
    } else if (response.status === 200) {
      setIsPaymentConfirmed(true);
    }
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
        console.log("entou aqui");
        setPaymentWebHookConfirmation(true);
        setIsPaymentConfirmed(true);
      });
    }
  }, [socket, selectedChatId, userId, modelId]);

  useEffect(() => {
    handleGetChatMessages();
    handleVerify();
  }, [selectedChatId, modelId]);

  useEffect(() => {
    handleGetChats();
    profile();
  }, [token, modelId]);

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
        handleGetChats,
        handleVerify,
        isPaymentConfirmed,
        setIsPaymentConfirmed,
        userProfile,
        modelId,
        modelProfile,
        setModelId,
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
