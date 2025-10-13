// "use client";
// import { Button } from "@/src/components/ui/button";
// import { Label } from "@/src/components/ui/label";
// import { ScrollArea } from "@/src/components/ui/scroll-area";
// import { ArrowLeft, Download, Headphones } from "lucide-react";
// import Image from "next/image";
// import { twMerge } from "tailwind-merge";
// import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
// import { AudioPlayer } from "../AudioPlayer";
// import { cn } from "@/src/lib/utils";
// import { useState } from "react";
// import { useChatContext } from "@/src/context/chatContext";

// interface MediaSheetProps {
//   open: boolean;
//   onClose: () => void;
// }

// export function MediaSheet({ open, onClose }: MediaSheetProps) {
//   const { selectedChatMessages } = useChatContext();
//   const [openImageModal, setOpenImageModal] = useState(false);
//   const [imageId, setImageId] = useState<string | null>(null);
//   const [openAudioModal, setOpenAudioModal] = useState(false);
//   const [audioId, setAudioId] = useState<string | null>(null);

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
//                   (message) => message.isImage || message.isAudioTranscript,
//                 ).length === 0 ? (
//                   <></>
//                 ) : (
//                   selectedChatMessages
//                     .filter(
//                       (message) => message.isImage || message.isAudioTranscript,
//                     )
//                     .map((message, index) => (
//                       <>
//                         {message.isAudioTranscript ? (
//                           <button
//                             key={index}
//                             onClick={() => {
//                               setOpenAudioModal(true);
//                               setAudioId(message.id);
//                             }}
//                             className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-md border"
//                           >
//                             <Headphones className="text-primary" />
//                           </button>
//                         ) : message.isImage ? (
//                           <button
//                             key={index}
//                             onClick={() => {
//                               setOpenImageModal(true);
//                               setImageId(message.id);
//                             }}
//                             className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-md border"
//                           >
//                             <Image
//                               src={message.imageUrl}
//                               alt=""
//                               width={100}
//                               height={100}
//                               className="h-full w-full object-cover"
//                             />
//                           </button>
//                         ) : null}
//                       </>
//                     ))
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
//       {openImageModal && (
//         <div
//           onClick={() => console.log("modal")}
//           className="fixed bottom-0 left-0 right-0 top-0 z-[100000] flex w-full items-center justify-center text-center transition-opacity duration-300 ease-in-out"
//           style={{ opacity: openImageModal ? 1 : 0 }}
//         >
//           <button
//             onClick={() => {
//               setOpenImageModal(false);
//               setImageId(null);
//             }}
//             className="absolute z-[100010] h-full w-full bg-white/20 backdrop-blur"
//           />
//           <div className="relative z-[100020] flex flex-col items-center justify-center">
//             <div
//               className={twMerge(
//                 "relative z-[100030] flex aspect-[9/16] h-[95vh] flex-col items-center justify-center overflow-hidden rounded-md border border-gray-200 bg-white shadow-md",
//               )}
//             >
//               <div className="absolute top-0 z-[100040] flex h-12 w-full items-center justify-between bg-white/50 p-2 backdrop-blur">
//                 <button
//                   className="flex h-6 w-6 items-center justify-center"
//                   onClick={() => setOpenImageModal(false)}
//                 >
//                   <ArrowLeft />
//                 </button>
//                 <span className="mx-2 truncate">
//                   {
//                     selectedChatMessages.find((m) => m.id === imageId)
//                       ?.imageCaption
//                   }
//                 </span>
//                 <button
//                   onClick={() =>
//                     window.open(
//                       selectedChatMessages.find((m) => m.id === imageId)
//                         ?.imageUrl,
//                       "_blank",
//                     )
//                   }
//                   className="flex items-center justify-center rounded border border-black p-1 text-black transition duration-200"
//                 >
//                   <Download size={14} />
//                 </button>
//               </div>
//               <TransformWrapper>
//                 <TransformComponent
//                   contentStyle={{
//                     width: "100%",
//                     height: "100%",
//                   }}
//                   wrapperStyle={{
//                     width: "100%",
//                     height: "100%",
//                   }}
//                 >
//                   <Image
//                     key={
//                       selectedChatMessages.find((m) => m.id === imageId)
//                         ?.imageUrl
//                     } // Add this line
//                     className="z-[1005] h-full"
//                     alt=""
//                     src={
//                       selectedChatMessages.find((m) => m.id === imageId)
//                         ?.imageUrl as string
//                     }
//                     width={1000}
//                     height={1000}
//                     style={{
//                       objectFit: "contain",
//                     }}
//                     loading="lazy"
//                   />
//                 </TransformComponent>
//               </TransformWrapper>
//             </div>
//             <div className="absolute bottom-0 right-0 z-10 h-full max-w-[500px] blur-sm" />
//           </div>
//         </div>
//       )}
//       {openAudioModal && (
//         <div
//           className="fixed bottom-0 left-0 right-0 top-0 z-[1000] flex w-full items-center justify-center text-center transition-opacity duration-300 ease-in-out"
//           style={{ opacity: openAudioModal ? 1 : 0 }}
//         >
//           <button
//             onClick={() => {
//               setOpenAudioModal(false);
//               setAudioId(null);
//             }}
//             className="absolute z-[999] h-full w-full bg-white/20 backdrop-blur"
//           />
//           <div className="relative z-[1001] flex flex-col items-center justify-center">
//             <div
//               className={twMerge(
//                 "relative z-[1002] flex h-max w-[95%] max-w-[300px] flex-col items-center justify-center overflow-hidden rounded-md border border-gray-200 bg-white shadow-md",
//               )}
//             >
//               <AudioPlayer
//                 className="min-w-full"
//                 audioUrl={
//                   selectedChatMessages.find((m) => m.id === audioId)
//                     ?.audioUrl as string
//                 }
//               />
//               <div className="no-scrollbar max-h-[300px] overflow-y-scroll p-2 text-justify">
//                 {selectedChatMessages.find((m) => m.id === audioId)?.text}
//               </div>
//             </div>
//             <div className="absolute bottom-0 right-0 z-10 h-full max-w-[500px] blur-sm" />
//           </div>
//         </div>
//       )}
//     </>
//   );
// }
