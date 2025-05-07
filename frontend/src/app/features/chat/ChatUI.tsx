"use client";

import { useState, useEffect } from "react";
import { useUser } from "@auth0/nextjs-auth0";
import { useSearchParams, useRouter } from "next/navigation";

import ChatHeader from "./components/ChatHeader";
import AnonymityAlert from "./components/AnonymityAlert";
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

  // Redirigir si no está autenticado y no es anónimo
  useEffect(() => {
    if (!user && !isAnonymous) router.push("/");
  }, [user, isAnonymous, router]);

  // Mensaje inicial
  useEffect(() => {
    const welcome: Message = {
      id: 1,
      text: isAnonymous
        ? "Te doy la bienvenida a Sentia, ¿Cómo te sientes?"
        : `Hola, ${user?.name || "usuario"} ¿Cómo te sientes?`,
      sender: "bot",
    };
    setMessages([welcome]);
  }, [user, isAnonymous]);

  // Iniciar scheduler si autenticado
  useEffect(() => {
    if (!isAnonymous && user && !isLoading) {
      startScheduler();
    }
  }, [user, isLoading, isAnonymous]);

  // Sincronizar historial inmediatamente y cada 60s si autenticado
  useEffect(() => {
    if (!isAnonymous) {
      synchronizeChatHistory(sessionId, setMessages);
    }
  }, [isAnonymous, sessionId]);
  
  

  // Enviar mensaje del usuario
  const sendMessage = async (
    message: string,
    sender: "bot" | "user" | "system" | "error" = "user"
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
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-gray-900 text-white">
      <ChatHeader
        isAnonymous={isAnonymous}
        sessionId={sessionId}
        userName={user?.name}
      />

      {isAnonymous && (
        <AnonymityAlert hasUserStartedChat={hasUserStartedChat} />
      )}

      <ChatMessages messages={messages} isLoading={isLoading} />
      <InputBox onSendMessage={sendMessage} />
    </div>
  );
}
