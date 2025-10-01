import { MessageProps } from "@/@types/global";
import { useChatContext } from "@/context/chatContext";
import { ArrowLeft, CheckCheck, Download } from "lucide-react";
import { useCookies } from "next-client-cookies";
import Image from "next/image";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import remarkGfm from "remark-gfm";
import { twMerge } from "tailwind-merge";
import { AudioPlayer } from "./AudioPlayer";

interface Props {
  message: MessageProps;
  className?: string;
}
const Messages = ({ message, className }: Props) => {
  const cookies = useCookies();
  const {
    text,
    entity,
    audioUrl,
    fileUrl,
    chatId,
    createdAt,
    isMessageOpen,
    messageType,
    imageUrl,
    videoUrl,
  } = message;
  const [openImageModal, setOpenImageModal] = useState(false);
  const { selectedChat } = useChatContext();
  const [routeModal, setRouteModal] = useState(false);

  const cleanedText = text.replace(/ {2,}/g, " ");
  return (
    <div className="">
      {entity !== "USER" ? (
        <>
          <div className="group mb-4 ml-[50px] flex max-w-[calc(100%-50px)] items-start justify-end space-x-2 lg:mb-2 xl:mb-4 rtl:space-x-reverse">
            <div className="flex flex-col items-end gap-1">
              <div className="flex w-full items-center justify-end gap-2 text-end lg:text-[8px] xl:text-xs">
                <span className="text-default-500">
                  {new Date(createdAt).toLocaleDateString("pt-BR", {
                    day: "numeric",
                    month: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                  })}
                </span>
                <span></span>
                <div className="rounded-full lg:h-5 lg:w-5 xl:h-8 xl:w-8">
                  {/* <Image
                    src={
                      entity === "ai"
                        ? "/images/avatar/ia.png"
                        : "/images/avatar/user-chat.png"
                    }
                    alt=""
                    width={64}
                    height={64}
                    className="block h-full w-full rounded-full object-cover"
                  /> */}
                </div>
              </div>
              <div className="flex items-center gap-1">
                {fileUrl ? (
                  <div className="relative z-[1] break-normal whitespace-pre-wrap">
                    <div
                      className={twMerge(
                        "bg-primary flex items-center gap-2 rounded-md rounded-tr-none px-3 py-2 text-sm text-white lg:px-2 lg:py-1 lg:text-xs xl:px-3 xl:py-2 xl:text-sm",
                      )}
                    >
                      <span
                        className={twMerge(
                          "bg-primary text-primary-foreground rounded-md rounded-tr-none px-3 py-2 whitespace-pre-line lg:px-2 lg:py-1 lg:text-[10px] xl:px-3 xl:py-2 xl:text-sm",
                          className,
                        )}
                      >
                        {text} -
                      </span>
                      <button
                        onClick={() =>
                          fileUrl && window.open(fileUrl, "_blank")
                        }
                        className="hover:text-primary flex items-center justify-center rounded border border-white p-1 text-white transition duration-200 hover:bg-white"
                      >
                        <Download size={12} />
                      </button>
                    </div>
                  </div>
                ) : imageUrl ? (
                  <div className="relative z-[1] break-normal whitespace-pre-wrap">
                    <div
                      className={twMerge(
                        "bg-primary flex flex-col items-center gap-2 rounded-md rounded-tr-none px-3 py-2 text-sm text-white lg:px-2 lg:py-1 lg:text-xs xl:px-3 xl:py-2 xl:text-sm",
                      )}
                    >
                      <Image
                        src={imageUrl}
                        alt=""
                        width={200}
                        height={200}
                        className="w-full cursor-pointer rounded-md"
                        onClick={() => setOpenImageModal(true)}
                      />
                      <span
                        className={twMerge(
                          "bg-primary text-primary-foreground rounded-md rounded-tr-none px-3 py-2 whitespace-pre-line lg:px-2 lg:py-1 lg:text-[10px] xl:px-3 xl:py-2 xl:text-sm",
                          className,
                        )}
                      >
                        {text}
                      </span>
                    </div>
                  </div>
                ) : audioUrl ? (
                  <div className="relative z-[1] break-normal whitespace-pre-wrap">
                    <div
                      className={twMerge(
                        "bg-primary flex-1 rounded-md rounded-tr-none px-3 py-2 text-sm text-white lg:px-2 lg:py-1 lg:text-xs xl:px-3 xl:py-2 xl:text-sm",
                      )}
                    >
                      <AudioPlayer
                        className="ai min-w-full"
                        size="default"
                        audioUrl={audioUrl}
                      />
                      <span
                        className={twMerge(
                          "bg-primary text-primary-foreground rounded-md rounded-tr-none px-3 py-2 whitespace-pre-line lg:px-2 lg:py-1 lg:text-[10px] xl:px-3 xl:text-sm",
                          className,
                        )}
                      >
                        {text}
                      </span>
                    </div>
                  </div>
                ) : (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      a: ({ node, ...props }) => (
                        <a
                          {...props}
                          className="italic"
                          style={{
                            fontWeight: "bold",
                            textDecoration: "underline",
                          }}
                        />
                      ),
                    }}
                    // className={twMerge(
                    //   "bg-primary text-primary-foreground max-w-[calc(100vw-200px)] rounded-md rounded-tr-none px-3 py-2 break-words whitespace-pre-line lg:max-w-[750px] lg:px-2 lg:py-1 lg:text-[10px] xl:max-w-[950px] xl:px-3 xl:py-2 xl:text-sm",
                    //   className,
                    // )}
                  >
                    {text}
                  </ReactMarkdown>
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="group mb-4 flex max-w-[calc(100%-50px)] items-start space-x-2 lg:mb-2 xl:mb-4 rtl:space-x-reverse">
          <div className="flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-1">
              <div className="flex w-full items-center justify-start gap-2 text-xs lg:text-[8px] xl:text-xs">
                <div className="rounded-full lg:h-5 lg:w-5 xl:h-8 xl:w-8">
                  <Image
                    src={(selectedChat && selectedChat.model.photoUrl) || ""}
                    alt=""
                    width={32}
                    height={32}
                    className="block h-full w-full rounded-full object-cover"
                  />
                </div>
                <span>{(selectedChat && selectedChat.model.name) || ""}</span>
                <span className="text-default-500">
                  {new Date(createdAt).toLocaleDateString("pt-BR", {
                    day: "numeric",
                    month: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                  })}
                </span>
                <CheckCheck className="text-primary lg:h-3 lg:w-3 xl:h-5 xl:w-5" />
                <span className="text-default-500 hidden group-hover:block"></span>
              </div>
              <div className="group flex items-center gap-1">
                {audioUrl ? (
                  <div className="relative z-[1] break-normal whitespace-pre-wrap">
                    <div
                      className={twMerge(
                        "flex-1 rounded-md rounded-tl-none bg-[#F3F6F8] px-3 py-2 text-sm lg:px-2 lg:py-1 lg:text-xs xl:px-3 xl:py-2 xl:text-sm",
                      )}
                    >
                      <AudioPlayer
                        size="default"
                        className="min-w-full"
                        audioUrl={audioUrl}
                      />
                      <span
                        className={twMerge(
                          "flex-1 bg-[#F3F6F8] px-3 text-sm lg:px-2 lg:text-[10px] xl:px-3 xl:text-sm",
                          className,
                        )}
                      >
                        {text}
                      </span>
                    </div>
                  </div>
                ) : fileUrl ? (
                  <div className="relative z-[1] break-normal whitespace-pre-wrap">
                    <div
                      className={twMerge(
                        "flex items-center gap-2 rounded-md rounded-tl-none bg-[#F3F6F8] px-3 py-2 text-sm lg:px-2 lg:py-1 lg:text-xs xl:px-3 xl:py-2 xl:text-sm",
                      )}
                    >
                      <span
                        className={twMerge(
                          "flex-1 rounded-md rounded-tl-none bg-[#F3F6F8] px-3 py-2 text-sm break-words lg:px-2 lg:py-1 lg:text-[10px] xl:px-3 xl:py-2 xl:text-sm",
                          className,
                        )}
                      >
                        {text} -
                      </span>
                      <button
                        onClick={() =>
                          fileUrl && window.open(fileUrl, "_blank")
                        }
                        className="border-primary text-primary hover:bg-primary flex items-center justify-center rounded border p-1 transition duration-200 hover:text-white"
                      >
                        <Download size={14} />
                      </button>
                    </div>
                  </div>
                ) : imageUrl ? (
                  <div className="relative z-[1] break-normal whitespace-pre-wrap">
                    <div
                      className={twMerge(
                        "flex w-full flex-col items-center gap-2 rounded-md rounded-tl-none bg-[#F3F6F8] px-3 py-2 text-sm lg:px-2 lg:py-1 lg:text-xs xl:px-3 xl:py-2 xl:text-sm",
                      )}
                    >
                      <Image
                        src={imageUrl}
                        alt=""
                        width={200}
                        height={200}
                        className="w-full cursor-pointer rounded-md"
                        onClick={() => setOpenImageModal(true)}
                      />
                      <span
                        className={twMerge(
                          "flex-1 rounded-md rounded-tl-none bg-[#F3F6F8] px-3 py-2 text-sm break-words lg:px-2 lg:py-1 lg:text-[10px] xl:px-3 xl:py-2 xl:text-sm",
                          className,
                        )}
                      >
                        {text}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="relative z-[1] break-normal whitespace-pre-wrap">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        a: ({ node, ...props }) => (
                          <a
                            {...props}
                            className="inline-block max-w-[calc(100vw-80px)] truncate italic lg:max-w-[550px]"
                            style={{
                              fontWeight: "bold",
                              textDecoration: "underline",
                            }}
                          />
                        ),
                      }}
                      // className={twMerge(
                      //   "max-w-[calc(100vw-200px)] flex-1 rounded-md rounded-tl-none bg-[#F3F6F8] px-3 py-2 text-sm break-words whitespace-pre-line lg:max-w-[750px] lg:px-2 lg:py-1 lg:text-[10px] xl:max-w-[950px] xl:px-3 xl:py-2 xl:text-sm",
                      //   isMessageDeleted && "opacity-50",
                      //   className,
                      // )}
                    >
                      {cleanedText}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {openImageModal && imageUrl && (
        <div
          className="fixed top-0 right-0 bottom-0 left-0 z-[1002] flex w-full items-center justify-center text-center transition-opacity duration-300 ease-in-out"
          style={{ opacity: openImageModal ? 1 : 0 }}
        >
          <button
            onClick={() => setOpenImageModal(false)}
            className="absolute z-40 h-full w-full bg-white/20 backdrop-blur"
          />
          <div className="relative z-50 flex flex-col items-center justify-center">
            <div
              className={twMerge(
                "relative z-20 flex aspect-[9/16] h-[95vh] flex-col items-center justify-center overflow-hidden rounded-md border border-gray-200 bg-white shadow-md",
              )}
            >
              <div className="absolute top-0 z-[9999999] flex h-12 w-full items-center justify-between bg-white/50 p-2 backdrop-blur-sm">
                <button
                  className="flex h-6 w-6 items-center justify-center"
                  onClick={() => setOpenImageModal(false)}
                >
                  <ArrowLeft />
                </button>
                <span className="mx-2 truncate">{text}</span>
                <button
                  onClick={() => window.open(imageUrl, "_blank")}
                  className="flex items-center justify-center rounded border border-black p-1 text-black transition duration-200"
                >
                  <Download size={14} />
                </button>
              </div>
              <TransformWrapper>
                <TransformComponent
                  contentStyle={{
                    width: "100%",
                    height: "100%",
                  }}
                  wrapperStyle={{
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <Image
                    key={imageUrl} // Add this line
                    className="z-[999999] h-full"
                    alt=""
                    src={imageUrl}
                    width={1000}
                    height={1000}
                    style={{
                      objectFit: "contain",
                    }}
                    loading="lazy"
                  />
                </TransformComponent>
              </TransformWrapper>
            </div>
            <div className="absolute right-0 bottom-0 z-10 h-full max-w-[500px] blur-sm" />
          </div>
        </div>
      )}

      {routeModal && (
        <div
          className="fixed top-0 right-0 bottom-0 left-0 z-[1002] flex w-full items-center justify-center text-center transition-opacity duration-300 ease-in-out"
          style={{ opacity: routeModal ? 1 : 0 }}
        >
          <button
            onClick={() => setRouteModal(false)}
            className="absolute z-40 h-full w-full bg-white/20 backdrop-blur"
          />
          <div className="relative z-50 flex flex-col items-center justify-center">
            <div
              className={twMerge(
                "relative z-20 flex aspect-[9/16] h-[95vh] flex-col items-center overflow-hidden rounded-md border border-gray-200 bg-white shadow-md",
              )}
            >
              <div className="flex h-12 w-full items-center justify-between bg-white/50 p-2 backdrop-blur-sm">
                <button
                  className="flex h-6 w-6 items-center justify-center"
                  onClick={() => setRouteModal(false)}
                >
                  <ArrowLeft />
                </button>
              </div>
            </div>
            <div className="absolute right-0 bottom-0 z-10 h-full max-w-[500px] blur-sm" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;
