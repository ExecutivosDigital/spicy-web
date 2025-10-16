"use client";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useApiContext } from "./ApiContext";
import { useChatContext } from "./chatContext";

export interface PhotoProps {
  isFreeAvailable: boolean;
  modelId: string;
  photoShootId: string | null;
  photoUrl: string;
}

export interface VideoProps {
  isFreeAvailable: boolean;
  modelId: string;
  photoShootId: string | null;
  videoUrl: string;
}

export interface MediaProps {
  photos: PhotoProps[];
  videos: VideoProps[];
}

interface ModelGalleryContextProps {
  photos: PhotoProps[];
  videos: VideoProps[];
  media: MediaProps;
  isGettingMedia: boolean;
}

const ModelGalleryContext = createContext<ModelGalleryContextProps | undefined>(
  undefined,
);

interface ProviderProps {
  children: ReactNode;
}

export const ModelGalleryContextProvider = ({ children }: ProviderProps) => {
  const { GetAPI } = useApiContext();
  const { modelId } = useChatContext();

  const [isGettingMedia, setIsGettingMedia] = useState(true);
  const [photos, setPhotos] = useState<PhotoProps[]>([]);
  const [videos, setVideos] = useState<VideoProps[]>([]);
  const [media, setMedia] = useState<MediaProps>({
    photos: [],
    videos: [],
  });

  async function GetMedia() {
    const [ph, vd] = await Promise.all([
      GetAPI(`/photo/${modelId}`, false),
      GetAPI(`/video/${modelId}`, false),
    ]);

    if (ph?.status === 200 && vd?.status === 200) {
      setPhotos(ph.body.photos);
      setVideos(vd.body.videos);
      setMedia({
        photos: ph.body.photos,
        videos: vd.body.videos,
      });
      setIsGettingMedia(false);
    }
    setIsGettingMedia(false);
  }

  useEffect(() => {
    if (modelId) {
      GetMedia();
    }
  }, [modelId]);

  return (
    <ModelGalleryContext.Provider
      value={{
        photos,
        videos,
        media,
        isGettingMedia,
      }}
    >
      {children}
    </ModelGalleryContext.Provider>
  );
};

export function useModelGalleryContext() {
  const context = useContext(ModelGalleryContext);
  if (!context) {
    throw new Error(
      "useModelGalleryContext deve ser usado dentro de um ModelGalleryContextProvider",
    );
  }
  return context;
}
