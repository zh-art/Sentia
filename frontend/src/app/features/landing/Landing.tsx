"use client";
import { useEffect, useState } from "react";
import { useUser } from "@auth0/nextjs-auth0";
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
    <div className="h-[94.4vh] flex items-center justify-center bg-gradient-to-b from-white via-indigo-50 to-purple-100 dark:from-[#1a1b26] dark:via-[#1a1c2e] dark:to-[#202237] text-gray-800 dark:text-[#e5e9f0] px-4 py-10 transition-colors duration-300">
      <ThemeToggle />

      <div className="w-full max-w-lg min-h-[600px] bg-transparent dark:bg-[#1a1c2e] rounded-2xl shadow-xl p-8 space-y-8 text-center border border-gray-300 dark:border-gray-600">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
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
              className="w-54 h-54 mx-auto"
              priority
            />
          </motion.div>

          <p className="text-lg md:text-xl text-gray-600 dark:text-[#cbd5e1] mt-4">
            Tu espacio seguro para sentir, compartir y sanar.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="space-y-4"
        >
          <AuthButton />
          <button
            onClick={() => router.push("/chat?anonymous=true")}
            className="bg-[#2d3145] dark:bg-black border border-white transform transition-transform duration-300 hover:scale-105 shadow-lg text-white px-6 py-3 rounded-xl w-full shadow-lg cursor-pointer font-medium"
          >
            Usar de forma anónima
          </button>
        </motion.div>

        <footer className="text-sm text-gray-500 dark:text-gray-400 mt-6">
          © {new Date().getFullYear()} Sentia. Todos los derechos reservados.
        </footer>
      </div>
    </div>
  );
}
