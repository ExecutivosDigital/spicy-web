export interface ChatProps {
  id: string;
  userId: string;
  model: ModelProps;
  lastMessageDate: Date;
  isWaitingForResponse: boolean;
  lastMessage: string;
  respondAfter: Date;
}

export interface ModelProps {
  name: string;
  id: string;
  photoUrl: string;
  bio: string;
  sellPrompt: string;
  contentPrompt: string;
}

export interface MessageProps {
  id: string;
  text: string;
  chatId: string;
  messageType: "AUDIO" | "DOCUMENT" | "IMAGE" | "TEXT" | "CONTACT" | "VIDEO";
  entity: "USER" | "MODEL";
  isMessageOpen: boolean;
  audioUrl?: string | null;
  fileUrl?: string | null;
  imageUrl?: string | null;
  videoUrl?: string | null;
  createdAt: Date;
}
export interface UserProps {
  name: string;
  phone: string;
  hasCpfCnpj: boolean;
}
