"use client";

import { useState, useEffect } from "react";
import { useUser } from "@auth0/nextjs-auth0";
import { useSearchParams, useRouter } from "next/navigation";
import ChatHeader from "./components/ChatHeader";
import ChatMessages from "./components/ChatMessagesList";
import InputBox from "./components/InputBox";

import { startScheduler } from "./utils/startScheduler";
import { synchronizeChatHistory } from "./utils/synchronizeChatHistory";
import { sendBotPrompt } from "./utils/sendBotPrompt";

interface Message {
  id: number;
  text: string;
  sender: "bot" | "user" | "system" | "error";
}

export default function ChatUI() {
  const { user } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isAnonymous = searchParams.get("anonymous") === "true";
  const userId = user?.sub || "";

  const sessionId = isAnonymous
    ? `anon-${Date.now()}`
    : user?.sub || "default-user";

  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasUserStartedChat, setHasUserStartedChat] = useState(false);

  useEffect(() => {
    if (!user && !isAnonymous) router.push("/");
  }, [user, isAnonymous, router]);

  useEffect(() => {
    const welcomeText = isAnonymous
      ? "Te doy la bienvenida a Sentia, ¿Cómo te sientes?"
      : `Hola, ${user?.name || "usuario"} ¿Cómo te sientes?"`;
  }, [user, isAnonymous]);

  useEffect(() => {
    if (!isAnonymous && user && !isLoading) {
      startScheduler();
      synchronizeChatHistory(sessionId, setMessages);
    }
  }, [user, isLoading, isAnonymous, sessionId]);

  const sendMessage = async (
    message: string,
    sender: "bot" | "user" | "system" | "error" = "user",
    messageType: "normal" | "welcome" | "system" = "normal"
  ) => {
    if (!message.trim()) return;

    if (sender === "user") {
      if (!hasUserStartedChat) setHasUserStartedChat(true);

      const userMsg: Message = {
        id: Date.now(),
        text: message,
        sender: "user",
      };

      setMessages((prev) => [...prev, userMsg]);
      setIsLoading(true);

      const response = await sendBotPrompt(
        message,
        isAnonymous ? sessionId : userId,
        isAnonymous
      );

      const newMsg: Message = {
        id: Date.now(),
        text: response.success
          ? response.result!
          : response.error || "Error desconocido",
        sender: response.success ? "bot" : "error",
      };

      setMessages((prev) => [...prev, newMsg]);
      setIsLoading(false);
    } else {
      const localMessage: Message = {
        id: Date.now(),
        text: message,
        sender,
      };

      setMessages((prev) => [...prev, localMessage]);
      setIsLoading(true);

      const response = await sendBotPrompt(
        message,
        isAnonymous ? sessionId : userId,
        isAnonymous,
        messageType
      );

      const newMsg: Message = {
        id: Date.now(),
        text: response.success
          ? response.result!
          : response.error || "Error desconocido",
        sender: response.success ? "bot" : "error",
      };

      setMessages((prev) => [...prev, newMsg]);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-gray-900 text-white">
      <ChatHeader
        isAnonymous={isAnonymous}
        sessionId={sessionId}
        userName={user?.name}
        userPicture={user?.picture}
      />

      <ChatMessages messages={messages} isLoading={isLoading} />

      <InputBox onSendMessage={sendMessage} />
    </div>
  );
}
