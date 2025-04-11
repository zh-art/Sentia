"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import MobileMenu from "./MobileMenu";

export default function Navbar() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-md">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        <Link
          href="/home"
          className="font-bold text-2xl text-gray-900 dark:text-white"
        >
          Sentia
        </Link>

        <div className="hidden md:flex gap-6 items-center text-sm">
          <Link href="/" className="hover:text-blue-600 transition">
            Inicio
          </Link>
          <Link
            href="/sobre-nosotros"
            className="hover:text-blue-600 transition"
          >
            Sobre Nosotros
          </Link>
          <Link
            href="/actualizaciones"
            className="hover:text-blue-600 transition"
          >
            Actualizaciones
          </Link>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs"
          >
            {darkMode ? "Modo Claro" : "Modo Oscuro"}
          </button>

          <Link href="/chat">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition text-xs">
              Iniciar Chat
            </button>
          </Link>
        </div>

        <MobileMenu />
      </div>
    </header>
  );
}
