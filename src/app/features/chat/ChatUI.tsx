"use client";

import { useState } from "react";
import ChatMessage from "./ChatMessage";
import InputBox from "./InputBox";

interface Message {
  id: number;
  text: string;
  sender: "bot" | "user";
}

export default function ChatUI() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "¡Hola! ¿En qué puedo ayudarte hoy?", sender: "bot" },
  ]);

  const sendMessage = async (message: string) => {
    if (!message.trim()) return;

    const newMessage: Message = {
      id: Date.now(),
      text: message,
      sender: "user",
    };
    setMessages((prev) => [...prev, newMessage]);

    setTimeout(() => {
      const botResponse: Message = {
        id: Date.now(),
        text: "Estoy aquí para escucharte 😊",
        sender: "bot",
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-gray-900 text-white">
      <header className="bg-gray-800 text-white text-center py-4 font-semibold text-lg shadow-md">
        Sentia
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} text={msg.text} sender={msg.sender} />
        ))}
      </div>

      <InputBox onSendMessage={sendMessage} />
    </div>
  );
}
