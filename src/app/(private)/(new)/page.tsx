"use client";
import { GalleryMosaicPager } from "@/components/galery";
import { Lightbox } from "@/components/light-box";
import { gallery1, gallery2 } from "@/components/midia";
import { useActionSheetsContext } from "@/context/actionSheetsContext";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState } from "react";

export type GalleryItem = {
  src: string;
  alt?: string;
  badge?: string;
  locked?: boolean;
  poster?: string;
  mediaType?: "image" | "video";
  placeholder?: boolean;
};
const SpicyScreen = () => {
  const { openSheet, setCurrent } = useActionSheetsContext();

  type IconProps = { route: string; className?: string };

  type ButtonProps = {
    route: string;
    className?: string;
    icon: React.ComponentType<IconProps>; // << aceita className
    label: string;
  };
  function isVideoItem(it: GalleryItem) {
    if (it.mediaType) return it.mediaType === "video";
    return /\.(mp4|webm|ogg)$/i.test(it.src);
  }
  type TabKey = "all" | "photos_unlocked" | "videos";

  function filterByTab(items: GalleryItem[], tabKey: TabKey) {
    switch (tabKey) {
      case "photos_unlocked":
        return items.filter((it) => !isVideoItem(it) && !it.locked);
      case "videos":
        return items.filter((it) => isVideoItem(it));
      case "all":
      default:
        return items;
    }
  }

  // lista plana com tudo (desordenado como você já tem)
  const allItems: GalleryItem[] = useMemo(() => [...gallery1, ...gallery2], []);

  // map de abas para a mesma regra usada no pager interno
  const tabMap: Record<number, TabKey> = {
    0: "all",
    1: "photos_unlocked",
    2: "videos",
  };
  const [selectedTab, setSelectedTab] = useState(0);
  const [secondTabSelected, setSecondTabSelected] = useState(0);
  const filtered = useMemo(
    () => filterByTab(allItems, tabMap[selectedTab] ?? "all"),
    [allItems, selectedTab],
  );
  const router = useRouter();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Lightbox aceita fotos e vídeos; passamos poster/mediaType se houver
  const lightboxItems = useMemo(
    () =>
      filtered.map((it) => ({
        src: it.src,
        alt: it.alt ?? "",
        poster: it.poster,
        mediaType: it.mediaType,
      })),
    [filtered, tabMap],
  );
  const pathname = usePathname();

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
  return (
    <div className="flex h-full justify-center gap-2 bg-neutral-900 p-2 text-white md:pb-0 xl:gap-5 rtl:space-x-reverse">
      <div className="relative max-w-[540px] flex-1 overflow-auto pb-4 md:rounded-md md:border md:px-4">
        {/* header */}
        <header className="flex items-center justify-between pt-4">
          <div className="flex items-center gap-2">
            <Image src="/logoBunny.png" alt="Spicy.ai" width={32} height={32} />

            {/* <span className="text-xl font-semibold">Spicy.ai</span> */}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setCurrent("register"), openSheet();
              }}
              className="rounded-md border border-[#FF0080] bg-gradient-to-br from-[#FF0080]/20 to-[#7928CA]/20 px-3 py-1.5 text-xs hover:bg-[#e24c69]"
            >
              Registro Grátis
            </button>
            <button
              onClick={() => {
                setCurrent("password"), openSheet();
              }}
              className="rounded-md border border-[#FF0080] px-3 py-1.5 text-xs"
            >
              Login
            </button>
          </div>
        </header>

        {/* hero */}
        <section className="mt-4">
          <div className="relative h-32 overflow-hidden rounded-2xl bg-[#2A2A2E]">
            <div className="absolute inset-0 flex items-center justify-center">
              <Image
                src="/banner1.png"
                alt="Gabriela"
                width={10000}
                height={10000}
                className="h-[100%] w-[100%] rounded-xl bg-white"
              />
            </div>

            <span className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[11px] text-emerald-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Online
            </span>
          </div>

          <p className="mt-3 text-center text-sm text-white/90">
            Oie... Gabi aqui cheia de responsabilidades! Entre aulas, estágio e
            consultas, aceito aquele pix carinhoso 😘💸
          </p>

          <div className="mt-3 flex w-full justify-center gap-2">
            <button
              onClick={() => {
                router.push("/chat");
              }}
              className={cn(
                `flex cursor-pointer flex-row items-center gap-2 rounded-lg border border-[#FF0080] from-[#FF0080] to-[#7928CA] px-3 py-2 text-sm text-white transition-all duration-700 hover:scale-[1.01] hover:bg-[#FF0080]`,
              )}
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
                setSelectedTab(0);
              }}
              className={cn(
                `rounded-lg px-3 py-2 text-sm text-white transition-all duration-300`,
                selectedTab === 0 &&
                  "bg-gradient-to-br from-[#FF0080] to-[#7928CA]",
              )}
            >
              Galeria de Conteúdo
            </button>
          </div>
        </section>
        <div className="mt-4 flex w-full items-center justify-center gap-4">
          <button
            className={cn(
              "cursor-pointer font-semibold",
              secondTabSelected === 0 && "border-b border-[#FF0080]",
            )}
            onClick={() => setSecondTabSelected(0)}
          >
            Tudo
          </button>
          <button
            className={cn(
              "relative flex items-center gap-2 pr-2 font-semibold",
              secondTabSelected === 1 && "border-b border-[#FF0080]",
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
            className={cn(
              "relative flex items-center gap-2 pr-2 font-semibold",
              secondTabSelected === 2 && "border-b border-[#FF0080]",
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
        <GalleryMosaicPager
          items={gallery1}
          selectedTab={secondTabSelected}
          onItemClick={(globalIndex: number, _item: any) => {
            // índice já é relativo ao filtrado; a Lightbox usa a mesma coleção `filtered`
            setLightboxIndex(globalIndex);
            setLightboxOpen(true);
          }}
        />
        {/* grid */}
        <section className="mt-3 bg-[#1f1f21]">
          <div className="grid grid-cols-6 gap-3">
            {filtered.map((m, index) => {
              const base =
                "relative overflow-hidden rounded-2xl bg-[#2A2A2E] shadow-soft";

              return (
                <div key={index} className={`${base}`}>
                  {/* imagem fake */}
                  <div className="absolute inset-0 m-2 rounded-xl bg-white" />

                  {/* etiqueta tipo */}
                  <div className="absolute top-2 left-2 rounded-full bg-black/50 px-2 py-0.5 text-[10px]">
                    {m.mediaType === "video" ? "Vídeo" : "Foto"}
                  </div>

                  {/* lock */}
                  {m.locked && (
                    <>
                      <div className="absolute inset-0 bg-black/40" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#1f1f21]">
                          <svg
                            viewBox="0 0 24 24"
                            className="h-5 w-5"
                            fill="currentColor"
                          >
                            <path d="M12 1a5 5 0 00-5 5v3H6a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2v-8a2 2 0 00-2-2h-1V6a5 5 0 00-5-5zm-3 8V6a3 3 0 116 0v3H9z" />
                          </svg>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <Lightbox
          open={lightboxOpen}
          images={lightboxItems}
          index={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
          setIndex={(i: number) => setLightboxIndex(i)}
          setOpenQrCode={() => console.log(false)}
        />

        {/* bottom nav */}
      </div>
      <footer className="fixed -bottom-1 hidden w-full items-center justify-center self-center px-1 md:flex md:w-max md:px-4">
        <div className="w-full md:max-w-[520px] md:min-w-[400px]">
          <div className="mb-2 flex items-center justify-center gap-16 rounded-t-3xl bg-gradient-to-br from-[#FF0080] to-[#7928CA] px-8 py-2 text-xs text-white/80">
            {[
              { label: "Chat", icon: HomeIcon, route: "/chat" },
              { label: "Galeria", icon: GridIcon, route: "/" },
              // { label: "Perfil", icon: UserIcon as unknown as React.ComponentType<IconProps>, route: "/chat" },
            ].map((it: ButtonProps, idx) => (
              <button
                key={idx}
                onClick={() => (window.location.href = it.route)}
                className={cn(
                  "flex w-20 flex-col items-center justify-center gap-1 py-1 hover:text-white",
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
      <footer className="fixed right-0 bottom-1 flex items-center justify-center self-center px-1 md:hidden md:w-max md:px-4">
        <div className="w-full md:max-w-[520px] md:min-w-[400px]">
          <div className="mb-2 flex flex-col items-center justify-center gap-2 rounded-l-3xl bg-gradient-to-br from-[#FF0080] to-[#7928CA] px-2 py-2 text-xs text-white/80">
            {[
              { label: "Chat", icon: HomeIcon, route: "/chat" },
              { label: "Galeria", icon: GridIcon, route: "/" },
              // { label: "Perfil", icon: UserIcon as unknown as React.ComponentType<IconProps>, route: "/chat" },
            ].map((it: ButtonProps, idx) => (
              <button
                key={idx}
                onClick={() => (window.location.href = it.route)}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 px-2 py-2 text-[10px] font-bold hover:text-white",
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

/** ---- tiny icons (svg) ---- */

export default SpicyScreen;
