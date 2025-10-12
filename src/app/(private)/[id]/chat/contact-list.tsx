"use client";
import { ChatProps } from "@/@types/global";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useChatContext } from "@/context/chatContext";
import { cn } from "@/lib/utils";
import moment from "moment";
import "moment/locale/pt-br";
moment.locale("pt-br");

const ContactList = ({
  contact,
  openChat,
}: {
  contact: ChatProps;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  openChat: (id: any) => void;
}) => {
  const { id, model, lastMessage } = contact;
  const { selectedChatId } = useChatContext();

  return (
    <div
      className={cn(
        "flex cursor-pointer border-l-2 border-transparent px-3 py-2 transition duration-150 hover:bg-[#ff0080]/20 lg:max-w-[250px] lg:min-w-[250px] lg:gap-2 lg:px-2 lg:py-1 xl:max-w-[350px] xl:min-w-[350px] xl:gap-4 xl:px-3 xl:py-2",
        selectedChatId === id && "bg-[#ff0080]/20",
        // {
        //   "lg:border-primary/70 lg:bg-default-200":
        //     id === (selectedChatId as any),
        // },
      )}
      onClick={() => openChat(id)}
    >
      <div className="flex flex-1 items-center gap-2 xl:gap-3">
        <div className="relative inline-block lg:h-6 lg:w-6 xl:h-10 xl:w-10">
          <Avatar className="lg:h-6 lg:w-6 xl:h-10 xl:w-10">
            {model.photoUrl && (
              <AvatarImage className="object-cover" src={model.photoUrl} />
            )}
            <AvatarFallback className="uppercase">
              {model.name.slice(0, 2)}
            </AvatarFallback>
          </Avatar>
        </div>
        <div>
          <div className="max-w-[80px] truncate xl:max-w-[120px]">
            <span className="text-default-900 font-medium lg:text-[9px] xl:text-sm">
              {model.name}
            </span>
          </div>
          <div className="max-w-[80px] truncate lg:-mt-2 xl:mt-0 xl:max-w-[120px]">
            <span className="text-default-600 text-[9px] xl:text-xs">
              {lastMessage}
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-none flex-col items-end xl:gap-2">
        {/* {selectedChatId === id ? (
          <>
            <button
              onClick={(e) => {
                handleCloseChat();
                e.stopPropagation();
              }}
            >
              <X className="h-4 w-4 text-red-500" />
            </button>
          </>
        ) : (
          <span
            className={cn(
              "text-default-600 text-end uppercase lg:text-[9px] xl:text-xs",
              !lastContactDate && "opacity-0",
            )}
          >
            {(lastContactDate &&
              moment(lastContactDate).isAfter(moment("2000-01-01")) &&
              moment(lastContactDate).fromNow()) ||
              " -"}
          </span>
        )} */}
      </div>
    </div>
  );
};

export default ContactList;
