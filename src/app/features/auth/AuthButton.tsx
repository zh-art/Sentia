"use client";

import Link from "next/link";

export default function AuthButton() {
  return (
    <Link
      href="/api/auth/login"
      className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg block text-center"
    >
      Iniciar sesión
    </Link>
  );
}
