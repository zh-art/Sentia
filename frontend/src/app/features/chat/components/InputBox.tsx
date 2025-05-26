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
<<<<<<< Updated upstream
    <div className="flex items-center p-4 bg-gray-800 border-t border-gray-700 rounded-xl">
=======
    <div
      className="flex items-center justify-between px-6 py-4 
        bg-white dark:bg-[#1a1b26] 
        border-t border-gray-200 dark:border-gray-700
        text-gray-900 dark:text-[#e5e9f0]
        shadow-sm transition-colors duration-300"
    >
>>>>>>> Stashed changes
      <input
        type="text"
        className="flex-1 px-4 py-3 mr-4
    bg-white dark:bg-[#1a1b26] 
    text-gray-900 dark:text-[#e5e9f0]
    placeholder-gray-500 dark:placeholder-gray-400 
    border border-gray-200 dark:border-gray-700 
    rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500
    transition-all duration-300"
        placeholder="Escribe un mensaje..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
      />
      <button
<<<<<<< Updated upstream
        className="group ml-3 bg-blue-500 hover:bg-blue-600   text-white px-4 py-2 rounded-xl flex items-center justify-center transition-all transition"
=======
>>>>>>> Stashed changes
        onClick={handleSend}
        className="p-3 rounded-xl bg-blue-600 hover:bg-blue-700 
          text-white shadow-md transition-transform transform hover:scale-105"
        aria-label="Enviar mensaje"
      >
<<<<<<< Updated upstream
        <PaperAirplaneIcon className="h-5 w-5 transform group-hover:translate-x-1 transition" />
=======
        <PaperAirplaneIcon className="h-5 w-5 rotate-45" />
>>>>>>> Stashed changes
      </button>
    </div>
  );
}
