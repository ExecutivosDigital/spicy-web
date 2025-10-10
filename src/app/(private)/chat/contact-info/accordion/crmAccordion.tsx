// import {
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "@/src/components/ui/accordion";
// import { Calendar } from "@/src/components/ui/calendar";
// import {
//   Command,
//   CommandEmpty,
//   CommandGroup,
//   CommandInput,
//   CommandItem,
// } from "@/src/components/ui/command";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuTrigger,
// } from "@/src/components/ui/dropdown-menu";
// import { Label } from "@/src/components/ui/label";
// import { useChatContext } from "@/src/context/chatContext";
// import { useGlobalContext } from "@/src/context/globalContext";
// import { useEffect, useState } from "react";

// import {
//   Popover,
//   PopoverArrow,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/src/components/ui/popover";
// import { ScrollArea } from "@/src/components/ui/scroll-area";
// import { AuthPutAPI, token } from "@/src/lib/axios";
// import { cn } from "@/src/lib/utils";
// import { Icon } from "@iconify/react";
// import { Check, CheckCheck, ChevronDown } from "lucide-react";
// import { useCookies } from "next-client-cookies";
// import { twMerge } from "tailwind-merge";

// export function CrmAccordion() {
//   const cookies = useCookies();
//   const { userList, whatsAppInstanceList } = useGlobalContext();
//   const { selectedChat, setSelectedChat } = useChatContext();
//   const { serviceList, boardList } = useGlobalContext();

//   const [boardId, setBoardId] = useState<string | null>(null);
//   const [serviceId, setServiceId] = useState<string | null>(null);

//   const [isPhoneOpen, setIsPhoneOpen] = useState(false);
//   const [isUserPopoverOpen, setIsUserPopoverOpen] = useState(false);
//   const [isBoardPopoverOpen, setIsBoardPopoverOpen] = useState(false);
//   const [isServicePopoverOpen, setIsServicePopoverOpen] = useState(false);
//   const [isFollowUpPopoverOpen, setIsFollowUpPopoverOpen] = useState(false);

//   async function handleChangeClientUser(userId: string) {
//     const update = await AuthPutAPI(
//       `/client/${selectedChat?.id}`,
//       {
//         userId,
//       },
//       cookies.get(token),
//     );
//     if (update.status === 200) {
//       setIsUserPopoverOpen(false);
//       if (selectedChat) {
//         setSelectedChat({
//           ...selectedChat,
//           userId,
//         });
//       }
//     }
//   }

//   async function handleChangeClientInstance(instanceId: string | null) {
//     const update = await AuthPutAPI(
//       `/client/${selectedChat?.id}`,
//       {
//         instanceId,
//       },
//       cookies.get(token),
//     );

//     if (update.status === 200) {
//       setIsUserPopoverOpen(false);
//       if (selectedChat) {
//         setSelectedChat({
//           ...selectedChat,
//           instanceId,
//         });
//       }
//     }
//   }

//   async function handleChangeClientFollowupDate(date: string | null) {
//     const update = await AuthPutAPI(
//       `/client/${selectedChat?.id}`,
//       {
//         nextFollowupDate: date,
//       },
//       cookies.get(token),
//     );
//     if (update.status === 200) {
//       setIsFollowUpPopoverOpen(false);
//       if (selectedChat) {
//         setSelectedChat({
//           ...selectedChat,
//           nextFollowupDate: date,
//         });
//       }
//     }
//   }

//   async function handleChangeClientBoard(boardId: string) {
//     const update = await AuthPutAPI(
//       `/client/${selectedChat?.id}`,
//       {
//         boardId,
//       },
//       cookies.get(token),
//     );
//     if (update.status === 200) {
//       setIsBoardPopoverOpen(false);
//       if (selectedChat) {
//         setSelectedChat({
//           ...selectedChat,
//           boardId,
//         });
//       }
//     }
//   }

//   useEffect(() => {
//     if (selectedChat) {
//       if (selectedChat.boardId) {
//         setBoardId(selectedChat.boardId);
//       }

//       const board = boardList.find(
//         (board) => board.id === selectedChat.boardId,
//       );

//       if (board && !serviceId) {
//         setServiceId(board.serviceId);
//       }

//       if (!selectedChat.instanceId && whatsAppInstanceList.length === 1) {
//         handleChangeClientInstance(whatsAppInstanceList[0].id);
//       }
//     }
//   }, [selectedChat]);

//   return (
//     <AccordionItem
//       value="item-2"
//       className="rounded-b rounded-t-none border border-x-0 shadow-none dark:bg-accent dark:shadow-none lg:p-2 xl:p-3"
//     >
//       <AccordionTrigger className="text-xs xl:text-sm">CRM</AccordionTrigger>
//       <AccordionContent>
//         <div className="flex w-full flex-col gap-4 lg:gap-2 xl:gap-4">
//           <div className="flex flex-col gap-2">
//             <Label className="text-xs xl:text-sm">Telefone</Label>
//             <DropdownMenu open={isPhoneOpen} onOpenChange={setIsPhoneOpen}>
//               <DropdownMenuTrigger asChild>
//                 <button className="flex w-full items-center justify-between rounded-md bg-primary/20 p-2 text-xs text-primary lg:p-1 xl:p-2 xl:text-sm">
//                   {selectedChat?.instanceId
//                     ? whatsAppInstanceList.find(
//                         (instance) => instance.id === selectedChat.instanceId,
//                       )?.phoneNumber
//                     : "Todos os Números"}
//                   <ChevronDown className="h-4 w-4" />
//                 </button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent className="z-[1003] w-40 p-0">
//                 <Command
//                   filter={(value, search) => {
//                     if (
//                       value
//                         .toLowerCase()
//                         .normalize("NFD")
//                         .replace(/[\u0300-\u036f]/g, "")
//                         .includes(search.toLowerCase())
//                     )
//                       return 1;
//                     return 0;
//                   }}
//                 >
//                   <CommandInput
//                     className="text-xs xl:text-sm"
//                     placeholder="Pesquisar..."
//                   />
//                   <CommandEmpty>Não encontrado.</CommandEmpty>
//                   <CommandGroup>
//                     <ScrollArea
//                       className={cn(
//                         "",
//                         whatsAppInstanceList.length >= 5 ? "h-60" : "h-auto",
//                       )}
//                     >
//                       <CommandItem
//                         key={"all"}
//                         onSelect={(e) => {
//                           handleChangeClientInstance(null);
//                           setIsPhoneOpen(false);
//                         }}
//                         className={cn(
//                           "flex w-full items-center justify-center gap-3 truncate border-y p-1 text-xs transition duration-200 hover:bg-primary/20 hover:text-primary xl:text-sm",
//                           !selectedChat?.instanceId
//                             ? "bg-primary/20 text-primary"
//                             : "",
//                         )}
//                       >
//                         Todos os Números
//                       </CommandItem>
//                       {whatsAppInstanceList
//                         .sort((a, b) =>
//                           a.phoneNumber.localeCompare(b.phoneNumber),
//                         )
//                         ?.map((instance) => (
//                           <CommandItem
//                             key={instance.id}
//                             onSelect={(e) => {
//                               handleChangeClientInstance(instance.id);
//                             }}
//                             className={cn(
//                               "flex w-full items-center justify-center gap-3 truncate border-y p-1 text-xs transition duration-200 hover:bg-primary/20 hover:text-primary xl:text-sm",
//                               selectedChat?.instanceId &&
//                                 instance.id === selectedChat.instanceId
//                                 ? "bg-primary/20 text-primary"
//                                 : "",
//                             )}
//                           >
//                             {instance.phoneNumber}
//                           </CommandItem>
//                         ))}
//                     </ScrollArea>
//                   </CommandGroup>
//                 </Command>
//               </DropdownMenuContent>
//             </DropdownMenu>
//           </div>
//           <div className="flex flex-col gap-2">
//             <Label className="text-xs xl:text-sm">Responsável</Label>
//             <DropdownMenu
//               open={isUserPopoverOpen}
//               onOpenChange={setIsUserPopoverOpen}
//             >
//               <DropdownMenuTrigger asChild>
//                 <button className="flex w-full items-center justify-between rounded-md bg-primary/20 p-2 text-xs text-primary lg:p-1 xl:p-2 xl:text-sm">
//                   {selectedChat?.userId
//                     ? userList.find((user) => user.id === selectedChat.userId)
//                         ?.name
//                     : "Selecione o responsável"}
//                   <ChevronDown className="h-4 w-4" />
//                 </button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent className="z-[1003] w-40 p-0">
//                 <Command
//                   filter={(value, search) => {
//                     if (
//                       value
//                         .toLowerCase()
//                         .normalize("NFD")
//                         .replace(/[\u0300-\u036f]/g, "")
//                         .includes(search.toLowerCase())
//                     )
//                       return 1;
//                     return 0;
//                   }}
//                 >
//                   <CommandInput
//                     className="text-xs xl:text-sm"
//                     placeholder="Pesquisar..."
//                   />
//                   <CommandEmpty>Não encontrado.</CommandEmpty>
//                   <CommandGroup>
//                     <ScrollArea
//                       className={cn(
//                         "",
//                         userList.length >= 5 ? "h-60" : "h-auto",
//                       )}
//                     >
//                       {userList
//                         .sort((a, b) => a.name.localeCompare(b.name))
//                         ?.map((user) => (
//                           <CommandItem
//                             key={user.id}
//                             onSelect={(e) => {
//                               handleChangeClientUser(user.id);
//                             }}
//                             className={cn(
//                               "flex w-full items-center justify-center gap-3 truncate border-y p-1 text-xs transition duration-200 hover:bg-primary/20 hover:text-primary xl:text-sm",
//                               selectedChat?.userId &&
//                                 user.id === selectedChat.userId
//                                 ? "bg-primary/20 text-primary"
//                                 : "",
//                             )}
//                           >
//                             {user.name}
//                           </CommandItem>
//                         ))}
//                     </ScrollArea>
//                   </CommandGroup>
//                 </Command>
//               </DropdownMenuContent>
//             </DropdownMenu>
//           </div>
//           <div className="flex w-full items-center justify-between text-xs">
//             <div className="flex w-full items-center justify-between gap-2">
//               <div className="flex items-center gap-2">
//                 <Popover
//                   open={isFollowUpPopoverOpen}
//                   onOpenChange={setIsFollowUpPopoverOpen}
//                 >
//                   <PopoverTrigger asChild>
//                     <button className="flex items-center justify-center rounded bg-primary/20 p-1 transition duration-100 hover:-translate-y-0.5 hover:scale-[1.05]">
//                       <Icon
//                         icon="heroicons:calendar"
//                         className="h-2.5 w-2.5 text-primary xl:h-3.5 xl:w-3.5"
//                       />
//                     </button>
//                   </PopoverTrigger>
//                   <PopoverContent className="p-0">
//                     <PopoverArrow className="w-3 fill-primary" />
//                     <Calendar
//                       mode="single"
//                       selected={
//                         new Date(
//                           selectedChat?.nextFollowupDate
//                             ? selectedChat?.nextFollowupDate
//                             : new Date(),
//                         )
//                       }
//                       onSelect={(date) => {
//                         if (selectedChat) {
//                           handleChangeClientFollowupDate(date!.toISOString());
//                           setIsFollowUpPopoverOpen(false);
//                         }
//                       }}
//                       initialFocus
//                     />
//                   </PopoverContent>
//                 </Popover>
//                 <span className="text-[10px] xl:text-xs">Próximo Contato:</span>
//                 <span
//                   className={twMerge(
//                     selectedChat?.nextFollowupDate
//                       ? "font-semibold text-black"
//                       : "italic",
//                     "text-[10px] xl:text-xs",
//                   )}
//                 >
//                   {selectedChat?.nextFollowupDate
//                     ? new Date(
//                         selectedChat?.nextFollowupDate,
//                       ).toLocaleDateString("pt-BR", {
//                         month: "numeric",
//                         day: "numeric",
//                       })
//                     : "Não Informado"}
//                 </span>
//               </div>
//               {selectedChat?.nextFollowupDate && (
//                 <button
//                   onClick={() => {
//                     if (confirm("Tem certeza que deseja confirmar?")) {
//                       handleChangeClientFollowupDate(null);
//                     }
//                   }}
//                   className="flex items-center justify-center self-end rounded bg-primary/20 p-1 transition duration-100 hover:-translate-y-0.5 hover:scale-[1.05]"
//                 >
//                   <CheckCheck size={16} className="text-primary" />
//                 </button>
//               )}
//             </div>
//           </div>
//           <div>
//             <Popover
//               open={isServicePopoverOpen}
//               onOpenChange={setIsServicePopoverOpen}
//             >
//               <span className="text-xs xl:text-sm">Funil atual do Cliente</span>
//               <PopoverTrigger asChild>
//                 <button className="flex w-full items-center justify-between rounded-md bg-primary/20 p-2 text-xs text-primary lg:p-1 xl:p-2 xl:text-sm">
//                   {serviceList
//                     ? serviceList.find((s) => s.id === serviceId)
//                       ? serviceList.find((s) => s.id === serviceId)?.name
//                       : "Selecione um Serviço"
//                     : "Carregando..."}
//                   <ChevronDown size={16} />
//                 </button>
//               </PopoverTrigger>
//               <PopoverContent align="center" className="w-40 p-0">
//                 <PopoverArrow className="w-3 fill-primary" />
//                 <Command
//                   filter={(value, search) => {
//                     if (
//                       value
//                         .toLowerCase()
//                         .normalize("NFD")
//                         .replace(/[\u0300-\u036f]/g, "")
//                         .includes(search.toLowerCase())
//                     )
//                       return 1;
//                     return 0;
//                   }}
//                 >
//                   <CommandInput
//                     className="text-xs xl:text-sm"
//                     placeholder="Pesquisar..."
//                   />
//                   <CommandEmpty>Não encontrado.</CommandEmpty>
//                   <CommandGroup>
//                     <ScrollArea
//                       className={cn(
//                         "",
//                         serviceList.length >= 5 ? "h-60" : "h-auto",
//                       )}
//                     >
//                       {serviceList.map((item, index) => (
//                         <CommandItem
//                           key={index}
//                           value={item.name}
//                           onSelect={() => {
//                             setIsServicePopoverOpen(false);
//                             setServiceId(item.id);
//                           }}
//                           className="flex w-full items-center justify-between text-xs text-default-600 xl:text-sm"
//                         >
//                           {item.name}
//                           <Check
//                             className={cn("mr-2 h-4 w-4", {
//                               hidden: item.id !== serviceId,
//                             })}
//                           />
//                         </CommandItem>
//                       ))}
//                     </ScrollArea>
//                   </CommandGroup>
//                 </Command>
//               </PopoverContent>
//             </Popover>
//           </div>
//           <div>
//             <Popover
//               open={isBoardPopoverOpen}
//               onOpenChange={setIsBoardPopoverOpen}
//             >
//               <span className="text-xs xl:text-sm">Fase atual do Cliente</span>
//               <PopoverTrigger asChild>
//                 <button className="flex w-full items-center justify-between rounded-md bg-primary/20 p-2 text-xs text-primary lg:p-1 xl:p-2 xl:text-sm">
//                   {boardId
//                     ? boardList.find((s) => s.id === boardId)
//                       ? boardList.find((s) => s.id === boardId)?.name
//                       : "Selecione uma Fase"
//                     : "Carregando..."}
//                   <ChevronDown size={16} />
//                 </button>
//               </PopoverTrigger>
//               <PopoverContent align="center" className="w-40 p-0">
//                 <PopoverArrow className="w-3 fill-primary" />

//                 <Command
//                   filter={(value, search) => {
//                     if (
//                       value
//                         .toLowerCase()
//                         .normalize("NFD")
//                         .replace(/[\u0300-\u036f]/g, "")
//                         .includes(search.toLowerCase())
//                     )
//                       return 1;
//                     return 0;
//                   }}
//                 >
//                   <CommandInput
//                     className="text-xs xl:text-sm"
//                     placeholder="Pesquisar..."
//                   />
//                   <CommandEmpty className="text-center text-xs xl:text-sm">
//                     Não encontrado.
//                   </CommandEmpty>
//                   <CommandGroup>
//                     <ScrollArea
//                       className={cn(
//                         "",
//                         boardList
//                           .filter((board) => board.serviceId === serviceId)
//                           .sort((a, b) => a.position - b.position).length >= 5
//                           ? "h-60"
//                           : "h-auto",
//                       )}
//                     >
//                       {boardList
//                         .filter((board) => board.serviceId === serviceId)
//                         .sort((a, b) => a.position - b.position)
//                         .map((item, index) => (
//                           <CommandItem
//                             key={index}
//                             value={item.name}
//                             onSelect={() => {
//                               handleChangeClientBoard(item.id);
//                               setIsBoardPopoverOpen(false);
//                             }}
//                             className="flex w-full items-center justify-between text-xs text-default-600 xl:text-sm"
//                           >
//                             {item.name}
//                             <Check
//                               className={cn("mr-2 h-4 w-4", {
//                                 hidden: item.id !== boardId,
//                               })}
//                             />
//                           </CommandItem>
//                         ))}
//                     </ScrollArea>
//                   </CommandGroup>
//                 </Command>
//               </PopoverContent>
//             </Popover>
//           </div>
//         </div>
//       </AccordionContent>
//     </AccordionItem>
//   );
// }
