"use client";
import { GalleryItem as GMItem, GalleryMosaicPager } from "@/components/galery";
import { Lightbox } from "@/components/light-box";
import { useApiContext } from "@/context/ApiContext";
import { useLoadingContext } from "@/context/LoadingContext";
import { useActionSheetsContext } from "@/context/actionSheetsContext";
import { useChatContext } from "@/context/chatContext";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";

/** tipo que a Lightbox espera */
type MediaItem = {
  src: string;
  alt: string;
  poster?: string;
  mediaType?: "image" | "video";
};

const SpicyScreen = () => {
  const { openSheet, setCurrent } = useActionSheetsContext();
  const {
    userProfile,
    modelProfile,
    isPaymentConfirmed,
    modelId,
    isGettingModelProfile,
    isVerifying,
  } = useChatContext();
  const { token } = useApiContext();
  const { handleNavigation } = useLoadingContext();
  const router = useRouter();
  const pathname = usePathname();

  type IconProps = { route: string; className?: string };
  type ButtonProps = {
    route: string;
    className?: string;
    icon: React.ComponentType<IconProps>;
    label: string;
  };

  function HomeIcon({ route, className }: IconProps) {
    const isActive = pathname === route;
    return (
      <Image
        src={isActive ? "/heart-pink.png" : "/heart.png"}
        alt="heart"
        width={20}
        height={20}
        className={cn("h-5 w-5", className)}
      />
    );
  }

  function GridIcon({ route, className }: IconProps) {
    const isActive = pathname === route;
    return (
      <Image
        src={isActive ? "/gallery-pink.png" : "/galery.png"}
        alt="gallery"
        width={20}
        height={20}
        className={cn("h-5 w-5", className)}
      />
    );
  }

  // ---- estados de Lightbox (centralizados aqui) ----
  const [lbOpen, setLbOpen] = useState(false);
  const [lbIndex, setLbIndex] = useState(0);
  const [lbItems, setLbItems] = useState<MediaItem[]>([]);

  // conversor de GalleryItem -> MediaItem
  const toMediaItem = (it: GMItem): MediaItem => ({
    src: it.src,
    alt: it.alt ?? "",
    poster: it.poster,
    mediaType: it.mediaType,
  });

  return (
    <div className="flex h-full justify-center gap-2 bg-neutral-900 p-2 text-white xl:gap-5 rtl:space-x-reverse">
      <div className="custom-scrollbar relative max-w-[540px] flex-1 overflow-auto pb-40 md:rounded-md md:px-4 md:pb-20">
        {/* header */}
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
                <button
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
                </button>
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

        {/* hero */}
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
            <button className="rounded-lg bg-gradient-to-br from-[#FF0080] to-[#7928CA] px-3 py-2 text-sm text-white transition-all duration-300">
              Galeria de Conteúdo
            </button>
          </div>
        </section>

        {/* Pager -> abre lightbox com lista filtrada + índice absoluto */}
        <GalleryMosaicPager
          setOpenQrCode={() => {}}
          setSelectedItem={() => {}}
          setIsMediaOpen={() => {}}
          onOpenLightbox={(items, index) => {
            setLbItems(items.map(toMediaItem));
            setLbIndex(index);
            setLbOpen(true);
          }}
        />

        {/* Lightbox controlada por este componente */}
        <Lightbox
          open={lbOpen}
          images={lbItems}
          index={lbIndex}
          onClose={() => setLbOpen(false)}
          setIndex={setLbIndex}
          setOpenQrCode={() => {}}
        />

        {/* bottom nav */}
      </div>

      {/* bottom nav desktop */}
      <footer className="fixed -bottom-1 hidden w-full items-center justify-center self-center px-1 md:flex md:w-max md:px-4">
        <div className="w-full md:max-w-[520px] md:min-w-[400px]">
          <div className="mb-2 flex items-center justify-center gap-16 rounded-t-3xl bg-gradient-to-br from-[#FF0080] to-[#7928CA] px-8 py-2 text-xs text-white/80">
            {[
              { label: "Chat", icon: HomeIcon, route: `/${modelId}/chat` },
              { label: "Galeria", icon: GridIcon, route: `/${modelId}` },
            ].map((it: ButtonProps, idx) => (
              <button
                key={idx}
                onClick={() => (window.location.href = it.route)}
                className={cn(
                  "flex w-20 flex-col items-center justify-center gap-1 py-1 transition duration-150 hover:text-white",
                  pathname === it.route &&
                    "rounded-lg bg-white px-4 text-[#FF0080]",
                )}
              >
                <it.icon route={it.route} className="h-5 w-5" />
                {it.label}
              </button>
            ))}
          </div>
        </div>
      </footer>

      {/* bottom nav mobile */}
      <footer className="fixed right-0 bottom-1 flex items-center justify-center self-center px-1 md:hidden md:w-max md:px-4">
        <div className="w-full md:max-w-[520px] md:min-w-[400px]">
          <div className="mb-2 flex flex-col items-center justify-center gap-2 rounded-l-3xl bg-gradient-to-br from-[#FF0080] to-[#7928CA] px-2 py-2 text-xs text-white/80">
            {[
              { label: "Chat", icon: HomeIcon, route: `/${modelId}/chat` },
              { label: "Galeria", icon: GridIcon, route: `/${modelId}` },
            ].map((it: ButtonProps, idx) => (
              <button
                key={idx}
                onClick={() => (window.location.href = it.route)}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 px-2 py-2 text-[10px] font-bold transition duration-150 hover:text-white",
                  pathname === it.route &&
                    "rounded-full bg-white text-[#FF0080]",
                )}
              >
                <it.icon route={it.route} className="h-5 w-5" />
                {it.label}
              </button>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SpicyScreen;
