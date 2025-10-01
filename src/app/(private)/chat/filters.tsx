// "use client";

// import { customMultiValueWithoutColorStyles } from "@/src/components/ui/SelectStyles";
// import { Button, buttonVariants } from "@/src/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/src/components/ui/dropdown-menu";
// import { ScrollArea } from "@/src/components/ui/scroll-area";
// import { Sheet, SheetContent } from "@/src/components/ui/sheet";
// import { useChatContext } from "@/src/context/chatContext";
// import { useGlobalContext } from "@/src/context/globalContext";
// import { userType } from "@/src/lib/axios";
// import { cn } from "@/src/lib/utils";
// import { ptBR } from "date-fns/locale";
// import {
//   ChevronDown,
//   ChevronLeft,
//   ChevronRight,
//   ChevronUp,
//   Settings,
// } from "lucide-react";
// import moment from "moment";
// import { useCookies } from "next-client-cookies";
// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
// import { DateRange, DayPicker } from "react-day-picker";
// import Select from "react-select";

// interface LocalFilterProps {
//   users: string[];
//   boards: string[];
//   services: string[];
//   subServices: string[];
//   instances: string[];
//   sortBy: "FIRST_CONTACT" | "NEXT_CONTACT" | "LAST_CONTACT";
//   sort: "ASC" | "DESC";
//   messageReadFilter: "ALL" | "READ" | "UNREAD";
//   endDate: Date | null;
//   startDate: Date | null;
// }

// interface Props {
//   isOpen: boolean;
//   setIsOpen: (isOpen: boolean) => void;
// }

// export function ChatFilters({ isOpen, setIsOpen }: Props) {
//   const cookies = useCookies();
//   const router = useRouter();
//   const { userList, whatsAppInstanceList, boardList, serviceList } =
//     useGlobalContext();
//   const {
//     setUsers,
//     setSortBy,
//     setSort,
//     setBoards,
//     setServices,
//     setSubServices,
//     setMessageReadFilter,
//     setEndDate,
//     setStartDate,
//     setSelectedChat,
//     instances,
//     setInstances,
//     setSelectedChatId,
//   } = useChatContext();
//   const { subservices } = useGlobalContext();
//   const [dateFilter, setDateFilter] = useState<"today" | "week" | "month" | "">(
//     "",
//   );

//   const [localFilters, setLocalFilters] = useState<LocalFilterProps>({
//     users: [],
//     boards: [],
//     services: [],
//     subServices: [],
//     instances: [],
//     sortBy: "LAST_CONTACT",
//     sort: "DESC",
//     messageReadFilter: "ALL",
//     endDate: null,
//     startDate: null,
//   });

//   const ResetFilters = () => {
//     if (cookies.get(userType) !== "lawyer") {
//       setUsers([]);
//     }

//     setBoards([]);
//     setServices([]);
//     setSubServices([]);
//     setSort("DESC");
//     setSortBy("LAST_CONTACT");
//     setMessageReadFilter("ALL");
//     setEndDate(null);
//     setStartDate(null);
//     setLocalFilters({
//       users: [],
//       boards: [],
//       services: [],
//       subServices: [],
//       instances: [],
//       sortBy: "LAST_CONTACT",
//       sort: "DESC",
//       messageReadFilter: "ALL",
//       endDate: null,
//       startDate: null,
//     });
//   };

//   useEffect(() => {
//     if (cookies.get(userType) === "lawyer") {
//       const user = userList.find((u) => u.isYou);
//       if (user) {
//         setUsers([user?.id]);
//       }
//     }
//   }, [userList]);

//   function handleApplyFilter() {
//     setUsers(localFilters.users);
//     setBoards(localFilters.boards);
//     setServices(localFilters.services);
//     setSubServices(localFilters.subServices);
//     setSortBy(localFilters.sortBy);
//     setSort(localFilters.sort);
//     setMessageReadFilter(localFilters.messageReadFilter);
//     setEndDate(localFilters.endDate);
//     setStartDate(localFilters.startDate);
//     setInstances(localFilters.instances);
//     setIsOpen(false);
//     setSelectedChat(null);
//     router.replace("/chat");
//     setSelectedChatId(null);
//   }

//   return (
//     <div>
//       <Sheet open={isOpen} onOpenChange={setIsOpen}>
//         <SheetContent side={"left"} className="px-0">
//           <ScrollArea className="relative h-[calc(100vh-30px)] px-4 xl:h-screen">
//             <div className="mb-8 flex w-full items-center justify-between p-3 lg:mb-4 xl:mb-8">
//               <div className="flex items-center gap-2">
//                 <span className="font-bold lg:text-base xl:text-xl">
//                   Filtros
//                 </span>
//                 <Settings className="h-4 w-4 xl:h-6 xl:w-6" />
//               </div>
//               <Button onClick={ResetFilters} size="default" variant="outline">
//                 Limpar Filtros
//               </Button>
//             </div>
//             {cookies.get(userType) !== "lawyer" && (
//               <Select
//                 name="tags"
//                 options={userList.map((u) => ({ value: u.id, label: u.name }))}
//                 isMulti
//                 onChange={(e) => {
//                   setLocalFilters((prev) => ({
//                     ...prev,
//                     users: e.map((u) => u.value),
//                   }));
//                 }}
//                 value={userList
//                   .filter((u) => localFilters.users.includes(u.id))
//                   .map((u) => ({ value: u.id, label: u.name }))}
//                 styles={customMultiValueWithoutColorStyles}
//                 placeholder="Filtrar por Usuários"
//               />
//             )}
//             <div className="mt-6 flex gap-4 lg:mt-2 lg:gap-2 xl:mt-6 xl:gap-4">
//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <button className="flex w-full items-center justify-between rounded bg-primary/10 p-2">
//                     <span>
//                       {localFilters.sortBy === "FIRST_CONTACT"
//                         ? "Primeiro contato"
//                         : localFilters.sortBy === "NEXT_CONTACT"
//                           ? "Próximo contato"
//                           : localFilters.sortBy === "LAST_CONTACT"
//                             ? "Ultimo contato"
//                             : "Mensagem"}
//                     </span>
//                     <ChevronDown className="ml-2 h-4 w-4" />
//                   </button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent
//                   className="z-[99999] w-[250px]"
//                   align="end"
//                   avoidCollisions
//                 >
//                   <DropdownMenuLabel>Ordenar por</DropdownMenuLabel>
//                   <DropdownMenuSeparator />
//                   <DropdownMenuItem
//                     className={cn(
//                       "focus:bg-primary/10 focus:text-primary",
//                       localFilters.sortBy === "FIRST_CONTACT" &&
//                         "bg-primary/20",
//                     )}
//                     onClick={() =>
//                       setLocalFilters((prev) => ({
//                         ...prev,
//                         sortBy: "FIRST_CONTACT",
//                       }))
//                     }
//                   >
//                     Primeiro contato
//                   </DropdownMenuItem>
//                   <DropdownMenuItem
//                     className={cn(
//                       "focus:bg-primary/10 focus:text-primary",
//                       localFilters.sortBy === "NEXT_CONTACT" && "bg-primary/20",
//                     )}
//                     onClick={() =>
//                       setLocalFilters((prev) => ({
//                         ...prev,
//                         sortBy: "NEXT_CONTACT",
//                       }))
//                     }
//                   >
//                     Próximo contato
//                   </DropdownMenuItem>
//                   <DropdownMenuItem
//                     className={cn(
//                       "focus:bg-primary/10 focus:text-primary",
//                       localFilters.sortBy === "LAST_CONTACT" && "bg-primary/20",
//                     )}
//                     onClick={() =>
//                       setLocalFilters((prev) => ({
//                         ...prev,
//                         sortBy: "LAST_CONTACT",
//                       }))
//                     }
//                   >
//                     Ultimo contato
//                   </DropdownMenuItem>
//                 </DropdownMenuContent>
//               </DropdownMenu>
//               <button
//                 onClick={() =>
//                   setLocalFilters((prev) => ({
//                     ...prev,
//                     sort: prev.sort === "ASC" ? "DESC" : "ASC",
//                   }))
//                 }
//                 className="flex h-full w-full rounded border-2 border-primary bg-white p-2 transition duration-100 hover:bg-primary hover:text-white"
//               >
//                 {localFilters.sort === "ASC" ? (
//                   <span className="flex w-full items-center justify-between">
//                     Mais Antigo
//                     <ChevronUp className="h-5 w-5" />
//                   </span>
//                 ) : (
//                   <span className="flex w-full items-center justify-between">
//                     Mais Recente
//                     <ChevronDown className="h-5 w-5" />
//                   </span>
//                 )}
//               </button>
//             </div>

//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <button className="mt-6 flex w-full items-center justify-between rounded bg-primary/10 p-2 lg:mt-2 xl:mt-6">
//                   {localFilters.messageReadFilter === "ALL"
//                     ? "Filtrar por Status (Todas)"
//                     : localFilters.messageReadFilter === "UNREAD"
//                       ? "Filtrar por Status (Nao Lida)"
//                       : "Filtrar por Status (Lida)"}
//                   <ChevronDown className="ml-2 h-4 w-4" />
//                 </button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent
//                 className="z-[99999] w-[250px]"
//                 align="end"
//                 avoidCollisions
//               >
//                 <DropdownMenuLabel>Status</DropdownMenuLabel>
//                 <DropdownMenuSeparator />

//                 <DropdownMenuItem
//                   className={cn(
//                     "focus:bg-primary/10 focus:text-primary",
//                     localFilters.messageReadFilter === "ALL" && "bg-primary/20",
//                   )}
//                   onClick={() =>
//                     setLocalFilters((prev) => ({
//                       ...prev,
//                       messageReadFilter: "ALL",
//                     }))
//                   }
//                 >
//                   Todas as Mensagens
//                 </DropdownMenuItem>
//                 <DropdownMenuItem
//                   className={cn(
//                     "focus:bg-primary/10 focus:text-primary",
//                     localFilters.messageReadFilter === "READ" &&
//                       "bg-primary/20",
//                   )}
//                   onClick={() =>
//                     setLocalFilters((prev) => ({
//                       ...prev,
//                       messageReadFilter: "READ",
//                     }))
//                   }
//                 >
//                   Apenas Mensagens Lidas
//                 </DropdownMenuItem>
//                 <DropdownMenuItem
//                   className={cn(
//                     "focus:bg-primary/10 focus:text-primary",
//                     localFilters.messageReadFilter === "UNREAD" &&
//                       "bg-primary/20",
//                   )}
//                   onClick={() =>
//                     setLocalFilters((prev) => ({
//                       ...prev,
//                       messageReadFilter: "UNREAD",
//                     }))
//                   }
//                 >
//                   Apenas Mensagens Não Lidas
//                 </DropdownMenuItem>
//               </DropdownMenuContent>
//             </DropdownMenu>
//             <div className="mt-6">
//               <Select
//                 name="tags"
//                 options={whatsAppInstanceList.map((u) => ({
//                   value: u.id,
//                   label: u.phoneNumber,
//                 }))}
//                 isMulti
//                 onChange={(e) => {
//                   setLocalFilters((prev) => ({
//                     ...prev,
//                     instances: e.map((u) => u.value),
//                   }));
//                 }}
//                 value={whatsAppInstanceList
//                   .filter((u) => localFilters.instances.includes(u.id))
//                   .map((u) => ({ value: u.id, label: u.phoneNumber }))}
//                 styles={customMultiValueWithoutColorStyles}
//                 placeholder="Filtrar por WhatsApp"
//               />
//             </div>
//             <div className="mt-6">
//               <Select
//                 name="tags"
//                 options={serviceList.map((u) => ({
//                   value: u.id,
//                   label: u.name,
//                 }))}
//                 isMulti
//                 onChange={(e) => {
//                   setLocalFilters((prev) => ({
//                     ...prev,
//                     services: e.map((u) => u.value),
//                   }));
//                 }}
//                 value={serviceList
//                   .filter((u) => localFilters.services.includes(u.id))
//                   .map((u) => ({ value: u.id, label: u.name }))}
//                 styles={customMultiValueWithoutColorStyles}
//                 placeholder="Filtrar por Funil"
//               />
//             </div>
//             <div className="mt-6">
//               <Select
//                 name="tags"
//                 options={boardList
//                   .filter((u) => localFilters.services.includes(u.serviceId))
//                   .sort((a, b) => a.position - b.position)
//                   .map((u) => ({ value: u.id, label: u.name }))}
//                 isMulti
//                 onChange={(e) => {
//                   setLocalFilters((prev) => ({
//                     ...prev,
//                     boards: e.map((u) => u.value),
//                   }));
//                 }}
//                 value={boardList
//                   .filter((u) => localFilters.boards.includes(u.id))
//                   .sort((a, b) => a.position - b.position)
//                   .map((u) => ({ value: u.id, label: u.name }))}
//                 styles={customMultiValueWithoutColorStyles}
//                 placeholder="Filtrar por Fases"
//                 noOptionsMessage={() => "Selecione um Funil"}
//               />
//             </div>

//             <div className="mt-6">
//               <Select
//                 name="tags"
//                 options={subservices.map((u) => ({
//                   value: u.id,
//                   label: u.name,
//                 }))}
//                 isMulti
//                 onChange={(e) => {
//                   setLocalFilters((prev) => ({
//                     ...prev,
//                     subServices: e.map((u) => u.value),
//                   }));
//                 }}
//                 value={subservices
//                   .filter((u) => localFilters.subServices.includes(u.id))
//                   .map((u) => ({ value: u.id, label: u.name }))}
//                 styles={customMultiValueWithoutColorStyles}
//                 placeholder="Filtrar por Sub Serviços"
//                 noOptionsMessage={() => ""}
//               />
//             </div>

//             <div className="mt-4 flex w-full justify-between lg:mt-2 xl:mt-4">
//               <button
//                 onClick={() => {
//                   setLocalFilters((prev) => ({
//                     ...prev,
//                     startDate: moment().startOf("day").toDate(),
//                     endDate: moment().endOf("day").toDate(),
//                   }));
//                 }}
//                 className={cn(
//                   "rounded border-2 border-primary px-2 py-1 transition duration-100 hover:bg-primary hover:text-white",
//                   dateFilter === "today" &&
//                     "bg-primary text-white hover:border hover:border-primary hover:bg-transparent hover:text-primary",
//                 )}
//               >
//                 Hoje
//               </button>
//               <button
//                 onClick={() => {
//                   setLocalFilters((prev) => ({
//                     ...prev,
//                     startDate: moment()
//                       .subtract(1, "week")
//                       .startOf("day")
//                       .toDate(),
//                     endDate: moment().endOf("day").toDate(),
//                   }));
//                 }}
//                 className={cn(
//                   "rounded border-2 border-primary px-2 py-1 transition duration-100 hover:bg-primary hover:text-white",
//                   dateFilter === "week" &&
//                     "bg-primary text-white hover:border-primary hover:bg-transparent",
//                 )}
//               >
//                 Últimos 7 dias
//               </button>
//               <button
//                 onClick={() => {
//                   setLocalFilters((prev) => ({
//                     ...prev,
//                     startDate: moment()
//                       .subtract(1, "month")
//                       .startOf("day")
//                       .toDate(),
//                     endDate: moment().endOf("day").toDate(),
//                   }));
//                 }}
//                 className={cn(
//                   "rounded border-2 border-primary px-2 py-1 transition duration-100 hover:bg-primary hover:text-white",
//                   dateFilter === "month" &&
//                     "hover:border hover:border-primary hover:bg-transparent",
//                 )}
//               >
//                 Últimos 30 dias
//               </button>
//             </div>

//             <div className="flex w-full flex-col items-center justify-center pt-4">
//               <DayPicker
//                 mode="range"
//                 locale={ptBR}
//                 showOutsideDays={true}
//                 components={{
//                   IconLeft: ({ ...props }) => (
//                     <ChevronLeft className="h-4 w-4" />
//                   ),
//                   IconRight: ({ ...props }) => (
//                     <ChevronRight className="h-4 w-4" />
//                   ),
//                 }}
//                 classNames={{
//                   months: "w-full  space-y-4 sm:space-x-4 sm:space-y-0",
//                   month: "space-y-4",
//                   caption: "flex justify-center pt-1 relative items-center",
//                   caption_label: "text-sm font-medium",
//                   nav: "space-x-1 flex items-center",
//                   nav_button: cn(
//                     buttonVariants({ variant: "outline" }),
//                     "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
//                   ),
//                   nav_button_previous: "absolute left-2",
//                   nav_button_next: "absolute right-2",
//                   table: "w-full border-collapse space-y-1",
//                   head_row: "flex",
//                   head_cell:
//                     "flex-1 text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
//                   row: "flex w-full gap-1 mt-2",
//                   cell: "flex-1 text-center text-sm p-0 relative [&:has([aria-selected])]:bg-primary [&:has([aria-selected])]:rounded-md focus-within:relative focus-within:z-20",

//                   // first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md

//                   day: "w-full h-10 rounded  p-0 font-normal aria-selected:opacity-100 bg-transparent text-current hover:text-primary",

//                   day_selected:
//                     "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
//                   day_today: "bg-accent text-accent-foreground",
//                   day_outside: "text-muted-foreground opacity-50",
//                   day_disabled: "text-muted-foreground opacity-50",
//                   day_range_middle:
//                     "aria-selected:bg-accent aria-selected:text-accent-foreground",
//                   day_hidden: "invisible",
//                 }}
//                 selected={{
//                   from: localFilters.startDate as Date,
//                   to: localFilters.endDate as Date,
//                 }}
//                 onSelect={(range: DateRange | undefined) => {
//                   if (range) {
//                     setLocalFilters((prev) => ({
//                       ...prev,
//                       startDate: range.from as Date,
//                       endDate: range.to as Date,
//                     }));
//                     setDateFilter("");
//                   }
//                 }}
//               />
//               <Button
//                 className="mt-2"
//                 onClick={() => {
//                   setDateFilter("");
//                   setLocalFilters((prev) => ({
//                     ...prev,
//                     startDate: null,
//                     endDate: null,
//                   }));
//                 }}
//               >
//                 Limpar Filtro de datas
//               </Button>
//             </div>
//             <div className="h-32 w-full"></div>
//             <Button
//               onClick={handleApplyFilter}
//               className="absolute bottom-10 left-[50%] right-[50%] h-10 w-32 -translate-x-[50%]"
//             >
//               Aplicar Filtros
//             </Button>
//           </ScrollArea>
//         </SheetContent>
//       </Sheet>
//     </div>
//   );
// }
