"use client";
<<<<<<< HEAD:src/app/features/chat/ChatUI.tsx

import { useState, useEffect } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useSearchParams, useRouter } from "next/navigation";
=======
import { useState } from "react";
>>>>>>> 449cd71cf7834e6b3e64c2d7fc18a53c637a8a8d:src/app/features/chat/components/ChatUI.tsx
import ChatMessage from "./ChatMessage";
import InputBox from "./InputBox";
import { fetchChatResponse } from "../services/chatService";

interface Message {
  id: number;
  text: string;
  sender: "bot" | "user";
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

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: isAnonymous
        ? "⚠️ Estás en modo anónimo. Tu historial de chat no se guardará."
        : `¡Hola, ${user?.name || "usuario"}! ¿En qué puedo ayudarte hoy?`,
      sender: "bot",
    },
  ]);

  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (message: string) => {
    if (!message.trim()) return;

    const newMessage: Message = {
      id: Date.now(),
      text: message,
      sender: "user",
    };
    setMessages((prev) => [...prev, newMessage]);

    setIsLoading(true);

    const responseText = await fetchChatResponse(message);
    const botResponse: Message = {
      id: Date.now(),
      text: responseText,
      sender: "bot",
    };
    setMessages((prev) => [...prev, botResponse]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-gray-900 text-white">
      <header className="bg-gray-800 text-white text-center py-4 font-semibold text-lg shadow-md">
        Sentia {isAnonymous ? "(Modo Anónimo)" : "(Usuario Autenticado)"}
      </header>

      {isAnonymous && (
        <div className="bg-yellow-500 text-black text-center p-2">
          ⚠️ Estás en modo anónimo. Tu historial de chat no se guardará.
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
