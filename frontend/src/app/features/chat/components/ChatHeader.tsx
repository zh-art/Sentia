"use client";

import LogoutButton from "@/app/features/auth/LogoutButton";
import ChatTimerSelector from "./ChatTimerDropdown";

interface ChatHeaderProps {
  isAnonymous: boolean;
  sessionId: string;
  userName?: string;
}

export default function ChatHeader({
  isAnonymous,
  sessionId,
  userName,
}: ChatHeaderProps) {
  return (
    <header className="flex items-center justify-between px-4 py-2 bg-gray-800 shadow-md">
      <span className="text-lg sm:text-xl lg:text-2xl font-semibold">
        Sentia{" "}
        {isAnonymous
          ? "(Modo Anónimo)"
          : `(Usuario Autenticado: ${userName ?? "sin nombre"})`}
      </span>
      {!isAnonymous && (
        <div className="flex items-center gap-4">
          <ChatTimerSelector sessionId={sessionId} />
          <LogoutButton />
        </div>
      )}
    </header>
  );
}
