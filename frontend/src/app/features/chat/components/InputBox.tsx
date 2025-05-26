"use client";

import { useState } from "react";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";

interface InputBoxProps {
  onSendMessage: (message: string) => void;
}

export default function InputBox({ onSendMessage }: InputBoxProps) {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    onSendMessage(input);
    setInput("");
  };

  return (
    <div
      className="flex items-center justify-between px-6 py-4 
        bg-white dark:bg-[#1a1b26] 
        border-t border-gray-200 dark:border-gray-700
        text-gray-900 dark:text-[#e5e9f0]
        shadow-sm transition-colors duration-300"
    >
      <input
        type="text"
        className="flex-1 px-4 py-3 mr-4
          bg-gray-100 dark:bg-[#2a2d3a] 
          text-gray-900 dark:text-white 
          placeholder-gray-500 dark:placeholder-gray-400 
          border border-gray-300 dark:border-gray-600 
          rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500
          transition-all duration-300"
        placeholder="Escribe un mensaje..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
      />
      <button
        onClick={handleSend}
        className="p-3 rounded-xl bg-blue-600 hover:bg-blue-700 
          text-white shadow-md transition-transform transform hover:scale-105"
        aria-label="Enviar mensaje"
      >
        <PaperAirplaneIcon className="h-5 w-5 rotate-45" />
      </button>
    </div>
  );
}
