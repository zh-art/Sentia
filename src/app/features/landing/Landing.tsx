"use client";
import { useEffect } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useRouter } from "next/navigation";

export default function Landing() {
  const { user, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/chat");
    }
  }, [user, router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <div className="text-center">
        <img
          src="/logo.png"
          alt="Sentia Logo"
          className="w-32 h-32 mx-auto mb-4"
        />
        <h1 className="text-3xl font-bold">Sentia</h1>
      </div>

      <div className="mt-6 space-y-4">
        <a
          href="/api/auth/login"
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg block text-center"
        >
          Iniciar sesión
        </a>
        <button
          onClick={() => router.push("/chat?anonymous=true")}
          className="bg-gray-700 hover:bg-gray-800 text-white px-6 py-3 rounded-lg block w-full"
        >
          Usar de forma anónima
        </button>
      </div>

      {isLoading && <p className="text-gray-400 mt-4">Cargando...</p>}
    </div>
  );
}
