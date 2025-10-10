// import {
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "@/src/components/ui/accordion";
// import { Button } from "@/src/components/ui/button";
// import { Calendar } from "@/src/components/ui/calendar";
// import { Label } from "@/src/components/ui/label";
// import {
//   Popover,
//   PopoverArrow,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/src/components/ui/popover";
// import { ScrollArea } from "@/src/components/ui/scroll-area";
// import { Textarea } from "@/src/components/ui/textarea";
// import { useChatContext } from "@/src/context/chatContext";
// import { AuthPostAPI, authDeleteAPI, token } from "@/src/lib/axios";
// import { Icon } from "@iconify/react";
// import { Check, Clock, Loader2, Trash, X } from "lucide-react";
// import moment from "moment";
// import { useCookies } from "next-client-cookies";
// import { useState } from "react";
// import toast from "react-hot-toast";
// import { twMerge } from "tailwind-merge";

// export function ScheduledMessageAccordion() {
//   const cookies = useCookies();

//   const {
//     handleFetchScheduledMessages,
//     selectedChatId,
//     selectedChatScheduledMessages,
//   } = useChatContext();
//   const [isScheduledMessagePopoverOpen, setIsScheduledMessagePopoverOpen] =
//     useState(false);
//   const [selectedScheduledMessageId, setSelectedScheduledMessageId] = useState<
//     string | null
//   >(null);
//   const [isCreatingScheduledMessage, setIsCreatingScheduledMessage] =
//     useState(false);
//   const [scheduledMessage, setScheduledMessage] = useState({
//     sendDate: new Date(),
//     message: "",
//     sendTime: "",
//   });

//   async function handleCreateScheduledMessage() {
//     if (scheduledMessage.message === "")
//       return toast.error("Preencha a mensagem");
//     if (scheduledMessage.sendTime === "")
//       return toast.error("Preencha o horário");

//     setIsCreatingScheduledMessage(true);
//     const message = await AuthPostAPI(
//       "/scheduled-message",
//       {
//         ...scheduledMessage,
//         clientId: selectedChatId,
//       },
//       cookies.get(token),
//     );

//     setIsCreatingScheduledMessage(false);

//     if (message.status === 200) {
//       toast.success("Mensagem agendada com sucesso");
//       setScheduledMessage({
//         message: "",
//         sendDate: new Date(),
//         sendTime: "",
//       });
//       await handleFetchScheduledMessages();
//       setIsScheduledMessagePopoverOpen(false);
//       return setIsCreatingScheduledMessage(false);
//     }

//     toast.error("Erro ao agendar mensagem");
//   }

//   async function handleRemoveScheduledMessage() {
//     const scheduledMessage = selectedChatScheduledMessages.find(
//       (message) => message.id === selectedScheduledMessageId,
//     );

//     if (!scheduledMessage || scheduledMessage.isMessageSent)
//       return toast.error("Não é possível remover uma mensagem já enviada");

//     setIsCreatingScheduledMessage(true);

//     await authDeleteAPI(
//       `/scheduled-message/${selectedScheduledMessageId}`,
//       cookies.get(token),
//     );
//     setIsCreatingScheduledMessage(false);

//     toast.success("Mensagem removida com sucesso");
//     setSelectedScheduledMessageId(null);
//   }

//   return (
//     <>
//       {selectedScheduledMessageId && (
//         <div
//           className="fixed bottom-0 left-0 right-0 top-0 z-[1000] flex w-full items-center justify-center text-center transition-opacity duration-300 ease-in-out"
//           style={{ opacity: selectedScheduledMessageId ? 1 : 0 }}
//         >
//           <button
//             onClick={() => {
//               setSelectedScheduledMessageId(null);
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
//                     setSelectedScheduledMessageId(null);
//                   }}
//                   className="absolute left-2 top-2 h-5 w-5"
//                 >
//                   <X />
//                 </button>
//                 <button
//                   onClick={() => {
//                     handleRemoveScheduledMessage();
//                   }}
//                   className="absolute right-2 top-2 h-5 w-5"
//                 >
//                   {isCreatingScheduledMessage ? (
//                     <Loader2 className="animate-spin text-primary" />
//                   ) : (
//                     <Trash className="text-red-500" />
//                   )}
//                 </button>
//                 <div className="flex h-full w-full flex-col px-8 py-2">
//                   <Label className="text-xl font-semibold">
//                     Mensagem -{" "}
//                     {new Date(
//                       selectedChatScheduledMessages.find(
//                         (s) => s.id === (selectedScheduledMessageId as string),
//                       )?.date as Date,
//                     ).toLocaleDateString("pt-BR")}
//                   </Label>
//                   <span className="rounded-md border border-primary text-base">
//                     {
//                       selectedChatScheduledMessages.find(
//                         (s) => s.id === (selectedScheduledMessageId as string),
//                       )?.text
//                     }
//                   </span>
//                 </div>
//               </ScrollArea>
//             </div>
//             <div className="absolute bottom-0 right-0 z-10 h-full max-w-[500px] blur-sm" />
//           </div>
//         </div>
//       )}
//       <AccordionItem
//         value="item-6"
//         className="rounded-none border border-x-0 border-b-0 shadow-none dark:bg-accent dark:shadow-none lg:p-2 xl:p-3"
//       >
//         <AccordionTrigger className="text-xs xl:text-sm">
//           Agendar Mensagens
//         </AccordionTrigger>
//         <AccordionContent>
//           <div className="flex flex-col items-center justify-around gap-4 lg:gap-2 xl:gap-4">
//             <Popover
//               open={isScheduledMessagePopoverOpen}
//               onOpenChange={setIsScheduledMessagePopoverOpen}
//             >
//               <PopoverTrigger asChild>
//                 <button className="flex items-center justify-center gap-2 rounded-md border border-primary p-1 text-primary transition duration-100 hover:-translate-y-0.5 hover:scale-[1.05]">
//                   <span>Nova Mensagem Agendada</span>
//                   <Icon icon="heroicons:calendar" className="h-3.5 w-3.5" />
//                 </button>
//               </PopoverTrigger>
//               <PopoverContent
//                 side="left"
//                 className="mr-4 border border-default-200 shadow-lg"
//               >
//                 <PopoverArrow className="w-3 fill-primary" />
//                 <Calendar
//                   mode="single"
//                   selected={
//                     new Date(
//                       scheduledMessage.sendDate
//                         ? scheduledMessage.sendDate
//                         : new Date(),
//                     )
//                   }
//                   onSelect={(date) => {
//                     if (date) {
//                       setScheduledMessage((prev) => ({
//                         ...prev,
//                         sendDate: date,
//                       }));
//                     }
//                   }}
//                   initialFocus
//                 />
//                 <div className="flex w-full items-center justify-between bg-primary/10 p-2 font-semibold">
//                   <span>Hora: </span>
//                   <input
//                     type="time"
//                     value={scheduledMessage.sendTime}
//                     onChange={(e) => {
//                       setScheduledMessage((prev) => ({
//                         ...prev,
//                         sendTime: e.target.value,
//                       }));
//                     }}
//                     className="bg-transparent focus:border-primary focus:outline-primary focus:ring-primary"
//                   />
//                 </div>
//                 <div className="flex w-full flex-col gap-2 p-2">
//                   <Textarea
//                     className="rounded-md"
//                     variant="bordered"
//                     placeholder="Mensagem"
//                     value={scheduledMessage.message}
//                     onChange={(e) => {
//                       setScheduledMessage((prev) => ({
//                         ...prev,
//                         message: e.target.value,
//                       }));
//                     }}
//                   />
//                   <Button
//                     onClick={handleCreateScheduledMessage}
//                     disabled={isCreatingScheduledMessage}
//                   >
//                     {isCreatingScheduledMessage
//                       ? "Criando..."
//                       : "Criar Mensagem"}
//                   </Button>
//                 </div>
//               </PopoverContent>
//             </Popover>
//             {selectedChatScheduledMessages.length === 0 ? (
//               <div className="flex flex-col items-center justify-center gap-4">
//                 <span className="text-default-400">
//                   Nenhuma mensagem agendada
//                 </span>
//               </div>
//             ) : (
//               <div className="flex flex-col items-center justify-center gap-4">
//                 <span className="text-default-400">Mensagens Agendadas:</span>
//               </div>
//             )}
//             <ScrollArea className="max-h-[800px]">
//               {selectedChatScheduledMessages
//                 .sort((a, b) => moment(b.date).unix() - moment(a.date).unix())
//                 .map((item, index) => (
//                   <Button
//                     className="mb-2 h-max w-full p-1"
//                     key={index}
//                     value={`item-${index}`}
//                     onClick={() => setSelectedScheduledMessageId(item.id)}
//                   >
//                     <Label className="flex cursor-pointer items-center px-2 text-xs font-medium">
//                       {item.isMessageSent ? (
//                         <>
//                           <Check className="mr-2 h-4 w-4" /> Enviado em -{" "}
//                         </>
//                       ) : (
//                         <>
//                           <Clock className="mr-2 h-4 w-4" />
//                           Agendado para -{" "}
//                         </>
//                       )}
//                       {moment(item.date).format("DD/MM")} as {item.time}
//                     </Label>
//                   </Button>
//                 ))}
//             </ScrollArea>
//           </div>
//         </AccordionContent>
//       </AccordionItem>
//     </>
//   );
// }
