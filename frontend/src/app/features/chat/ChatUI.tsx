"use client";

import { useState, useEffect } from "react";
import { useUser } from "@auth0/nextjs-auth0";
import { useSearchParams, useRouter } from "next/navigation";

<<<<<<< Updated upstream
import AnonymityAlert from "./components/AnonymityAlert";
=======
import ChatHeader from "./components/ChatHeader";
>>>>>>> Stashed changes
import ChatMessages from "./components/ChatMessagesList";
import InputBox from "./components/InputBox";

import { startScheduler } from "./utils/startScheduler";
import { synchronizeChatHistory } from "./utils/synchronizeChatHistory";
import { sendBotPrompt } from "./utils/sendBotPrompt";

import Navbar from "../navbar/Navbar";
import ChatTimerSelector from "@/components/ChatTimerSelector";

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
  const [currentTimer, setCurrentTimer] = useState<number>(0);

  // Redirigir si no está autenticado y no es anónimo
  useEffect(() => {
    if (!user && !isAnonymous) router.push("/");
  }, [user, isAnonymous, router]);

  // Mensaje inicial
  useEffect(() => {
    const welcomeText = isAnonymous
      ? "Te doy la bienvenida a Sentia, ¿Cómo te sientes?"
      : `Hola, ${user?.name || "usuario"} ¿Cómo te sientes?"`;

    sendMessage(welcomeText, "bot", "welcome");
  }, [user, isAnonymous]);

  // Iniciar scheduler si autenticado
  useEffect(() => {
    if (!isAnonymous && user && !isLoading) {
      startScheduler();
      synchronizeChatHistory(sessionId, setMessages);
    }
<<<<<<< Updated upstream
  }, [user, isLoading, isAnonymous, sessionId]);
=======
  }, [isAnonymous, sessionId]);
>>>>>>> Stashed changes

  // Enviar mensaje del usuario
  const sendMessage = async (
    message: string,
    sender: "bot" | "user" | "system" | "error" = "user",
    messageType: "normal" | "welcome" | "system" = "normal"
  ) => {
    if (!message.trim()) return;

    if (sender === "user") {
      if (!hasUserStartedChat) setHasUserStartedChat(true);
<<<<<<< Updated upstream
=======

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
>>>>>>> Stashed changes
    }

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
  };

  const handleChangeTimer = (newTimer: number) => {
    setCurrentTimer(newTimer);
  };

  const title = isLoading
    ? "Sentia"
    : user
      ? `Sentia (${user.name})`
      : "Sentia (Modo anónimo)";

  return (
<<<<<<< Updated upstream
    <div className="flex flex-col h-[94vh] w-screen bg-gray-900 text-white">
      <Navbar
        title={title}
        items={[
          { name: "Inicio", url: "/" },
          { name: "Sobre Nosotros", url: "/sobre-nosotros" },
          { name: "Actualizaciones", url: "/actualizaciones" },
        ]}
      />

      <div className="mt-5 px-4">
        {!isAnonymous && (
          <ChatTimerSelector
            chatId={sessionId}
            currentTimer={currentTimer}
            onChangeTimer={handleChangeTimer}
            onSendMessage={sendMessage}
          />

        )}
        {isAnonymous && (
          <AnonymityAlert hasUserStartedChat={hasUserStartedChat} />
        )}
      </div>

=======
    <div className="flex flex-col h-screen w-screen bg-gray-900 text-white">
      <ChatHeader
        isAnonymous={isAnonymous}
        sessionId={sessionId}
        userName={user?.name}
        userPicture={user?.picture}
      />

>>>>>>> Stashed changes
      <ChatMessages messages={messages} isLoading={isLoading} />
      <div className="border-t py-2">
        <div className="max-w-6xl w-full mx-auto px-4">
          <InputBox onSendMessage={sendMessage} />
        </div>
      </div>
    </div>
  );
}
