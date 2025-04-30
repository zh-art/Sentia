"use client";

import Link from "next/link";

export default function AuthButton() {
  return (
    <Link
      href="/auth/login"
      className="bg-white border border-black text-black px-6 py-3 rounded-xl block text-center w-full font-medium transform transition-transform duration-300 hover:scale-105 shadow-lg"
    >
      Iniciar sesión
    </Link>
  );
}
