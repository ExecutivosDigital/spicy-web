"use client";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { Annoyed, Loader2, Mic, SendHorizontal, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

import { MessageProps } from "@/@types/global";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useApiContext } from "@/context/ApiContext";
import { useChatContext } from "@/context/chatContext";
import { cn } from "@/lib/utils";
import i18n from "@emoji-mart/data/i18n/pt.json";
import { Icon } from "@iconify/react";
import { useCookies } from "next-client-cookies";
import Image from "next/image";
import { twMerge } from "tailwind-merge";
import fixWebmDuration from "webm-duration-fix";
import { AudioPlayer } from "./AudioPlayer";

const MessageFooter = ({}: {}) => {
  const { selectedChatId, selectedChat, setSelectedChatMessages } =
    useChatContext();

  const { PostAPI } = useApiContext();

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [message, setMessage] = useState("");

  const [audioUrl, setAudioUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [elapsedTime, setElapsedTime] = useState("00:00");
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [isEmojiPopoverOpen, setIsEmojiPopoverOpen] = useState(false);
  const [recordState, setRecordState] = useState<string | null>(null);
  const [recordStartTime, setRecordStartTime] = useState<number | null>(null);
  const [fileType, setFileType] = useState<"file" | "audio" | "image" | null>(
    null,
  );

  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null,
  );
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [isRecording, setIsRecording] = useState(false);

  const handleSendMessage = async (message: string) => {
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
    }

    if (connect.status !== 200) {
      return alert(connect.body.message);
    }
  };

  const cookies = useCookies();

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    e.target.style.height = "auto"; // Reset the height to auto to adjust
    e.target.style.height = `${e.target.scrollHeight - 15}px`;
  };

  const handleSelectEmoji = (emoji: any) => {
    setMessage(message + emoji.native);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSendMessage(message);
    setMessage("");
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
    setAudioChunks(chunks);
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

  const onStop = async (audioData?: any) => {
    setAudioUrl(audioData.url);
    setFile(audioData.blob);
    setFileType("audio");
  };

  const HandleSend = async () => {
    if (message.length === 0 && !file) {
      if (isRecording) {
        return stopRecording();
      } else {
        return startRecording();
      }
    } else if (message.length !== 0 && !file) {
      handleSendMessage(message);
      return setMessage("");
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
    const handlePaste = (event: ClipboardEvent) => {
      if (event.clipboardData) {
        const items = event.clipboardData.items;
        for (let item of items) {
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

  async function handleSendFile() {
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
        setRecordState(null);
        setRecordStartTime(null);
        setElapsedTime("00:00");
        setSelectedChatMessages((prev) => [...prev, fileSend.body.message]);
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
    setRecordState(null);
    setRecordStartTime(null);
    setElapsedTime("00:00");
  }

  useEffect(() => {
    openChat();
  }, [selectedChatId]);

  return (
    <>
      <div
        className="relative flex w-full items-end gap-1 px-2 lg:gap-2 lg:px-2 xl:gap-4 xl:px-4"
        style={{
          boxSizing: "border-box",
        }}
      >
        <>
          <button className="border-primary relative flex h-10 w-10 items-center justify-center rounded-full border p-2 disabled:opacity-50 lg:h-8 lg:w-8 xl:h-10 xl:w-10">
            <Icon icon="tabler:file-filled" className="text-primary text-xl" />
            <input
              type="file"
              className="absolute h-full w-full rounded-full opacity-0"
              onChange={(e) => {
                const files = e.target.files;

                if (files && files.length > 0) {
                  if (files[0].type.startsWith("image/")) {
                    setFileType("image");
                  } else {
                    setFileType("file");
                  }
                  setFile(files[0]);
                }
              }}
            />
          </button>
          <div className="flex-1">
            <form
              onSubmit={handleSubmit}
              className={twMerge("flex flex-col", "gap-2")}
            >
              {file && fileType === "file" && (
                <div className="flex w-full flex-wrap gap-2 p-2 pt-0">
                  <div className="relative flex w-20 flex-col gap-1 rounded-md border p-1">
                    <X
                      size={16}
                      onClick={() => setFile(null)}
                      className="absolute top-0 right-0 text-red-500"
                    />
                    <div className="border-primary mx-auto flex h-10 w-10 flex-col items-center justify-center gap-2 rounded-full border">
                      <Icon
                        icon="tabler:file-filled"
                        className="text-primary h-4 w-4 text-xl"
                      />
                    </div>
                    <span className="truncate text-xs">{file.name}</span>
                  </div>
                </div>
              )}
              {file && fileType === "image" && (
                <div className="relative flex w-full flex-wrap gap-2 p-2 pt-0">
                  <div className="relative flex w-60 flex-col gap-1 rounded-md border p-1">
                    <X
                      size={16}
                      onClick={() => setFile(null)}
                      className="absolute top-0 right-0 text-red-500"
                    />
                    <Image
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      width={500}
                      height={500}
                      className="h-full w-full object-contain"
                    />
                    <span className="truncate text-xs">{file.name}</span>
                  </div>
                </div>
              )}
              {file && fileType === "audio" && (
                <div className={twMerge("w-full transition duration-500")}>
                  <AudioPlayer className="w-full" audioUrl={audioUrl} />
                </div>
              )}
              <div className="relative flex items-center gap-2">
                <textarea
                  value={message}
                  onChange={handleChange}
                  ref={textareaRef}
                  placeholder="Escreva sua mensagem..."
                  className="no-scrollbar border-default-200 bg-background focus:border-primary h-10 flex-1 rounded-lg border p-1 px-3 pt-2 pl-3 text-sm break-words outline-none placeholder:text-sm disabled:opacity-50 lg:h-8 xl:h-10"
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

                {fileType === "audio" && file ? (
                  <button
                    onClick={HandleCancelAudio}
                    className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-red-500/10 transition duration-100 hover:scale-[1.05] hover:bg-red-500/20 ltr:right-12 rtl:left-12"
                  >
                    <X className="h-6 w-6 text-red-500" />
                  </button>
                ) : (
                  <Popover
                    open={isEmojiPopoverOpen}
                    onOpenChange={setIsEmojiPopoverOpen}
                  >
                    <PopoverTrigger asChild>
                      <span className="bg-primary/10 flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg ltr:right-12 rtl:left-12">
                        <Annoyed className="text-primary h-6 w-6" />
                      </span>
                    </PopoverTrigger>
                    <PopoverContent
                      side="top"
                      className="bottom-0 w-fit border-none p-0 shadow-none ltr:-left-[110px] rtl:left-5"
                    >
                      <Picker
                        data={data}
                        onEmojiSelect={(e: any) => {
                          handleSelectEmoji(e);
                          setIsEmojiPopoverOpen(false);
                        }}
                        theme="light"
                        i18n={i18n}
                      />
                    </PopoverContent>
                  </Popover>
                )}
                {isRecording && <span>({elapsedTime})</span>}
                <Button
                  onClick={HandleSend}
                  type="submit"
                  className="bg-primary hover:bg-default-300 relative h-8 w-8 overflow-hidden rounded-lg p-0"
                >
                  <>
                    <div className="bg-primary absolute flex h-full w-full items-center justify-center rounded-lg">
                      {isRecording ? (
                        <div className="absolute flex h-full w-full items-center justify-center gap-0.5">
                          <div className="animate-recording h-1.5 w-1.5 rounded-full bg-white delay-200"></div>
                          <div className="animate-recording h-1.5 w-1.5 rounded-full bg-white delay-100"></div>
                          <div className="animate-recording h-1.5 w-1.5 rounded-full bg-white"></div>
                        </div>
                      ) : isSendingMessage ? (
                        <Loader2 className="m-auto h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <Mic
                            className={cn(
                              "absolute top-1/2 left-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 text-white transition duration-100",
                              message.length === 0 && !file
                                ? "opacity-100"
                                : "translate-x-full opacity-0",
                            )}
                          />
                          <SendHorizontal
                            className={cn(
                              "absolute top-1/2 left-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 text-white transition duration-100",
                              message.length === 0 && !file
                                ? "opacity-0"
                                : "opacity-100",
                            )}
                          />
                        </>
                      )}
                    </div>
                    <div className="bg-primary absolute flex h-full w-full items-center justify-center rounded-lg">
                      {isRecording ? (
                        <div className="absolute flex h-full w-full items-center justify-center gap-0.5">
                          <div className="animate-recording h-1.5 w-1.5 rounded-full bg-white delay-200"></div>
                          <div className="animate-recording h-1.5 w-1.5 rounded-full bg-white delay-100"></div>
                          <div className="animate-recording h-1.5 w-1.5 rounded-full bg-white"></div>
                        </div>
                      ) : (
                        <>
                          {isSendingMessage ? (
                            <Loader2 className="m-auto h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <Mic
                                className={cn(
                                  "absolute top-1/2 left-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 text-white transition duration-100",
                                  message.length === 0 && !file
                                    ? "opacity-100"
                                    : "translate-x-full opacity-0",
                                )}
                              />
                              <SendHorizontal
                                className={cn(
                                  "absolute top-1/2 left-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 text-white transition duration-100",
                                  message.length === 0 && !file
                                    ? "opacity-0"
                                    : "opacity-100",
                                )}
                              />
                            </>
                          )}
                        </>
                      )}
                    </div>
                  </>
                </Button>
              </div>
            </form>
          </div>
        </>
      </div>
    </>
  );
};

export default MessageFooter;
