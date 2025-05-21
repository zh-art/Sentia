"use client";
import { useEffect, useState } from "react";
import { useUser } from "@auth0/nextjs-auth0";
import { useRouter } from "next/navigation";
import AuthButton from "@/app/features/auth/AuthButton";
import Image from "next/image";
import { motion } from "framer-motion";
import ThemeToggle from "@/app/features/theme/ThemeToggle";

export default function Landing() {
  const { user } = useUser();
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (user) {
      const roles = user["process.env.AUTH0_BASE/roles"] || [];
      if (roles.includes("admin")) {
        router.push("/admin");
      } else {
        router.push("/chat");
      }
    }

    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    };

    checkDarkMode();

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
      <ThemeToggle  />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mt-20"
      >
        <motion.div
          key={isDarkMode ? "dark-logo" : "light-logo"}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <Image
            src={
              isDarkMode
                ? "/logo/Sentia-dark-mode.png"
                : "/logo/Sentia-light-mode.png"
            }
            alt="Sentia Logo"
            width={1024}
            height={1024}
            className="w-50 h-50 mx-auto"
            priority
          />
        </motion.div>

        <p className="text-lg md:text-xl text-gray-600 dark:text-[#cbd5e1]">
          Tu espacio seguro para sentir, compartir y sanar.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="mt-10 w-full max-w-xs space-y-4"
      >
        <AuthButton />
        <button
          onClick={() => router.push("/chat?anonymous=true")}
          className="bg-white dark:bg-white/5 backdrop-blur-sm border border-gray-300 dark:border-white/10 text-gray-800 dark:text-white px-6 py-3 rounded-xl w-full shadow-md font-medium transition-transform transform hover:scale-105 cursor-pointer"
        >
          Usar de forma anónima
        </button>
      </motion.div>

      <footer className="text-sm text-gray-500 dark:text-gray-400 mt-16">
        © {new Date().getFullYear()}Sentia. Todos los derechos reservados. |
        Desarrollado con 💙 en Colombia
      </footer>
    </div>
  );
}
