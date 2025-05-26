"use client";

import { motion } from "framer-motion";
import { CpuChipIcon, UserIcon } from "@heroicons/react/24/solid";

interface ChatMessageProps {
  text: string;
  sender: "bot" | "user" | "system" | "error";
}

export default function ChatMessage({ text, sender }: ChatMessageProps) {
  const isUser = sender === "user";
  const isSystem = sender === "system";
  const isError = sender === "error";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div className="flex items-start gap-3 max-w-[90%]">
        {!isUser && !isSystem && !isError && (
          <div className="shrink-0">
            <CpuChipIcon className="w-8 h-8 text-cyan-500 bg-white dark:bg-gray-800 rounded-full p-1 shadow-md" />
          </div>
        )}

        {!isSystem && !isError && isUser && (
          <div className="shrink-0 order-2">
            <UserIcon className="w-8 h-8 text-white bg-blue-600 rounded-full p-1 shadow-md" />
          </div>
        )}

        <div
          className={`px-4 py-3 text-sm rounded-xl shadow-lg max-w-[100%]
            ${isSystem
              ? "bg-gray-600 text-white italic mx-auto"
              : isError
              ? "bg-red-100 text-red-600 border border-red-400 dark:bg-red-900 dark:text-red-300"
              : isUser
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-white"}
          `}
        >
          {text}
        </div>
      </div>
    </motion.div>
  );
}
