import { motion } from "framer-motion";

interface ChatMessageProps {
  text: string;
  sender: "bot" | "user";
}

export default function ChatMessage({ text, sender }: ChatMessageProps) {
  const isUser = sender === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`px-4 py-3 max-w-xs md:max-w-md lg:max-w-lg rounded-xl text-white text-sm shadow-lg ${
          isUser ? "bg-blue-500" : "bg-gray-700"
        }`}
      >
        {text}
      </div>
    </motion.div>
  );
}
