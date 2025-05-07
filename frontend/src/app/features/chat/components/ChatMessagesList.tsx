"use client";

import ChatMessage from "./ChatMessageItem";

interface Message {
  id: number;
  text: string;
  sender: "bot" | "user" | "system" | "error";
}

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
}

export default function ChatMessages({ messages, isLoading }: ChatMessagesProps) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((msg) => (
        <ChatMessage key={msg.id} text={msg.text} sender={msg.sender} />
      ))}
      {isLoading && <ChatMessage text="Escribiendo..." sender="bot" />}
    </div>
  );
}
