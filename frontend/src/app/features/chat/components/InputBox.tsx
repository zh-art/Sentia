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
    <div className="flex items-center p-4 bg-gray-800 border-t border-gray-700 rounded-xl">
      <input
        type="text"
        className="flex-1 p-3 bg-gray-700 text-white border border-gray-600 rounded-xl outline-none focus:border-blue-500"
        placeholder="Escribe un mensaje..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
      />
      <button
        className="group ml-3 bg-blue-500 hover:bg-blue-600   text-white px-4 py-2 rounded-xl flex items-center justify-center transition-all transition"
        onClick={handleSend}
      >
        <PaperAirplaneIcon className="h-5 w-5 transform group-hover:translate-x-1 transition" />
      </button>
    </div>
  );
}
