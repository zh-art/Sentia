"use client";

import Link from "next/link";

const audience = process.env.NEXT_PUBLIC_AUTH0_AUDIENCE;

export default function AuthButton() {
  const loginUrl = `/auth/login?returnTo=/chat&audience=${audience}`;

  return (
    <Link
      href={loginUrl}
      className="bg-[#2563eb] dark:bg-cyan-500 hover:bg-[#1d4ed8] dark:hover:bg-cyan-400 text-white px-6 py-3 rounded-xl block text-center w-full font-medium transform transition-transform duration-300 hover:scale-105 shadow-lg"
    >
      Iniciar sesión
    </Link>
  );
}
