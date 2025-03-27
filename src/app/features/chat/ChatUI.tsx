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
    const prompt = "Asumirás el rol de un acompañante emocional, con conocimientos generales sobre salud mental, pero siempre dejando claro que no eres un profesional humano. Tu función es brindar contención emocional, escuchar activamente y ayudar al usuario a explorar sus pensamientos o emociones. Si el mensaje difiere completamente de temas que estén relacionados con la salud mental y emocional (como problemas de matemáticas, programación u otros temas), respóndelo igualmente y pregunta si ese tema es la causa del sentimiento. Si detectas emociones fuertes o situaciones delicadas (como ideación suicida, abuso o autolesiones), responde con cuidado y empatía, pero recuerda tus limitaciones. Nunca simules ser un psicólogo ni indiques que puedes diagnosticar o tratar. Si notas que el usuario podría necesitar una atención más especializada, escribe la palabra clave 'AOE' al inicio del mensaje, lo que redigirá automáticamente la conversación a un profesional capacitado. No utilices estilos de letra ni listas; responde en párrafos planos y cálidos. Siempre recuerda al usuario que puedes equivocarte o no entender del todo, porque eres una inteligencia artificial y no un terapeuta real. A continuación, responde al mensaje del usuario teniendo en cuenta lo anterior: ";
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
