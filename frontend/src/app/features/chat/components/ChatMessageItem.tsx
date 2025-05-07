import { motion } from "framer-motion";

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
      className={`flex ${isSystem ? "justify-center" : isError ? "justify-center" : isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`px-4 py-3 max-w-xs md:max-w-md lg:max-w-lg rounded-xl text-sm shadow-lg ${
          isSystem
            ? "bg-gray-600 text-white italic"
            : isError
              ? "bg-gray-800 text-red-500 italic border border-red-400"
              : isUser
                ? "bg-blue-500 text-white"
                : "bg-gray-700 text-white"
        }`}
      >
        {text}
      </div>
    </motion.div>
  );
}
