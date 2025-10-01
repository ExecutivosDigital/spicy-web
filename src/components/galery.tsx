"use client";

// components/GalleryMosaic.tsx
import clsx from "clsx";
import { motion } from "framer-motion";
import Image from "next/image";
import React from "react";

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

type Props = {
  items: GalleryItem[];
  inverse?: boolean;
  onItemClick?: (index: number, item: GalleryItem) => void;
  onClick?: (index: number, item: GalleryItem) => void;
  className?: string;
  setOpenQrCode?: React.Dispatch<React.SetStateAction<boolean>>;
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
      }))
    );
  }
  return pages;
}

/* ------------------- geração de poster/placeholder (CSR-safe) ------------------- */

function isVideo(item: GalleryItem) {
  if (item?.mediaType) return item?.mediaType === "video";
  return /\.(mp4|webm|ogg)$/i.test(item?.src);
}

/** gera um placeholder simples via canvas (sempre disponível no cliente) */
function makePlaceholder(w = 800, h = 450) {
  if (typeof document === "undefined") {
    // SSR fallback: 1x1 gif transparente
    return "data:image/gif;base64,R0lGODlhAQABAAAAACw=";
  }
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d")!;
  // fundo
  ctx.fillStyle = "#111827"; // slate-900
  ctx.fillRect(0, 0, w, h);
  // ícone "play" decorativo
  ctx.fillStyle = "rgba(255,255,255,0.85)";
  const size = Math.min(w, h) * 0.22;
  ctx.beginPath();
  ctx.moveTo(w / 2 - size / 2, h / 2 - size / 1.5 / 2);
  ctx.lineTo(w / 2 + size / 2, h / 2);
  ctx.lineTo(w / 2 - size / 2, h / 2 + size / 1.5 / 2);
  ctx.closePath();
  ctx.fill();
  // texto
  ctx.font = `${Math.round(
    h * 0.06
  )}px system-ui, -apple-system, Segoe UI, Roboto`;
  ctx.fillStyle = "rgba(255,255,255,0.9)";
  ctx.textAlign = "center";
  ctx.fillText("vídeo", w / 2, h * 0.85);
  return c.toDataURL("image/png");
}

/** Hook: gera poster client-side sem reproduzir o vídeo */
function useVideoPoster(src: string | undefined) {
  const [poster, setPoster] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    async function run() {
      if (!src) return;

      // no SSR
      if (typeof document === "undefined") {
        return;
      }

      // se já é uma imagem, só usa
      if (!/\.(mp4|webm|ogg)$/i.test(src)) {
        setPoster(src);
        return;
      }

      try {
        const video = document.createElement("video");
        video.crossOrigin = "anonymous";
        video.preload = "metadata";
        video.muted = true; // nunca vamos tocar
        video.playsInline = true;
        video.src = src;

        // aguarda metadados
        await new Promise<void>((res, rej) => {
          const t = setTimeout(() => rej(new Error("timeout metadata")), 8000);
          video.onloadedmetadata = () => {
            clearTimeout(t);
            res();
          };
          video.onerror = () => {
            clearTimeout(t);
            rej(new Error("metadata error"));
          };
        });

        // posiciona ~0.1s para fugir de telas pretas
        const target = Math.min(0.1, (video.duration || 1) - 0.05);
        await new Promise<void>((res, rej) => {
          const t = setTimeout(() => rej(new Error("timeout seeked")), 8000);
          const onSeeked = () => {
            clearTimeout(t);
            res();
          };
          video.currentTime = target > 0 ? target : 0;
          video.addEventListener("seeked", onSeeked, { once: true });
          video.addEventListener(
            "error",
            () => {
              clearTimeout(t);
              rej(new Error("seek error"));
            },
            { once: true }
          );
        });

        const canvas = document.createElement("canvas");
        const w = video.videoWidth || 800;
        const h = video.videoHeight || 450;
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("no ctx");
        ctx.drawImage(video, 0, 0, w, h);
        const data = canvas.toDataURL("image/jpeg", 0.85);
        if (!cancelled) setPoster(data);
      } catch {
        if (!cancelled) setPoster(makePlaceholder());
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [src]);

  return poster;
}

/* -------------------------------- Card -------------------------------- */

function Card({
  item,
  onClick,
  className,
  setOpenQrCode,
}: {
  item: GalleryItem;
  onClick?: () => void;
  className?: string;
  setOpenQrCode?: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const isPlace = !!item.placeholder;
  const video = !isPlace && isVideo(item);
  const autoPoster = useVideoPoster(video ? item.src : undefined);
  const cover = video ? item.poster ?? autoPoster : item.src;
  const loading = video && !cover;

  return (
    <motion.article
      whileHover={{ y: isPlace ? 0 : -2 }}
      className={clsx("relative overflow-hidden rounded-2xl", className, {
        "opacity-60": isPlace,
      })}
      onClick={() => {
        if (isPlace) return;
        if (item.locked && setOpenQrCode) {
          setOpenQrCode(true);
          return;
        }
        onClick?.();
      }}
      role="button"
      aria-disabled={isPlace || item.locked}
      tabIndex={isPlace || item.locked ? -1 : 0}
      onKeyDown={(e) => {
        if (!isPlace && !item.locked && (e.key === "Enter" || e.key === " "))
          onClick?.();
      }}
    >
      {isPlace ? (
        <div className="h-full w-full bg-neutral-800/60" />
      ) : loading ? (
        <div className="h-full w-full animate-pulse bg-neutral-800" />
      ) : (
        <img
          src={cover ?? makePlaceholder()}
          alt={item.alt ?? ""}
          className="h-full w-full object-cover"
          draggable={false}
        />
      )}

      {!isPlace && video ? (
        <div className="pointer-events-none absolute left-2 top-2 rounded-full bg-black/60 px-2 py-1 text-xs font-medium text-white">
          vídeo
        </div>
      ) : null}

      {!isPlace && item.locked ? (
        <div className="absolute inset-0 grid place-items-center bg-black/20">
          <Image src="/lock.png" alt="lock" width={40} height={40} />
        </div>
      ) : null}
    </motion.article>
  );
}

/* ------------------------------ Mosaico ------------------------------ */

export default function GalleryMosaic({
  items,
  inverse,
  onItemClick,
  onClick,
  className,
  setOpenQrCode,
}: Props) {
  const handle = onItemClick ?? onClick;
  const a = items[0];
  const b = items[1];
  const c = items[2];
  const d = items[3];
  const e = items[4];
  const f = items[5];

  return (
    <section
      className={clsx(
        "mt-5 space-y-3 rounded-[40px] overflow-hidden",
        className
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
                  onClick={() => handle?.(i, it)}
                  className="h-[125px]"
                />
              ) : null
            )}
          </div>
        ) : (
          a && (
            <Card
              setOpenQrCode={setOpenQrCode}
              item={a}
              onClick={() => handle?.(0, a)}
              className="col-span-1 row-span-2 h-[262px]"
            />
          )
        )}

        {inverse ? (
          c && (
            <Card
              setOpenQrCode={setOpenQrCode}
              item={c}
              onClick={() => handle?.(2, c)}
              className="col-span-1 row-span-2 h-[262px]"
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
                  onClick={() => handle?.(i + 1, it)}
                  className="h-[125px]"
                />
              ) : null
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
              onClick={() => handle?.(i + 3, it)}
              className="h-40"
            />
          ) : null
        )}
      </div>
    </section>
  );
}

/* -------------------------- Pager embutido -------------------------- */

export function GalleryMosaicPager({
  items,
  selectedTab,
  onItemClick,
  setOpenQrCode,
  className,
}: {
  items: GalleryItem[];
  /** 0: Tudo, 1: Fotos (desbloq), 2: Fotos (com dot = bloqueadas), 3: Vídeos (com dot) */
  selectedTab: number;
  onItemClick?: (globalIndex: number, item: GalleryItem) => void;
  className?: string;
  setOpenQrCode?: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const tabMap: Record<number, TabKey> = {
    0: "all",
    1: "photos_unlocked",
    2: "videos",
  };
  const filtered = applyFilter(items, tabMap[selectedTab] ?? "all");
  const pages = chunkAndPad(filtered, 6);

  return (
    <div className={className}>
      {pages.map((page, pIdx) => (
        <GalleryMosaic
          key={pIdx}
          items={page}
          inverse={pIdx % 2 === 1}
          setOpenQrCode={setOpenQrCode}
          className="mb-6"
          onItemClick={(localIndex, item) => {
            // mapeia índice local (0..5) para índice global dentro do filtro
            const globalIndex = pIdx * 6 + localIndex;
            if (!item.placeholder) onItemClick?.(globalIndex, item);
          }}
        />
      ))}
    </div>
  );
}
