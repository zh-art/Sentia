"use client";

import AdminDashboard from "../features/admin/AdminDashboard";
import { Suspense } from "react";

export default function ChatPage() {
  return (
    <Suspense fallback={<div>Cargando métricas...</div>}>
      <AdminDashboard />
    </Suspense>
  );
}
