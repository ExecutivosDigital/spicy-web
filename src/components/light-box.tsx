"use client";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useMemo, useRef } from "react";
import { useVideoPoster } from "./galery";

/* ------------------------- utils ------------------------- */
function useBodyLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [locked]);
}

export type MediaItem = {
  src: string;
  alt: string;
  poster?: string; // opcional: capa para vídeos
  mediaType?: "image" | "video"; // opcional: forçar tipo
};

function isVideo(item: MediaItem | undefined) {
  if (!item) return false;
  if (item.mediaType) return item.mediaType === "video";
  return /\.(mp4|webm|ogg)$/i.test(item.src);
}

/** placeholder gerado via canvas (sempre funciona) */
// function makePlaceholder(w = 1280, h = 720) {
//   const c = document.createElement("canvas");
//   c.width = w;
//   c.height = h;
//   const ctx = c.getContext("2d")!;
//   ctx.fillStyle = "#0f172a";
//   ctx.fillRect(0, 0, w, h);
//   ctx.fillStyle = "rgba(255,255,255,.9)";
//   const s = Math.min(w, h) * 0.18;
//   ctx.beginPath();
//   ctx.moveTo(w / 2 - s / 2, h / 2 - s / 1.6 / 2);
//   ctx.lineTo(w / 2 + s / 2, h / 2);
//   ctx.lineTo(w / 2 - s / 2, h / 2 + s / 1.6 / 2);
//   ctx.closePath();
//   ctx.fill();
//   ctx.font = `${Math.round(h * 0.05)}px system-ui, -apple-system, Segoe UI, Roboto`;
//   ctx.textAlign = "center";
//   ctx.fillText("vídeo", w / 2, h * 0.87);
//   return c.toDataURL("image/png");
// }

/** gera poster client-side para vídeos quando não há thumb */
// function useVideoPoster(src?: string) {
//   const [poster, setPoster] = React.useState<string | null>(null);

//   useEffect(() => {
//     let cancelled = false;
//     async function run() {
//       if (!src) {
//         setPoster(null);
//         return;
//       }
//       if (!/\.(mp4|webm|ogg)$/i.test(src)) {
//         setPoster(src);
//         return;
//       }

//       try {
//         const v = document.createElement("video");
//         v.crossOrigin = "anonymous";
//         v.preload = "metadata";
//         v.muted = true;
//         v.playsInline = true;
//         v.src = src;

//         await new Promise<void>((res, rej) => {
//           const t = setTimeout(() => rej(new Error("timeout metadata")), 8000);
//           v.onloadedmetadata = () => {
//             clearTimeout(t);
//             res();
//           };
//           v.onerror = () => {
//             clearTimeout(t);
//             rej(new Error("metadata error"));
//           };
//         });

//         const target = Math.min(0.1, (v.duration || 1) - 0.05);
//         await new Promise<void>((res, rej) => {
//           const t = setTimeout(() => rej(new Error("timeout seeked")), 8000);
//           const onSeeked = () => {
//             clearTimeout(t);
//             res();
//           };
//           v.currentTime = target > 0 ? target : 0;
//           v.addEventListener("seeked", onSeeked, { once: true });
//           v.addEventListener(
//             "error",
//             () => {
//               clearTimeout(t);
//               rej(new Error("seek error"));
//             },
//             { once: true },
//           );
//         });

//         const canvas = document.createElement("canvas");
//         const w = v.videoWidth || 1280;
//         const h = v.videoHeight || 720;
//         canvas.width = w;
//         canvas.height = h;
//         const ctx = canvas.getContext("2d")!;
//         ctx.drawImage(v, 0, 0, w, h);
//         const data = canvas.toDataURL("image/jpeg", 0.9);
//         if (!cancelled) setPoster(data);
//       } catch {
//         if (!cancelled) setPoster(makePlaceholder());
//       }
//     }
//     run();
//     return () => {
//       cancelled = true;
//     };
//   }, [src]);

//   return poster;
// }

/* ------------------------- Lightbox ------------------------- */
export function Lightbox({
  open,
  images, // aceita item único OU lista
  index = 0,
  onClose,
  setIndex,
  setOpenQrCode,
}: {
  open: boolean;
  images: MediaItem[] | MediaItem | null | undefined;
  index?: number;
  onClose: () => void;
  setIndex: (i: number) => void;
  setOpenQrCode?: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  useBodyLock(open);

  // normaliza para lista
  const list = useMemo<MediaItem[]>(() => {
    if (!images) return [];
    return Array.isArray(images) ? images : [images];
  }, [images]);

  // 🔒 mantém index válido quando a lista muda
  useEffect(() => {
    if (!list.length) return;
    if (index < 0) setIndex(0);
    else if (index >= list.length) setIndex(list.length - 1);
  }, [list.length, index, setIndex]);

  // item atual e derivadas: calculados SEM retornar antes dos hooks
  const item = list.length ? list[Math.min(index, list.length - 1)] : undefined;
  const video = isVideo(item);
  // const autoPoster = useVideoPoster(video ? item?.src : undefined);
  const { poster } = useVideoPoster(item?.src as string);

  // const poster = useMemo(
  //   () => item?.poster ?? autoPoster ?? undefined,
  //   [item?.poster, autoPoster],
  // );

  const hasContent = open && list.length > 0;

  // pausa o vídeo atual quando troca/fecha
  const videoRef = useRef<HTMLVideoElement | null>(null);
  useEffect(() => {
    return () => {
      if (videoRef.current) {
        videoRef.current.pause();
      }
    };
  }, []);
  useEffect(() => {
    if (!open && videoRef.current) videoRef.current.pause();
  }, [open]);
  useEffect(() => {
    if (videoRef.current) videoRef.current.pause();
  }, [index]);

  // teclado
  useEffect(() => {
    if (!hasContent) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setIndex((index + 1) % list.length);
      if (e.key === "ArrowLeft")
        setIndex((index - 1 + list.length) % list.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [hasContent, index, list.length, onClose, setIndex]);

  // Agora é seguro retornar condicionalmente
  if (!hasContent) return null;

  return (
    <AnimatePresence>
      {open && item && (
        <motion.div
          className="fixed inset-0 z-[80]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Conteúdo */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ scale: 0.98 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            onClick={(e) => e.stopPropagation()}
          >
            {video ? (
              <motion.video
                key={index}
                ref={videoRef}
                className="max-h-[85vh] w-[92vw] rounded-xl bg-black object-contain shadow-2xl select-none"
                controls
                playsInline
                preload="metadata"
                poster={poster ?? item.poster ?? undefined}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.25 }}
                drag="x"
                autoPlay
                muted
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={(_e, info) => {
                  if (info.offset.x < -80) setIndex((index + 1) % list.length);
                  if (info.offset.x > 80)
                    setIndex((index - 1 + list.length) % list.length);
                }}
              >
                <source src={item?.src} />
                Seu navegador não suporta vídeo HTML5.
              </motion.video>
            ) : (
              <motion.img
                key={index}
                src={item?.src}
                alt={item?.alt || ""}
                className="max-h-[85vh] max-w-[92vw] rounded-xl object-contain shadow-2xl select-none"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.25 }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={(_e, info) => {
                  if (info.offset.x < -80) setIndex((index + 1) % list.length);
                  if (info.offset.x > 80)
                    setIndex((index - 1 + list.length) % list.length);
                }}
              />
            )}

            {/* Close */}
            <button
              aria-label="Fechar"
              onClick={onClose}
              className="absolute top-4 right-4 z-[100] grid h-11 w-11 place-items-center rounded-full border border-white/20 bg-black/10 text-white/90 backdrop-blur-sm hover:bg-black/15"
            >
              ✕
            </button>

            {/* Navegação */}
            <button
              aria-label="Anterior"
              onClick={() => setIndex((index - 1 + list.length) % list.length)}
              className="absolute top-1/2 left-3 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-black/40 text-white/90 hover:bg-white/15"
            >
              ‹
            </button>
            <button
              aria-label="Próxima"
              onClick={() => setIndex((index + 1) % list.length)}
              className="absolute top-1/2 right-3 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-black/40 text-white/90 hover:bg-white/15"
            >
              ›
            </button>

            {/* Indicadores */}
            <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-1.5">
              {list.map((_g, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${
                    i === index ? "w-8 bg-white" : "w-3 bg-white/40"
                  }`}
                />
              ))}
            </div>
          </motion.div>

          {/* CTA opcional */}
          <div className="fixed inset-x-0 bottom-4 z-50 px-5">
            <button
              onClick={() => {
                if (setOpenQrCode) setOpenQrCode(true);
              }}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#8b5cf6] to-[#ec4899] px-6 py-4 text-[15px] font-extrabold text-white shadow-[0_12px_30px_rgba(99,102,241,0.35)] active:scale-[.99]"
            >
              Acessar Conteúdo Completo
              <span className="rounded-md bg-white/20 px-1.5 py-0.5 text-[11px]">
                🔒
              </span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
