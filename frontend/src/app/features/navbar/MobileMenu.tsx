"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import ThemeToggle from "@/app/features/theme/ThemeToggle";

export default function MobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button onClick={() => setOpen(!open)}>
        {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            key="menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-end"
          >
            <motion.div
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="w-3/4 max-w-xs bg-white dark:bg-[#1a1b26] border-l border-gray-200 dark:border-gray-700 p-8 shadow-xl flex flex-col gap-6"
            >
              <button
                onClick={() => setOpen(false)}
                aria-label="Cerrar menú"
                className="absolute top-18 right-4 p-2 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:scale-110 transition-all duration-300"
              >
                <X className="w-5 h-5" />
              </button>

              {[
                { label: "Inicio", href: "#inicio" },
                { label: "Sobre Nosotros", href: "#sobre" },
                { label: "Beneficios", href: "#features" },
                { label: "Testimonios", href: "#testimonios" },
                { label: "¿Cómo Funciona?", href: "#funciona" },
                { label: "Equipo", href: "#equipo" },
                { label: "FAQ", href: "#faq" },
                { label: "Contacto", href: "#contacto" },
              ].map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="text-lg text-gray-900 dark:text-white hover:text-blue-600 transition"
                >
                  {item.label}
                </a>
              ))}

              <ThemeToggle />

              <Link href="/login" onClick={() => setOpen(false)}>
                <button className="bg-[#2563eb] dark:bg-cyan-500 hover:bg-[#1d4ed8] dark:hover:bg-cyan-400 text-white px-4 py-2 rounded-xl shadow-lg font-medium transform transition-transform duration-300 hover:scale-105 w-full text-sm">
                  Iniciar chat
                </button>
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
