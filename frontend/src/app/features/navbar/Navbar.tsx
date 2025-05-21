"use client";

import Link from "next/link";
import MobileMenu from "./MobileMenu";
import ThemeToggle from "@/app/features/theme/ThemeToggle";

export default function Navbar() {

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-[#1a1b26] border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex justify-between items-center py-4 px-6">
        <a
          href="#inicio"
          className="font-bold text-2xl text-gray-900 dark:text-white hover:text-blue-600 transition duration-300"
        >
          Sentia
        </a>

        <nav className="hidden md:flex gap-6 items-center text-sm">
          <a href="#inicio" className="hover:text-blue-600 transition">
            Inicio
          </a>
          <a href="#sobre" className="hover:text-blue-600 transition">
            Sobre Nosotros
          </a>
          <a href="#features" className="hover:text-blue-600 transition">
            Beneficios
          </a>
          <a href="#testimonios" className="hover:text-blue-600 transition">
            Testimonios
          </a>
          <a href="#funciona" className="hover:text-blue-600 transition">
            ¿Cómo Funciona?
          </a>
          <a href="#equipo" className="hover:text-blue-600 transition">
            Equipo
          </a>
          <a href="#faq" className="hover:text-blue-600 transition">
            FAQ
          </a>
          <a href="#contacto" className="hover:text-blue-600 transition">
            Contacto
          </a>

          <ThemeToggle />

          <Link href="/login">
            <button className="bg-[#2563eb] dark:bg-cyan-500 hover:bg-[#1d4ed8] dark:hover:bg-cyan-400 text-white px-6 py-3 rounded-xl shadow-lg font-medium transform transition-transform duration-300 hover:scale-105 cursor-pointer">
              Iniciar chat
            </button>
          </Link>
        </nav>

        <MobileMenu />
      </div>
    </header>
  );
}
