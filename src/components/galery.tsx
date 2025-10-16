/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useActionSheetsContext } from "@/context/actionSheetsContext";
import { useChatContext } from "@/context/chatContext";
import {
  MediaProps,
  useModelGalleryContext,
} from "@/context/ModelGalleryContext";
import { cn } from "@/utils/cn";
import clsx from "clsx";
import { motion } from "framer-motion";
import Image from "next/image";
import React, { useState } from "react";

export type GalleryItem = {
  src: string;
  alt?: string;
  badge?: string;
  locked?: boolean;
  poster?: string;
  mediaType?: "image" | "video";
  /** quando true, ocupa espaço visual mas não é clicável */
  placeholder?: boolean;
};

/* ---------------- helpers de tipo/filtragem e paginação ---------------- */

export type TabKey = "all" | "photos_unlocked" | "photos_locked" | "videos";

export function isVideoItem(it: GalleryItem) {
  if (it.mediaType) return it.mediaType === "video";
  return /\.(mp4|webm|ogg)$/i.test(it.src);
}

export function applyFilter(items: GalleryItem[], tab: TabKey) {
  switch (tab) {
    case "photos_unlocked":
      return items.filter((it) => !isVideoItem(it) && !it.locked);
    case "photos_locked":
      return items.filter((it) => !isVideoItem(it) && !!it.locked);
    case "videos":
      return items.filter((it) => isVideoItem(it));
    case "all":
    default:
      return items;
  }
}

export function chunkAndPad(items: GalleryItem[], size = 6): GalleryItem[][] {
  const pages: GalleryItem[][] = [];
  for (let i = 0; i < items.length; i += size) {
    pages.push(items.slice(i, i + size));
  }
  if (pages.length === 0) pages.push([]);
  const last = pages[pages.length - 1];
  const missing = size - last.length;
  if (missing > 0) {
    last.push(
      ...Array.from({ length: missing }, () => ({
        src: "",
        placeholder: true,
      })),
    );
  }
  return pages;
}

/* ------------------- geração de poster/placeholder (CSR-safe) ------------------- */

function isVideo(item: GalleryItem) {
  if (item?.mediaType) return item?.mediaType === "video";
  return /\.(mp4|webm|ogg)$/i.test(item?.src);
}

/** Hook: gera poster client-side sem reproduzir o vídeo */
export function useVideoPoster(src: string, opts?: { time?: number }) {
  const [poster, setPoster] = React.useState<string | null>(null);
  const [error, setError] = React.useState<unknown>(null);

  React.useEffect(() => {
    if (!src) return;
    let aborted = false;

    const captureFrame = async () => {
      try {
        const v = document.createElement("video");
        v.crossOrigin = "anonymous";
        v.preload = "auto";
        v.src = src;

        await new Promise<void>((resolve, reject) => {
          const onLoaded = () => resolve();
          const onErr = (e: any) => reject(e);
          v.addEventListener("loadedmetadata", onLoaded, { once: true });
          v.addEventListener("error", onErr, { once: true });
        });
        if (aborted) return;

        const t = Math.max(
          0.1,
          Math.min(opts?.time ?? 0.8, (v.duration || 1) - 0.2),
        );
        v.currentTime = t;

        await new Promise<void>((resolve) => {
          const done = () => resolve();
          const rvfc = (v as any).requestVideoFrameCallback;
          if (typeof rvfc === "function") {
            rvfc.call(v, () => done());
          } else {
            v.addEventListener("seeked", done, { once: true });
          }
        });
        if (aborted) return;

        const canvas = document.createElement("canvas");
        canvas.width = v.videoWidth || 1280;
        canvas.height = v.videoHeight || 720;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(v, 0, 0, canvas.width, canvas.height);

        const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
        if (!aborted) setPoster(dataUrl);
      } catch (e) {
        if (!aborted) setError(e);
      }
    };

    captureFrame();
    return () => {
      aborted = true;
    };
  }, [src, opts?.time]);

  return { poster, error };
}

/* -------------------------------- Card -------------------------------- */

function Card({
  item,
  className,
  setOpenQrCode,
  setSelectedItem,
  setIsMediaOpen,
  onClick,
}: {
  item: GalleryItem;
  className?: string;
  setOpenQrCode: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedItem: React.Dispatch<React.SetStateAction<GalleryItem | null>>;
  setIsMediaOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onClick?: () => void; // novo
}) {
  const { isPaymentConfirmed } = useChatContext();
  const { openSheet, setCurrent } = useActionSheetsContext();
  const isPlace = !!item.placeholder;
  const video = !isPlace && isVideo(item);
  const { poster } = useVideoPoster(item.src);

  return (
    <>
      <motion.article
        whileHover={{ y: isPlace ? 0 : -2 }}
        className={clsx("relative overflow-hidden rounded-2xl", className, {
          "opacity-60": isPlace,
        })}
        onClick={() => {
          if (isPlace) return;
          if (item.locked && !isPaymentConfirmed && setOpenQrCode) {
            setOpenQrCode(true);
            return;
          }
          if (onClick) {
            onClick();
          } else {
            setIsMediaOpen(true);
            setSelectedItem(item);
          }
        }}
        role="button"
        aria-disabled={isPlace || item.locked}
        tabIndex={isPlace || item.locked ? -1 : 0}
      >
        <div className="relative h-full w-full">
          {isPlace ? (
            <div className="h-full w-full bg-neutral-800/60" />
          ) : video ? (
            <video
              src={item.src}
              className="aspect-video h-full w-full rounded-xl bg-neutral-900 object-cover"
              muted
              playsInline
              preload="metadata"
              poster={poster ?? item.poster ?? undefined}
            />
          ) : (
            <img
              src={item.src}
              alt={item.alt ?? ""}
              className="h-full w-full object-cover"
              draggable={false}
              loading="lazy"
            />
          )}

          {!isPlace && video ? (
            <div className="pointer-events-none absolute top-2 left-2 rounded-full bg-black/60 px-2 py-1 text-xs font-medium text-white">
              vídeo
            </div>
          ) : null}

          {!isPlace && item.locked && !isPaymentConfirmed ? (
            <div
              onClick={() => {
                openSheet();
                setCurrent("password");
              }}
              className="absolute inset-0 grid h-full w-full place-items-center rounded-2xl bg-[#E77988]/5 backdrop-blur-xl"
            >
              <Image src="/lock.png" alt="lock" width={40} height={40} />
            </div>
          ) : null}
        </div>
      </motion.article>
    </>
  );
}

type MosaicProps = {
  items: GalleryItem[];
  inverse?: boolean;
  setOpenQrCode: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedItem: React.Dispatch<React.SetStateAction<GalleryItem | null>>;
  setIsMediaOpen: React.Dispatch<React.SetStateAction<boolean>>;
  baseIndex?: number;
  onCardClickAt?: (absIndex: number, item: GalleryItem) => void;
};

export default function GalleryMosaic({
  items,
  inverse,
  setOpenQrCode,
  setSelectedItem,
  setIsMediaOpen,
  baseIndex = 0,
  onCardClickAt,
}: MosaicProps) {
  const a = items[0];
  const b = items[1];
  const c = items[2];
  const d = items[3];
  const e = items[4];
  const f = items[5];

  const handle = (localIndex: number, it?: GalleryItem) =>
    it
      ? () => {
          if (onCardClickAt) onCardClickAt(baseIndex + localIndex, it);
        }
      : undefined;

  return (
    <section className="mt-3 flex w-full flex-col gap-3 overflow-hidden rounded-[40px]">
      <div className="grid grid-cols-2 gap-3">
        {inverse ? (
          <div className="flex flex-col gap-3">
            {[a, b].map((it, i) =>
              it ? (
                <Card
                  setOpenQrCode={setOpenQrCode}
                  key={`top-left-${i}`}
                  item={it}
                  className="h-[125px]"
                  setSelectedItem={setSelectedItem}
                  setIsMediaOpen={setIsMediaOpen}
                  onClick={handle(i, it)}
                />
              ) : null,
            )}
          </div>
        ) : (
          a && (
            <Card
              setOpenQrCode={setOpenQrCode}
              item={a}
              className="col-span-1 h-[262px]"
              setSelectedItem={setSelectedItem}
              setIsMediaOpen={setIsMediaOpen}
              onClick={handle(0, a)}
            />
          )
        )}

        {inverse ? (
          c && (
            <Card
              setOpenQrCode={setOpenQrCode}
              item={c}
              className="col-span-1 h-[262px]"
              setSelectedItem={setSelectedItem}
              setIsMediaOpen={setIsMediaOpen}
              onClick={handle(2, c)}
            />
          )
        ) : (
          <div className="flex flex-col gap-3">
            {[b, c].map((it, i) =>
              it ? (
                <Card
                  setOpenQrCode={setOpenQrCode}
                  key={`top-right-${i}`}
                  item={it}
                  className="h-[125px]"
                  setSelectedItem={setSelectedItem}
                  setIsMediaOpen={setIsMediaOpen}
                  onClick={handle(i + 1, it)}
                />
              ) : null,
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[d, e, f].map((it, i) =>
          it ? (
            <Card
              setOpenQrCode={setOpenQrCode}
              key={`bottom-${i}`}
              item={it}
              className="h-40"
              setSelectedItem={setSelectedItem}
              setIsMediaOpen={setIsMediaOpen}
              onClick={handle(i + 3, it)}
            />
          ) : null,
        )}
      </div>
    </section>
  );
}

export function GalleryMosaicPager({
  setOpenQrCode,
  className,
  setSelectedItem,
  setIsMediaOpen,
  onOpenLightbox,
}: {
  className?: string;
  setOpenQrCode: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedItem: React.Dispatch<React.SetStateAction<GalleryItem | null>>;
  setIsMediaOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onOpenLightbox?: (items: GalleryItem[], index: number) => void;
}) {
  const { isPaymentConfirmed } = useChatContext();
  const { media, isGettingMedia } = useModelGalleryContext();

  const [secondTabSelected, setSecondTabSelected] = useState<number>(0);

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

  const tabMap: Record<number, TabKey> = {
    0: "all",
    1: "photos_unlocked",
    2: "videos",
  };

  const allMediaItems = React.useMemo(() => toGalleryItems(media), [media]);

  const tabKey = tabMap[secondTabSelected] ?? "all";

  const filtered = React.useMemo(
    () => applyFilter(allMediaItems, tabKey),
    [allMediaItems, tabKey],
  );

  const pages = React.useMemo(() => chunkAndPad(filtered, 6), [filtered]);

  const handleOpen = React.useCallback(
    (absIndex: number, item: GalleryItem) => {
      if (onOpenLightbox) {
        onOpenLightbox(
          filtered.filter((item) => (isPaymentConfirmed ? true : !item.locked)),
          absIndex,
        );
      } else {
        setSelectedItem(item);
        setIsMediaOpen(true);
      }
    },
    [filtered, onOpenLightbox, setIsMediaOpen, setSelectedItem],
  );

  return (
    <div className={cn("relative flex w-full flex-col gap-0", className)}>
      <div className="mt-4 flex w-full items-center justify-center gap-4">
        <button
          type="button"
          className={cn(
            "cursor-pointer border-b border-b-transparent font-semibold transition duration-150 hover:border-b-[#FF0080]",
            secondTabSelected === 0 && "border-b-[#FF0080]",
          )}
          onClick={() => setSecondTabSelected(0)}
        >
          Tudo
        </button>
        <button
          type="button"
          className={cn(
            "relative flex cursor-pointer items-center gap-2 border-b border-b-transparent pr-2 font-semibold transition duration-150 hover:border-b-[#FF0080]",
            secondTabSelected === 1 && "border-b-[#FF0080]",
          )}
          onClick={() => setSecondTabSelected(1)}
        >
          <Image
            alt="mg"
            src="/fire.png"
            width={20}
            height={20}
            className="absolute -top-1 -right-2 h-3 w-3"
          />
          Fotos
        </button>
        <button
          type="button"
          className={cn(
            "relative flex cursor-pointer items-center gap-2 border-b border-b-transparent pr-2 font-semibold transition duration-150 hover:border-b-[#FF0080]",
            secondTabSelected === 2 && "border-b-[#FF0080]",
          )}
          onClick={() => setSecondTabSelected(2)}
        >
          <Image
            alt="mg"
            src="/fire.png"
            width={20}
            height={20}
            className="absolute -top-1 -right-2 h-3 w-3"
          />
          Videos
        </button>
      </div>

      {isGettingMedia ? (
        <section className="mt-5 flex w-full flex-col gap-3 overflow-hidden rounded-[40px]">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-1 h-[262px] animate-pulse bg-[#2A2A2E]" />
            <div className="flex flex-col gap-3">
              {Array.from({ length: 2 }).map((_, index) => (
                <div
                  key={index}
                  className="h-[125px] animate-pulse bg-[#2A2A2E]"
                />
              ))}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="h-40 animate-pulse bg-[#2A2A2E]" />
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-3">
              {Array.from({ length: 2 }).map((_, index) => (
                <div
                  key={index}
                  className="h-[125px] animate-pulse bg-[#2A2A2E]"
                />
              ))}
            </div>
            <div className="col-span-1 h-[262px] animate-pulse bg-[#2A2A2E]" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="h-40 animate-pulse bg-[#2A2A2E]" />
            ))}
          </div>
        </section>
      ) : (
        pages.map((page, pIdx) => (
          <GalleryMosaic
            key={pIdx}
            items={page}
            inverse={pIdx % 2 === 1}
            setOpenQrCode={setOpenQrCode}
            setSelectedItem={setSelectedItem}
            setIsMediaOpen={setIsMediaOpen}
            baseIndex={pIdx * 6}
            onCardClickAt={handleOpen}
          />
        ))
      )}
    </div>
  );
}
