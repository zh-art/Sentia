"use client";
import { useEffect, useState } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useRouter } from "next/navigation";
import AuthButton from "@/app/features/auth/AuthButton";
import Image from "next/image";
import { motion } from "framer-motion";
import ThemeToggle from "@/app/features/theme-toggle/ThemeToggle";

export default function Landing() {
  const { user } = useUser();
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (user) {
      router.push("/chat");
    }

    // Función para verificar el modo actual
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    };

    checkDarkMode(); // Verificación inicial

    // 🔍 Observador para detectar cambios de clase en el <html>
    const observer = new MutationObserver(() => {
      checkDarkMode();
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, [user, router]);

  return (
    <div className="relative flex flex-col items-center justify-between min-h-screen bg-gradient-to-b from-white via-indigo-50 to-purple-100 dark:from-[#1a1b26] dark:via-[#1a1c2e] dark:to-[#202237] text-gray-800 dark:text-[#e5e9f0] px-6 py-10 transition-colors duration-300">
      {/* Toggle de tema */}
      <ThemeToggle />

      {/* Contenido principal */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mt-20"
      >
        {/* Logo con animación de entrada y cambio dinámico */}
        <motion.div
          key={isDarkMode ? "dark-logo" : "light-logo"}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <Image
            src={
              isDarkMode
                ? "/logo/Sentia-logo-transparente-v2.png"
                : "/logo/Sentia-logo-transparente-v1.png"
            }
            alt="Sentia Logo"
            width={isDarkMode ? 1536 : 1024}
            height={isDarkMode ? 1024 : 1024}
            className={`${
              isDarkMode ? "w-60 md:w-60" : "w-60 md:w-80"
            } h-60 mx-auto transition-all duration-500`}
            priority
          />
        </motion.div>

        <p className="text-lg md:text-xl text-gray-600 dark:text-[#cbd5e1]">
          Tu espacio seguro para sentir, compartir y sanar.
        </p>
      </motion.div>

      {/* Botones */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="mt-10 w-full max-w-xs space-y-4"
      >
        <AuthButton />
        <button
          onClick={() => router.push("/chat?anonymous=true")}
          className="bg-[#2d3145] dark:bg-black border border-white transform transition-transform duration-300 hover:scale-105 text-white px-6 py-3 rounded-xl w-full shadow-lg cursor-pointer font-medium"
        >
          Usar de forma anónima
        </button>
      </motion.div>

      {/* Footer */}
      <footer className="text-sm text-gray-500 dark:text-gray-400 mt-16">
        © {new Date().getFullYear()} Sentia. Todos los derechos reservados.
      </footer>
    </div>
  );
}
