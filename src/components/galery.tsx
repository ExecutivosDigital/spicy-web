/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useApiContext } from "@/context/ApiContext";
import { useChatContext } from "@/context/chatContext";
// components/GalleryMosaic.tsx
import { cn } from "@/lib/utils";
import clsx from "clsx";
import { motion } from "framer-motion";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Header } from "./header";

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

interface PhotoProps {
  isFreeAvailable: boolean;
  modelId: string;
  photoShootId: string | null;
  photoUrl: string;
}

interface VideoProps {
  isFreeAvailable: boolean;
  modelId: string;
  photoShootId: string | null;
  videoUrl: string;
}

interface MediaProps {
  photos: PhotoProps[];
  videos: VideoProps[];
}

type Props = {
  items: GalleryItem[];
  inverse?: boolean;
  className?: string;
  setOpenQrCode: React.Dispatch<React.SetStateAction<boolean>>;
  hasNotPayed: boolean;
  setSelectedItem: React.Dispatch<React.SetStateAction<GalleryItem | null>>;
  setIsMediaOpen: React.Dispatch<React.SetStateAction<boolean>>;
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
function useVideoPoster(src: string, opts?: { time?: number }) {
  const [poster, setPoster] = useState<string | null>(null);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    if (!src) return;
    let aborted = false;

    const captureFrame = async () => {
      try {
        const v = document.createElement("video");
        v.crossOrigin = "anonymous"; // requires CORS on the server
        v.preload = "auto"; // ensure data is actually fetched
        v.src = src;

        // Wait for metadata so we have dimensions and duration
        await new Promise<void>((resolve, reject) => {
          const onLoaded = () => resolve();
          const onErr = (e: any) => reject(e);
          v.addEventListener("loadedmetadata", onLoaded, { once: true });
          v.addEventListener("error", onErr, { once: true });
        });
        if (aborted) return;

        // Pick a safe time a bit into the video, but before the end
        const t = Math.max(
          0.1,
          Math.min(opts?.time ?? 0.8, (v.duration || 1) - 0.2),
        );
        v.currentTime = t;

        // Wait for the frame to actually be decoded
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

        // Now draw
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
  hasNotPayed,
  setSelectedItem,
  setIsMediaOpen,
}: {
  item: GalleryItem;
  className?: string;
  setOpenQrCode: React.Dispatch<React.SetStateAction<boolean>>;
  hasNotPayed: boolean;
  setSelectedItem: React.Dispatch<React.SetStateAction<GalleryItem | null>>;
  setIsMediaOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
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
          if (item.locked && hasNotPayed && setOpenQrCode) {
            setOpenQrCode(true);
            return;
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
              poster={poster ?? item.poster ?? undefined} // <- key line
              onClick={() => {
                setIsMediaOpen(true);
                setSelectedItem(item);
              }}
            />
          ) : (
            <img
              src={item.src}
              alt={item.alt ?? ""}
              className="h-full w-full object-cover"
              draggable={false}
              onClick={() => {
                if (!isPlace) {
                  setIsMediaOpen(true);
                  setSelectedItem(item);
                }
              }}
            />
          )}

          {!isPlace && video ? (
            <div className="pointer-events-none absolute top-2 left-2 rounded-full bg-black/60 px-2 py-1 text-xs font-medium text-white">
              vídeo
            </div>
          ) : null}

          {!isPlace && item.locked && hasNotPayed ? (
            <div className="absolute inset-0 grid h-full w-full place-items-center rounded-2xl bg-[#E77988]/5 backdrop-blur-xl">
              <Image src="/lock.png" alt="lock" width={40} height={40} />
            </div>
          ) : null}
        </div>
      </motion.article>
    </>
  );
}

/* ------------------------------ Mosaico ------------------------------ */

export default function GalleryMosaic({
  items,
  inverse,
  className,
  setOpenQrCode,
  hasNotPayed,
  setSelectedItem,
  setIsMediaOpen,
}: Props) {
  const a = items[0];
  const b = items[1];
  const c = items[2];
  const d = items[3];
  const e = items[4];
  const f = items[5];

  return (
    <section
      className={clsx(
        "mt-5 space-y-3 overflow-hidden rounded-[40px]",
        className,
      )}
    >
      {/* Linha de cima */}
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
                  hasNotPayed={hasNotPayed}
                  setSelectedItem={setSelectedItem}
                  setIsMediaOpen={setIsMediaOpen}
                />
              ) : null,
            )}
          </div>
        ) : (
          a && (
            <Card
              setOpenQrCode={setOpenQrCode}
              item={a}
              className="col-span-1 row-span-2 h-[262px]"
              hasNotPayed={hasNotPayed}
              setSelectedItem={setSelectedItem}
              setIsMediaOpen={setIsMediaOpen}
            />
          )
        )}

        {inverse ? (
          c && (
            <Card
              setOpenQrCode={setOpenQrCode}
              item={c}
              className="col-span-1 row-span-2 h-[262px]"
              hasNotPayed={hasNotPayed}
              setSelectedItem={setSelectedItem}
              setIsMediaOpen={setIsMediaOpen}
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
                  hasNotPayed={hasNotPayed}
                  setSelectedItem={setSelectedItem}
                  setIsMediaOpen={setIsMediaOpen}
                />
              ) : null,
            )}
          </div>
        )}
      </div>

      {/* Linha de baixo */}
      <div className="grid grid-cols-3 gap-3">
        {[d, e, f].map((it, i) =>
          it ? (
            <Card
              setOpenQrCode={setOpenQrCode}
              key={`bottom-${i}`}
              item={it}
              className="h-40"
              hasNotPayed={hasNotPayed}
              setSelectedItem={setSelectedItem}
              setIsMediaOpen={setIsMediaOpen}
            />
          ) : null,
        )}
      </div>
    </section>
  );
}

/* -------------------------- Pager embutido -------------------------- */

export function GalleryMosaicPager({
  setOpenQrCode,
  className,
  hasNotPayed,
  setSelectedItem,
  setIsMediaOpen,
}: {
  /** 0: Tudo, 1: Fotos (desbloq), 2: Fotos (com dot = bloqueadas), 3: Vídeos (com dot) */
  className?: string;
  setOpenQrCode: React.Dispatch<React.SetStateAction<boolean>>;
  hasNotPayed: boolean;
  setSelectedItem: React.Dispatch<React.SetStateAction<GalleryItem | null>>;
  setIsMediaOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { GetAPI } = useApiContext();
  const { selectedChat } = useChatContext();

  const [media, setMedia] = React.useState<MediaProps>({
    photos: [],
    videos: [],
  });

  // 1) load from your API
  React.useEffect(() => {
    if (!selectedChat) return;
    (async () => {
      const [ph, vd] = await Promise.all([
        GetAPI(`/photo/${selectedChat.model.id}`, true),
        GetAPI(`/video/${selectedChat.model.id}`, true),
      ]);
      setMedia({
        photos: ph?.status === 200 ? ph.body.photos : [],
        videos: vd?.status === 200 ? vd.body.videos : [],
      });
    })();
  }, [GetAPI, selectedChat]);

  // 2) turn MediaProps -> GalleryItem[]
  function toGalleryItems(m: MediaProps): GalleryItem[] {
    const photos: GalleryItem[] = m.photos.map((p) => ({
      src: p.photoUrl,
      alt: "photo",
      locked: !p.isFreeAvailable, // locked overlay when free=false
      mediaType: "image",
    }));
    const videos: GalleryItem[] = m.videos.map((v) => ({
      src: v.videoUrl,
      alt: "video",
      locked: !v.isFreeAvailable,
      mediaType: "video", // tells the UI it's a video
    }));

    // optional: interleave so the grid alternates photo/video instead of blocks
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

  // 3) use your existing helpers to filter and paginate into pages of 6
  const allMediaItems = React.useMemo(() => toGalleryItems(media), [media]);
  const filtered = applyFilter(allMediaItems, tabMap[0] ?? "all");
  const pages = chunkAndPad(filtered, 6);

  return (
    <div className={cn("relative", className)}>
      <Header />
      {pages.map((page, pIdx) => (
        <GalleryMosaic
          key={pIdx}
          items={page}
          inverse={pIdx % 2 === 1}
          setOpenQrCode={setOpenQrCode}
          className="mb-6"
          hasNotPayed={hasNotPayed}
          setSelectedItem={setSelectedItem}
          setIsMediaOpen={setIsMediaOpen}
        />
      ))}
    </div>
  );
}
