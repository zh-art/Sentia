"use client";

import ChatUI from "@/app/features/chat/ChatUI";
import { Suspense } from "react";

export default function ChatPage() {
  return (
    <Suspense fallback={<div>Cargando chat...</div>}>
      <ChatUI />
    </Suspense>
  );
}


