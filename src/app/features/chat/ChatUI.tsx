"use client";

import { useState, useEffect } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useSearchParams, useRouter } from "next/navigation";
import ChatMessage from "./ChatMessage";
import InputBox from "./InputBox";
import LogoutButton from "@/app/features/auth/LogoutButton";

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
        ? "Te doy la bienvenida a Sentia, ¿Cómo te sientes?"
        : `¡Hola, ${user?.name || "usuario"}! ¿Cómo te sientes?`,
      sender: "bot",
    },
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [hasSentMessage, setHasSentMessage] = useState(false);

  const sendMessage = async (message: string) => {
    if (!message.trim()) return;

    if (!hasSentMessage) {
      setHasSentMessage(true);
    }
    const prompt = "Tomarás el rol de un especialista de psicología. Solo responderás a mensajes que tengan relación con la salud mental y emocional de las personas. Darás una respuesta dependiendo de los sentimientos que detectes en el mensaje. En ningún momento responderás recomendarás llamar a un psicólogo o a algún especialista, en cambio, darás una respuesta como si fueras alguno de esos roles. No utilices estilos de letra o listas, pues el programa que usa la API no lo soporta. Teniendo lo anterior en cuenta, analiza y responde lo siguiente: ";
    const formattedMessage = `${prompt} ${message}`;
    const newMessage: Message = {
      id: Date.now(),
      text: message,
      sender: "user",
    };
    setMessages((prev) => [...prev, newMessage]);

    setIsLoading(true);

    try {
      const response = await fetch(
        `https://free-unoficial-gpt4o-mini-api-g70n.onrender.com/chat/?query=${encodeURIComponent(formattedMessage)}`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
          },
        }
      );
      const data = await response.json();

      const botResponse: Message = {
        id: Date.now(),
        text: data.results || "No response from the API",
        sender: "bot",
      };
      setMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      console.log(error);
      const botResponse: Message = {
        id: Date.now(),
        text: "Failed to fetch API",
        sender: "bot",
      };
      setMessages((prev) => [...prev, botResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-gray-900 text-white">
      <header className="bg-gray-800 text-white text-center py-4 font-semibold text-lg shadow-md flex justify-between px-4">
        <span>
          Sentia {isAnonymous ? "(Modo Anónimo)" : "(Usuario Autenticado)"}
        </span>
        {!isAnonymous && <LogoutButton />}
      </header>

      {isAnonymous && (
        <div
          className={`text-center p-2 transition-colors duration-500 ${
            hasSentMessage ? "bg-gray-800 text-white" : "bg-yellow-500 text-black"
          }`}
        >
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
