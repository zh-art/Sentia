"use client";

import Link from "next/link";

export default function LogoutButton() {
  return (
    <Link
      href="/api/auth/logout"
      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm"
    >
      Cerrar sesión
    </Link>
  );
}
