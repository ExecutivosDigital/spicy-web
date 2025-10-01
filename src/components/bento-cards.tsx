import clsx from "clsx";
import { motion } from "framer-motion";
export function GiftsBento() {
  const gifts = [
    { id: "g1", emoji: "💐", title: "Quero uma Foto Sensual", price: "R$ 9" },
    { id: "g2", emoji: "🍫", title: "Chocolate", price: "R$ 12" },
    { id: "g3", emoji: "☕", title: "Café", price: "R$ 7" },
    { id: "g4", emoji: "🍰", title: "Doce", price: "R$ 15" },
    { id: "g5", emoji: "📸", title: "Polaroid", price: "R$ 29" },
    { id: "g6", emoji: "💎", title: "Brilho", price: "R$ 49" },
    { id: "g7", emoji: "🎧", title: "Música", price: "R$ 19" },
    { id: "g8", emoji: "🌹", title: "Rosa", price: "R$ 6" },
  ];
  return (
    <div className="min-h-[calc(100dvh-56px)] bg-white px-3 py-3 pb-20">
      <div className="grid auto-rows-[112px] grid-cols-2 gap-3">
        {gifts.map((g, i) => (
          <motion.button
            key={g.id}
            whileTap={{ scale: 0.98 }}
            // onClick={() => {
            //   setMessages((m) => [
            //     ...m,
            //     {
            //       id: crypto.randomUUID(),
            //       kind: "text",
            //       text: `Você enviou ${g.emoji} ${g.title} (${g.price})`,
            //       sender: "me",
            //       ts: Date.now(),
            //     },
            //   ]);
            //   setPage(1);
            // }}
            className={clsx(
              "relative rounded-2xl border p-3 text-left shadow-sm",
              i % 3 === 0
                ? "col-span-2 border-transparent bg-gradient-to-r from-indigo-50 to-fuchsia-50"
                : "border-neutral-200 bg-neutral-50",
            )}
          >
            <div className="text-3xl">{g.emoji}</div>
            <div className="mt-1 text-[13px] font-semibold">{g.title}</div>
            <div className="text-[11px] text-neutral-500">{g.price}</div>
            <span className="absolute right-3 bottom-3 rounded-md bg-black/80 px-2 py-0.5 text-[10px] text-white">
              Presentear
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
