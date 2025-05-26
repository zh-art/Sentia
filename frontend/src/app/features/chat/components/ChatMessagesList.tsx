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
  isAnonymous?: boolean;
}

export default function ChatMessages({
  messages,
  isLoading,
}: ChatMessagesProps) {
  return (
    <div
      className="flex-1 overflow-y-auto px-6 py-8 space-y-5 transition-colors duration-300 
      bg-gradient-to-b 
      from-white via-indigo-50 to-purple-100 
      dark:from-[#1a1b26] dark:via-[#1a1c2e] dark:to-[#202237]"
    >
      {messages.map((msg) => (
        <ChatMessage key={msg.id} text={msg.text} sender={msg.sender} />
      ))}

      {isLoading && <ChatMessage text="Escribiendo..." sender="bot" />}
    </div>
  );
}
