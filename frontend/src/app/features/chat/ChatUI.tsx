"use client";

import { useState, useEffect } from "react";
import { useUser } from "@auth0/nextjs-auth0";
import { useSearchParams, useRouter } from "next/navigation";
import ChatMessage from "./ChatMessage";
import InputBox from "./InputBox";
import LogoutButton from "@/app/features/auth/LogoutButton";
import ChatTimerSelector from "@/app/features/chat/ChatTimerSelector";
import { fetchChatHistory } from "./chatService";

interface Message {
  id: number;
  text: string;
  sender: "bot" | "user" | "system" | "error";
}

export default function ChatUI() {
  const { user } = useUser();
  const searchParams = useSearchParams();
  const router = useRouter();

  const isAnonymous = searchParams.get("anonymous") === "true";

  useEffect(() => {
    if (!user && !isAnonymous) {
      router.push("/");
    }
  }, [user, isAnonymous, router]);

  const chatId = isAnonymous
    ? `anon-${Date.now()}`
    : user?.sub || "default-user";

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: isAnonymous
        ? "Te doy la bienvenida a Sentia, ¿Cómo te sientes?"
        : `¡Hola, ${user?.name || "usuario"}! ¿Cómo te sientes?`,
      sender: "bot",
    },
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [hasSentMessage, setHasSentMessage] = useState(false);
  const [chatTimer, setChatTimer] = useState<number>(24 * 60);

  useEffect(() => {
    if (!isAnonymous) {
      const interval = setInterval(async () => {
        try {
          const data = await fetchChatHistory(chatId);

          const newMessages = data.map((item: any) => ({
            id: Date.parse(item.timestamp),   // Adaptar si la estructura es diferente
            text: item.message,
            sender: "user"
          })).concat(
            data.map((item: any) => ({
              id: Date.parse(item.timestamp) + 1, // Asegura id único si bot y user comparten timestamp
              text: item.response,
              sender: "bot"
            }))
          );

          setMessages(newMessages);
        } catch (error) {
          console.error("Error sincronizando historial:", error);
        }
      }, 60000); // Cada minuto

      return () => clearInterval(interval);
    }
  }, [isAnonymous, chatId]);

  const sendMessage = async (message: string, sender: "bot" | "user" | "system" | "error" = "user") => {
    if (!message.trim()) return;

    if (sender === "user") {
      if (!hasSentMessage) {
        setHasSentMessage(true);
      }

      const newMessage: Message = {
        id: Date.now(),
        text: message,
        sender: "user",
      };
      setMessages((prev) => [...prev, newMessage]);
      setIsLoading(true);

      try {
        const response = await fetch(`/api/deepseek`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: message }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        const botResponse: Message = {
          id: Date.now(),
          text: data.result || "No response from the API",
          sender: "bot",
        };

        setMessages((prev) => [...prev, botResponse]);
      } catch (error) {
        console.error("Error fetching from Gemini API:", error);
        const errorMessage: Message = {
          id: Date.now(),
          text: "Failed to fetch API",
          sender: "bot",
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-gray-900 text-white">
      <header className="flex items-center justify-between px-4 py-2 bg-gray-800 text-white text-center py-4 font-semibold text-lg shadow-md flex justify-between px-4">
        <span className="text-[16px] sm:text-[18px] md:text-[20px] lg:text-[24px] font-semibold whitespace-nowrap">
          Sentia {isAnonymous ? "(Modo Anónimo)" : "(Usuario Autenticado)"}
        </span>
        {!isAnonymous && <ChatTimerSelector
          userId={chatId}
        />}
        {!isAnonymous && <LogoutButton />}
      </header>

      {isAnonymous && (
        <div
          className={`text-center p-2 transition-colors duration-500 ${hasSentMessage
              ? "bg-gray-800 text-white"
              : "bg-yellow-500 text-black"
            }`}
        >
          ⚠️ Estás en modo anónimo. Tu historial de chat no se guardará. ⚠️
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} text={msg.text} sender={msg.sender} />
        ))}
        {isLoading && <ChatMessage text="Escribiendo..." sender="bot" />}
      </div>

      <InputBox onSendMessage={sendMessage} />
    </div>
  );
}
