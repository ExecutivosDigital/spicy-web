/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { MessageProps } from "@/@types/global";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useApiContext } from "@/context/ApiContext";
import { useChatContext } from "@/context/chatContext";
import { cn } from "@/utils/cn";
import { Icon } from "@iconify/react";
import { Loader2, SendHorizontal, Square, X } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import fixWebmDuration from "webm-duration-fix";
import { AudioPlayer } from "./AudioPlayer";

const MessageFooter = ({ onSend }: { onSend: () => void }) => {
  const { PostAPI } = useApiContext();
  const {
    selectedChatId,
    setSelectedChatMessages,
    isPaymentConfirmed,
    userProfile,
  } = useChatContext();

  const [message, setMessage] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [elapsedTime, setElapsedTime] = useState("00:00");
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [recordStartTime, setRecordStartTime] = useState<number | null>(null);
  const [fileType, setFileType] = useState<
    "file" | "audio" | "image" | "video" | null
  >(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null,
  );
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // function notPayed() {
  //   if (!userProfile) {
  //     setCurrent("password");
  //     openSheet();
  //   } else {
  //     setCurrent("plans");
  //     openSheet();
  //   }
  // }

  const handleSendMessage = async (message: string) => {
    // if (!isPaymentConfirmed) return notPayed();
    if (!selectedChatId || !message) return;

    const connect = await PostAPI(
      `/message/${selectedChatId}`,
      {
        text: message,
      },
      true,
    );

    if (connect.status === 200) {
      setSelectedChatMessages((prev: MessageProps[]) => [
        ...prev,
        connect.body.message,
      ]);
      onSend();
      setMessage("");
    }

    if (connect.status !== 200) {
      return alert(connect.body.message);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight - 15}px`;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSendMessage(message);
  };

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const options = { mimeType: "audio/webm;codecs=opus" };
    const recorder = new MediaRecorder(stream, options);
    const chunks: Blob[] = [];

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunks.push(e.data);
      }
    };

    recorder.onstop = async () => {
      const audioBlob = new Blob(chunks, { type: "audio/webm" });

      const fixedBlob = await fixWebmDuration(audioBlob);

      const blobUrl = URL.createObjectURL(fixedBlob);
      setFile(fixedBlob as File);
      setFileType("audio");
      setAudioUrl(blobUrl);
    };

    recorder.start();
    setMediaRecorder(recorder);
    setIsRecording(true);
    setRecordStartTime(Date.now());
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      setTimeout(() => {
        mediaRecorder.stop();
        mediaRecorder.stream.getTracks().forEach((track) => track.stop());
        setIsRecording(false);
        setRecordStartTime(null);
      }, 200);
    }
  };

  async function handleSendFile() {
    // if (!isPaymentConfirmed) return notPayed();
    setIsSendingMessage(true);
    if (file) {
      const uploadFormData = new FormData();

      uploadFormData.append("file", file);

      const fileSend = await PostAPI(
        `/message/${selectedChatId}/file`,
        uploadFormData,
        true,
      );

      if (fileSend.status === 200) {
        setFile(null);
        setMessage("");
        setAudioUrl("");
        setFileType(null);
        setRecordStartTime(null);
        setElapsedTime("00:00");
        setSelectedChatMessages((prev) => [...prev, fileSend.body.message]);
        onSend();
        return setIsSendingMessage(false);
      }
      alert(fileSend.body.message);
      return setIsSendingMessage(false);
    }
  }

  function openChat() {
    setAudioUrl("");
    setFile(null);
    setFileType(null);
    setRecordStartTime(null);
    setElapsedTime("00:00");
  }

  const HandleSend = async () => {
    if (message.length === 0 && !file) {
      if (isRecording) {
        return stopRecording();
      } else {
        return startRecording();
      }
    } else if (message.length !== 0 && !file) {
      handleSendMessage(message);
    } else if (message.length === 0 && file) {
      return handleSendFile();
    }
  };

  const HandleCancelAudio = () => {
    setAudioUrl("");
    setFile(null);
    setIsRecording(false);
    setMediaRecorder(null);
    setRecordStartTime(null);
    setElapsedTime("00:00");
  };

  useEffect(() => {
    let intervalId: any;
    if (recordStartTime && isRecording) {
      intervalId = setInterval(() => {
        const elapsedTime = (Date.now() - recordStartTime) / 1000;
        const minutes = Math.floor(elapsedTime / 60);
        const seconds = Math.floor(elapsedTime % 60);
        setElapsedTime(
          `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`,
        );
      }, 100);
    }
    return () => clearInterval(intervalId);
  }, [recordStartTime, isRecording]);

  useEffect(() => {
    const handlePaste = (event: ClipboardEvent) => {
      if (event.clipboardData) {
        const items = event.clipboardData.items;
        for (const item of items) {
          if (item.type.startsWith("image/")) {
            const file = item.getAsFile();
            if (file) {
              setFile(file);
              setFileType("image");
            }
          }
        }
      }
    };

    const textarea = textareaRef.current;
    if (textarea) {
      textarea.addEventListener("paste", handlePaste as any);
    }

    return () => {
      if (textarea) {
        textarea.removeEventListener("paste", handlePaste as any);
      }
    };
  }, []);

  useEffect(() => {
    openChat();
  }, [selectedChatId]);

  return (
    <>
      <div
        className={`relative flex w-[98%] items-end gap-1 rounded-lg border-t border-t-neutral-500 bg-gradient-to-br from-[#FF0080] to-[#7928CA] px-2 py-2 lg:gap-2 lg:px-2 xl:gap-4 xl:px-4`}
      >
        <>
          <DropdownMenu
            open={
              (file && fileType === "image") || (file && fileType === "video")
                ? true
                : false
            }
            modal={false}
          >
            {file && fileType === "image" && (
              <DropdownMenuContent
                align="start"
                className="w-max min-w-max border-neutral-500 bg-neutral-800"
              >
                <DropdownMenuItem className="w-max p-0">
                  <div className="relative flex w-full flex-col gap-1 rounded-2xl bg-transparent p-2">
                    <div className="absolute top-0 right-0 z-40 cursor-pointer rounded-full bg-red-500/40 p-1 text-white hover:bg-red-500/60">
                      <X size={16} onClick={() => setFile(null)} className="" />
                    </div>
                    <Image
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      width={500}
                      height={500}
                      className="h-40 w-auto rounded-2xl object-contain"
                    />
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            )}
            {file && fileType === "video" && (
              <DropdownMenuContent
                align="start"
                side="top"
                className="w-max min-w-max border-neutral-500 bg-neutral-800"
              >
                <DropdownMenuItem className="w-max p-0">
                  <div className="relative flex w-full flex-col gap-1 rounded-2xl bg-transparent p-2">
                    <div className="absolute top-0 right-0 z-40 cursor-pointer rounded-full bg-red-500/40 p-1 text-white hover:bg-red-500/60">
                      <X size={16} onClick={() => setFile(null)} className="" />
                    </div>
                    <video
                      src={URL.createObjectURL(file)}
                      width={500}
                      height={500}
                      className="h-40 w-auto rounded-2xl object-contain"
                    />
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            )}
          </DropdownMenu>

          <div className="flex-1">
            <div className={twMerge("flex flex-col", "gap-2")}>
              {file && fileType === "audio" && (
                <div className={twMerge("w-full transition duration-500")}>
                  <AudioPlayer className="w-full" audioUrl={audioUrl} />
                </div>
              )}
              {file && fileType === "file" && (
                <div className="flex w-full flex-wrap gap-2 p-2 pt-0">
                  <div className="relative flex w-20 flex-col gap-1 rounded-md border p-1">
                    <X
                      size={16}
                      onClick={() => setFile(null)}
                      className="absolute top-0 right-0 text-red-500"
                    />
                    <div className="mx-auto flex h-10 w-10 flex-col items-center justify-center gap-2 rounded-full border border-[#ff0080]/60">
                      <Icon
                        icon="tabler:file-filled"
                        className="h-4 w-4 text-xl text-[#ff0080]/60"
                      />
                    </div>
                    <span className="truncate text-xs">{file.name}</span>
                  </div>
                </div>
              )}

              <div className="relative flex w-full items-center gap-1 rounded-md xl:gap-2">
                <textarea
                  value={message}
                  onChange={handleChange}
                  ref={textareaRef}
                  placeholder="Escreva sua mensagem..."
                  className="no-scrollbar h-10 max-h-10 min-h-10 w-full rounded-lg bg-neutral-900 p-1 px-3 pt-2 pl-3 text-base break-words outline-none placeholder:text-base focus:border-[#ff0080]/60 disabled:opacity-50 xl:h-10"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e as any);
                    }
                  }}
                  style={{
                    minHeight: "32px",
                    maxHeight: "120px",
                    overflowY: "auto",
                    resize: "none",
                  }}
                />

                {fileType === "audio" && file && (
                  <button
                    onClick={HandleCancelAudio}
                    className="mr-2 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-red-500/10 transition duration-100 hover:scale-[1.05] hover:bg-red-500/20 xl:h-8 xl:w-8 ltr:right-12 rtl:left-12"
                  >
                    <X className="h-6 w-6 text-red-500" />
                  </button>
                )}
                {isRecording && <span>({elapsedTime})</span>}
                <Button
                  onClick={HandleSend}
                  type="submit"
                  className="group relative z-[99999] h-10 w-10 min-w-10 overflow-hidden rounded-l-md border-[#ff0080]/60 p-0 xl:h-10 xl:w-10"
                >
                  <div className="absolute flex h-full w-full cursor-pointer items-center justify-center group-hover:bg-transparent">
                    {isRecording ? (
                      <Square
                        width={24}
                        height={24}
                        className={cn(
                          "absolute top-1/2 left-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 animate-pulse text-white opacity-100 transition duration-100 group-hover:text-[#ff0080]/60",
                          message.length === 0 && !file
                            ? "opacity-100"
                            : "translate-x-full opacity-0",
                        )}
                      />
                    ) : isSendingMessage ? (
                      <Loader2 className="m-auto h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Image
                          src="/record.png"
                          alt="rec"
                          width={24}
                          height={24}
                          className={cn(
                            "absolute top-1/2 left-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 text-white opacity-100 transition duration-100 group-hover:text-[#ff0080]/60",
                            message.length === 0 && !file
                              ? "opacity-100"
                              : "translate-x-full opacity-0",
                          )}
                        />
                        <SendHorizontal
                          className={cn(
                            "absolute top-1/2 left-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 text-white transition duration-100 group-hover:text-[#ff0080]/60",
                            message.length === 0 && !file
                              ? "opacity-0"
                              : "opacity-100",
                          )}
                        />
                      </>
                    )}
                  </div>
                </Button>
              </div>
            </div>
          </div>
        </>
        <button className="absolute -top-12 left-0 z-10 animate-[float_3s_ease-in-out_infinite] cursor-pointer rounded-md border border-[#FF0080] px-3 py-1.5 text-sm">
          ❤️‍🔥 Apoiar Modelo
        </button>
      </div>
    </>
  );
};

export default MessageFooter;
