"use client";

import Landing from "../features/landing/Landing";
import { Suspense } from "react";

export default function ChatPage() {
  return (
    <Suspense fallback={<div>Cargando inicio de sesión...</div>}>
      <Landing />
    </Suspense>
  );
}
