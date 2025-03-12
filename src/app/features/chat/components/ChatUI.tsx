"use client";
import { useState } from "react";
import ChatMessage from "./ChatMessage";
import InputBox from "./InputBox";
import { fetchChatResponse } from "../services/chatService";

interface Message {
  id: number;
  text: string;
  sender: "bot" | "user";
}

export default function ChatUI() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "¡Hola! ¿En qué puedo ayudarte hoy?", sender: "bot" },
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
    <div className="flex flex-col h-full w-full bg-gray-900 text-white"> 
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
