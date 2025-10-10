// import {
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "@/src/components/ui/accordion";
// import { Button } from "@/src/components/ui/button";
// import { Label } from "@/src/components/ui/label";
// import {
//   Popover,
//   PopoverArrow,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/src/components/ui/popover";
// import { ScrollArea } from "@/src/components/ui/scroll-area";
// import { useChatContext } from "@/src/context/chatContext";
// import { useGlobalContext } from "@/src/context/globalContext";
// import { AuthPostAPI, AuthPutAPI, token } from "@/src/lib/axios";
// import { cn } from "@/src/lib/utils";
// import { ChevronDown, Loader2, X } from "lucide-react";
// import moment from "moment";
// import { useCookies } from "next-client-cookies";
// import { useState } from "react";
// import ReactMarkdown from "react-markdown";
// import remarkGfm from "remark-gfm";
// import { twMerge } from "tailwind-merge";

// export function AiAccordion() {
//   const cookies = useCookies();
//   const { assistantList } = useGlobalContext();
//   const { selectedChat, selectedChatSummaries, setSelectedChat } =
//     useChatContext();
//   const [isCreatingNewSummary, setIsCreatingNewSummary] = useState(false);
//   const [selectedSummaryId, setSelectedSummaryId] = useState<string | null>(
//     null,
//   );

//   async function handleChangeClientAssistant(assistantId: string) {
//     const update = await AuthPutAPI(
//       `/client/${selectedChat?.id}`,
//       {
//         assistantId,
//       },
//       cookies.get(token),
//     );
//     if (update.status === 200) {
//       if (selectedChat) {
//         setSelectedChat({
//           ...selectedChat,
//           assistantId,
//         });
//       }
//     }
//   }

//   async function handleCreateSummary() {
//     setIsCreatingNewSummary(true);
//     const summary = await AuthPostAPI(
//       `/summary/${selectedChat?.id}`,
//       {},
//       cookies.get(token),
//     );
//     if (summary.status === 200) {
//       return setIsCreatingNewSummary(false);
//     }
//     alert("Erro ao editar cliente");
//     return setIsCreatingNewSummary(false);
//   }

//   return (
//     <>
//       {selectedSummaryId && (
//         <div
//           className="fixed bottom-0 left-0 right-0 top-0 z-[1000] flex w-full items-center justify-center text-center transition-opacity duration-300 ease-in-out"
//           style={{ opacity: selectedSummaryId ? 1 : 0 }}
//         >
//           <button
//             onClick={() => {
//               setSelectedSummaryId(null);
//             }}
//             className="absolute z-[999] h-full w-full bg-white/20 backdrop-blur"
//           />
//           <div className="relative z-[1001] flex flex-col items-center justify-center">
//             <div
//               className={twMerge(
//                 "relative z-[1002] flex max-h-[80vh] w-[95%] max-w-[300px] flex-col rounded-md border border-gray-200 bg-white shadow-md lg:max-w-[600px]",
//               )}
//             >
//               <ScrollArea>
//                 <button
//                   onClick={() => {
//                     setSelectedSummaryId(null);
//                   }}
//                   className="absolute right-2 top-2 h-5 w-5"
//                 >
//                   <X />
//                 </button>
//                 <div className="flex h-full w-full flex-col px-4 py-2">
//                   <Label className="text-xl font-semibold">
//                     Resumo -{" "}
//                     {new Date(
//                       selectedChatSummaries.find(
//                         (s) => s.id === (selectedSummaryId as string),
//                       )?.createdAt as string,
//                     ).toLocaleDateString("pt-BR")}
//                   </Label>
//                   <ReactMarkdown
//                     remarkPlugins={[remarkGfm]}
//                     className="text-justify"
//                   >
//                     {
//                       selectedChatSummaries.find(
//                         (s) => s.id === (selectedSummaryId as string),
//                       )?.summary
//                     }
//                   </ReactMarkdown>
//                 </div>
//               </ScrollArea>
//             </div>
//             <div className="absolute bottom-0 right-0 z-10 h-full max-w-[500px] blur-sm" />
//           </div>
//         </div>
//       )}
//       <AccordionItem
//         value="item-4"
//         className="rounded-none border border-x-0 border-b-0 shadow-none dark:bg-accent dark:shadow-none lg:p-2 xl:p-3"
//       >
//         <AccordionTrigger className="text-xs xl:text-sm">
//           Inteligência Artificial
//         </AccordionTrigger>
//         <AccordionContent>
//           <div className="flex w-full flex-col gap-2">
//             <Popover>
//               <PopoverTrigger asChild>
//                 <button className="flex w-full items-center justify-between rounded-md bg-primary/20 p-2 text-primary lg:p-1 xl:p-2">
//                   {assistantList
//                     ? assistantList.find(
//                         (s) => s.id === selectedChat?.assistantId,
//                       )
//                       ? assistantList.find(
//                           (s) => s.id === selectedChat?.assistantId,
//                         )?.name +
//                         " - " +
//                         assistantList.find(
//                           (s) => s.id === selectedChat?.assistantId,
//                         )?.description
//                       : "Selecione uma Inteligência Artificial"
//                     : "Carregando..."}
//                   <ChevronDown size={16} />
//                 </button>
//               </PopoverTrigger>
//               <PopoverContent className="z-[1003] w-48 p-0">
//                 <PopoverArrow className="w-3 fill-primary" />
//                 {assistantList.map((item, index) => (
//                   <button
//                     key={index}
//                     onClick={() => handleChangeClientAssistant(item.id)}
//                     className={cn(
//                       "w-full truncate border-y border-default-200 p-1 transition duration-200 hover:bg-primary/20 hover:text-primary",
//                       item.id === selectedChat?.assistantId &&
//                         "bg-primary/20 text-primary",
//                     )}
//                   >
//                     {item.name} - {item.description}
//                   </button>
//                 ))}
//               </PopoverContent>
//             </Popover>
//             <Button
//               onClick={handleCreateSummary}
//               disabled={isCreatingNewSummary}
//               className="lg:h-max lg:px-2 lg:py-1 xl:h-9 xl:px-3 xl:py-2"
//             >
//               {isCreatingNewSummary ? (
//                 <>
//                   <Loader2 className="animate-spin text-primary" />
//                   Gerando Resumo...
//                 </>
//               ) : (
//                 "Gerar novo Resumo"
//               )}
//             </Button>
//           </div>
//           {selectedChatSummaries && selectedChatSummaries.length !== 0 ? (
//             <>
//               <span className="text-xl font-semibold text-default-600 lg:text-base xl:text-xl">
//                 Resumos
//               </span>
//               <ScrollArea className="max-h-[800px]">
//                 {selectedChatSummaries
//                   .sort(
//                     (a, b) =>
//                       moment(b.createdAt).unix() - moment(a.createdAt).unix(),
//                   )
//                   .map((item, index) => (
//                     <Button
//                       className="mb-2 h-max w-full p-1"
//                       key={index}
//                       value={`item-${index}`}
//                       onClick={() => setSelectedSummaryId(item.id)}
//                     >
//                       <Label className="cursor-pointer font-semibold">
//                         {new Date(item.createdAt).toLocaleString("pt-BR")}
//                       </Label>
//                     </Button>
//                   ))}
//               </ScrollArea>
//             </>
//           ) : (
//             <span className="text-center italic text-zinc-600">
//               Ainda não foi criado uma Análise da Inteligência Artificial.
//             </span>
//           )}
//         </AccordionContent>
//       </AccordionItem>
//     </>
//   );
// }
