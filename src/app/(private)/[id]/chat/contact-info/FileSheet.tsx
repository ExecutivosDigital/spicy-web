// "use client";
// import { Button } from "@/src/components/ui/button";
// import { Label } from "@/src/components/ui/label";
// import { ScrollArea } from "@/src/components/ui/scroll-area";
// import { Sheet, SheetContent } from "@/src/components/ui/sheet";
// import { ArrowLeft, Download, Headphones, Info } from "lucide-react";
// import Image from "next/image";
// import { twMerge } from "tailwind-merge";
// import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
// import { AudioPlayer } from "../AudioPlayer";
// import { cn } from "@/src/lib/utils";
// import { Icon } from "@iconify/react";
// import { useChatContext } from "@/src/context/chatContext";

// interface FileSheetProps {
//   open: boolean;
//   onClose: () => void;
// }

// export function FileSheet({ open, onClose }: FileSheetProps) {
//   const { selectedChatMessages } = useChatContext();

//   return (
//     <>
//       <div className="absolute bottom-0 left-0 right-0 top-0 z-[1000]">
//         <div
//           onClick={onClose}
//           className="left-0 top-0 hidden h-screen bg-white/20 backdrop-blur-sm md:fixed md:block md:w-[calc(100%-80px)]"
//         />
//         <div
//           className={cn(
//             "fixed right-0 top-0 z-[1010] flex h-screen w-full flex-col bg-white p-4 md:w-80",
//             open ? "block" : "hidden",
//           )}
//         >
//           <div className="flex h-full w-full flex-col justify-between">
//             <span className="mb-2 text-2xl font-semibold">Mídia</span>
//             <ScrollArea className="flex h-[calc(100%-48px)] w-full flex-col gap-4 pb-2">
//               <div className="flex w-full flex-wrap justify-center gap-4">
//                 {selectedChatMessages.filter(
//                   (message) => message.isFile && message.fileUrl,
//                 ).length === 0 ? (
//                   <></>
//                 ) : (
//                   selectedChatMessages
//                     .filter((message) => message.isFile && message.fileUrl)
//                     .map(
//                       (message, index) =>
//                         message.isFile &&
//                         message.fileUrl && (
//                           <button
//                             key={index}
//                             onClick={() =>
//                               window.open(message.fileUrl as string, "_blank")
//                             }
//                             className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-md border"
//                           >
//                             <div className="flex h-full w-full flex-col items-center justify-center">
//                               <Info size={16} />
//                               <span className="w-full text-[10px] leading-4">
//                                 {message.text.length >= 50
//                                   ? `${message.text.slice(0, 50)}...`
//                                   : message.text}
//                               </span>
//                             </div>
//                           </button>
//                         ),
//                     )
//                 )}
//               </div>
//             </ScrollArea>
//             <Button
//               onClick={onClose}
//               className="mx-auto h-10 w-max rounded-lg bg-primary px-4 text-white"
//             >
//               Voltar
//             </Button>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }
