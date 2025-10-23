"use client";
import {
  GalleryItem as GMItem,
  GalleryItem,
  GalleryMosaicPager,
  TabKey,
  applyFilter,
} from "@/components/galery";
import { Lightbox } from "@/components/light-box";
import { useApiContext } from "@/context/ApiContext";
import { useLoadingContext } from "@/context/LoadingContext";
import {
  MediaProps,
  useModelGalleryContext,
} from "@/context/ModelGalleryContext";
import { useActionSheetsContext } from "@/context/actionSheetsContext";
import { useChatContext } from "@/context/chatContext";
import { cn } from "@/utils/cn";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

type MediaItem = {
  src: string;
  alt: string;
  poster?: string;
  mediaType?: "image" | "video";
};

const SpicyScreen = () => {
  const { openSheet, setCurrent, setSendToCheckout } = useActionSheetsContext();
  const { handleNavigation } = useLoadingContext();
  const { token } = useApiContext();
  const {
    userProfile,
    modelProfile,
    isPaymentConfirmed,
    modelId,
    isGettingModelProfile,
    isVerifying,
  } = useChatContext();
  const { media } = useModelGalleryContext();

  const [lbOpen, setLbOpen] = useState(false);
  const [lbIndex, setLbIndex] = useState(0);
  const [lbItems, setLbItems] = useState<MediaItem[]>([]);

  const toMediaItem = (it: GMItem): MediaItem => ({
    src: it.src,
    alt: it.alt ?? "",
    poster: it.poster,
    mediaType: it.mediaType,
  });

  useEffect(() => {
    setSendToCheckout(true);
  }, []);
  function toGalleryItems(m: MediaProps): GalleryItem[] {
    const photos: GalleryItem[] = m.photos.map((p) => ({
      src: p.photoUrl,
      alt: "photo",
      locked: !p.isFreeAvailable,
      mediaType: "image",
    }));
    const videos: GalleryItem[] = m.videos.map((v) => ({
      src: v.videoUrl,
      alt: "video",
      locked: !v.isFreeAvailable,
      mediaType: "video",
    }));

    const out: GalleryItem[] = [];
    let i = 0,
      j = 0;
    while (i < photos.length || j < videos.length) {
      if (i < photos.length) out.push(photos[i++]);
      if (j < videos.length) out.push(videos[j++]);
    }
    return out;
  }

  const [secondTabSelected, setSecondTabSelected] = useState<number>(0);
  const allMediaItems = useMemo(() => toGalleryItems(media), [media]);

  const tabMap: Record<number, TabKey> = {
    0: "all",
    1: "photos_unlocked",
    2: "videos",
  };

  const tabKey = tabMap[secondTabSelected] ?? "all";

  const filtered = useMemo(
    () => applyFilter(allMediaItems, tabKey),
    [allMediaItems, tabKey],
  );

  const availableItemsForLightbox = useMemo(() => {
    return filtered.filter((item) =>
      isPaymentConfirmed ? true : !item.locked,
    );
  }, [filtered, isPaymentConfirmed]);

  return (
    <div className="flex h-full justify-center gap-2 bg-neutral-900 p-2 text-white xl:gap-5 rtl:space-x-reverse">
      <div className="custom-scrollbar relative max-w-[540px] flex-1 overflow-auto pb-40 md:rounded-md md:px-4 md:pb-20">
        <header
          className={cn(
            "flex items-center justify-between pt-4",
            isPaymentConfirmed && "hidden",
          )}
        >
          <div className="flex items-center gap-2">
            <Image src="/logoBunny.png" alt="Spicy.ai" width={32} height={32} />
          </div>
          <div className="flex items-center gap-2">
            {isGettingModelProfile && isVerifying ? (
              <>
                <div className="h-8 w-20 animate-pulse rounded-md bg-[#2A2A2E]" />
                <div className="h-8 w-20 animate-pulse rounded-md bg-[#2A2A2E]" />
              </>
            ) : (
              <>
                {/* <button
                  onClick={() => {
                    setCurrent("register");
                    openSheet();
                  }}
                  className={cn(
                    "cursor-pointer rounded-md border border-[#FF0080] bg-gradient-to-br from-[#FF0080]/20 to-[#7928CA]/20 px-3 py-1.5 text-xs hover:bg-[#e24c69]",
                    token && "hidden",
                  )}
                >
                  Registro Grátis
                </button> */}
                <button
                  onClick={() => {
                    if (userProfile) {
                      setCurrent("plans");
                      openSheet();
                    } else {
                      setCurrent("password");
                      openSheet();
                    }
                  }}
                  className="cursor-pointer rounded-md border border-[#FF0080] px-3 py-1.5 text-xs"
                >
                  {isPaymentConfirmed
                    ? "Enviar mimo"
                    : token
                      ? "Assinar"
                      : "Login"}
                </button>
              </>
            )}
          </div>
        </header>

        <section className="mt-4">
          {isGettingModelProfile ? (
            <>
              <div className="relative h-32 animate-pulse overflow-hidden rounded-2xl bg-[#2A2A2E]" />
              <div className="mx-auto mt-3 h-6 w-[calc(100%-4rem)] animate-pulse bg-[#2A2A2E]" />
            </>
          ) : (
            <>
              <div className="relative h-32 overflow-hidden rounded-2xl bg-[#2A2A2E]">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Image
                    src={
                      (modelProfile && modelProfile.photoUrl) || "/default.png"
                    }
                    alt="Gabriela"
                    width={10000}
                    height={10000}
                    className="h-32 w-full rounded-xl bg-white object-cover"
                  />
                </div>

                <span className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-full bg-emerald-500/80 px-2 py-0.5 text-[11px] text-white">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  Online
                </span>
              </div>
              <p className="mt-3 text-center text-sm text-white/90">
                {modelProfile && modelProfile.bio}
              </p>
            </>
          )}

          <div className="mt-3 flex w-full justify-center gap-2">
            <button
              onClick={() => handleNavigation(`/${modelId}/chat`)}
              className="flex cursor-pointer flex-row items-center gap-2 rounded-lg border border-[#FF0080] from-[#FF0080] to-[#7928CA] px-3 py-2 text-sm text-white transition-all duration-700 hover:scale-[1.01] hover:bg-[#FF0080]"
            >
              <Image
                src="/heart.png"
                alt="heart"
                width={20}
                height={20}
                className=""
              />
              Iniciar Conversa
            </button>
            <button
              onClick={() => {
                setLbOpen(true);
                setLbItems(
                  filtered
                    .filter((item) =>
                      isPaymentConfirmed ? true : !item.locked,
                    )
                    .map(toMediaItem),
                );
                setLbIndex(0);
              }}
              className="rounded-lg bg-gradient-to-br from-[#FF0080] to-[#7928CA] px-3 py-2 text-sm text-white transition-all duration-300"
            >
              Galeria de Conteúdo
            </button>
          </div>
        </section>

        <GalleryMosaicPager
          setOpenQrCode={() => {}}
          setSelectedItem={() => {}}
          setIsMediaOpen={() => {}}
          onOpenLightbox={(items, index) => {
            // 1. Converte a lista (que agora já vem filtrada e é a correta)
            setLbItems(items.map(toMediaItem));

            // 2. Define o índice (que agora já vem mapeado corretamente)
            setLbIndex(index);

            // 3. Abre o Lightbox
            setLbOpen(true);
          }}
        />

        <Lightbox
          open={lbOpen}
          images={lbItems}
          index={lbIndex}
          onClose={() => setLbOpen(false)}
          setIndex={setLbIndex}
          setOpenQrCode={() => {
            setCurrent("password");
            openSheet();
          }}
        />
      </div>
    </div>
  );
};

export default SpicyScreen;
