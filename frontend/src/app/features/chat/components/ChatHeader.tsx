"use client";

import { useUser } from "@auth0/nextjs-auth0";
import Image from "next/image";
import LogoutButton from "@/app/features/auth/LogoutButton";
import ChatTimerSelector from "./ChatTimerDropdown";
import ThemeToggleInline from "@/app/features/theme/ThemeToggleInLine";
import { InformationCircleIcon } from "@heroicons/react/24/solid";
import { Menu, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import SettingsModal from "@/app/features/settings/SettingsModal";
import ReportsModal from "@/app/features/reports/components/ReportsModal";
import { useReports } from "@/app/features/reports/hooks/useReports";

interface ChatHeaderProps {
  isAnonymous: boolean;
  sessionId: string;
  userName?: string;
  userPicture?: string;
  userId?: string;
  reporteId?: string;
}

const fadeInUp = {
  hidden: { opacity: 0, y: -20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function ChatHeader({
  isAnonymous,
  sessionId,
  userId,
  reporteId,
}: ChatHeaderProps) {
  const { user } = useUser();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isReportsOpen, setIsReportsOpen] = useState(false);

  const { reportes, fetchReportes, crearReporte, borrarReporte } = useReports(
    userId || ""
  );

  const audience = process.env.NEXT_PUBLIC_AUTH0_AUDIENCE;
  const loginUrl = `/auth/login?returnTo=/chat&audience=${audience}`;

  const handleGenerar = async () => {
    try {
      await crearReporte();
      alert("✅ Reporte generado exitosamente");
    } catch (error) {
      console.error("Error generando reporte:", error);
      alert("❌ Ocurrió un error al generar el reporte");
    }
  };

  const handleListar = async () => {
    try {
      await fetchReportes();
      setIsReportsOpen(true);
    } catch (error) {
      console.error("Error listando reportes:", error);
      alert("❌ Ocurrió un error al listar los reportes");
    }
  };

  const handleEliminar = async () => {
    try {
      if (!reporteId) return alert("No se proporcionó un ID de reporte.");
      await borrarReporte(reporteId);
      alert("🗑 Reporte eliminado exitosamente");
    } catch (error) {
      console.error("Error eliminando reporte:", error);
      alert("❌ Ocurrió un error al eliminar el reporte");
    }
  };

  return (
    <>
      <motion.header
        variants={fadeInUp}
        initial="hidden"
        animate="show"
        className="flex items-center justify-between px-6 py-4 
          bg-white dark:bg-[#1a1b26] 
          border-b border-gray-200 dark:border-gray-700
          text-gray-900 dark:text-[#e5e9f0]
          shadow-sm transition-colors duration-300"
      >
        <div className="flex items-center gap-4">
          <span className="text-2xl font-bold">Sentia</span>
        </div>

        <div className="flex items-center gap-4">
          {!isAnonymous && (
            <Menu as="div" className="relative inline-block text-left">
              <div>
                <Menu.Button className="focus:outline-none">
                  <Image
                    src={user?.picture || "/default-avatar.png"}
                    alt="Foto de perfil"
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full border-2 border-cyan-400 shadow-md cursor-pointer"
                  />
                </Menu.Button>
              </div>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Menu.Items
                  className="absolute right-0 mt-2 w-72 origin-top-right rounded-xl 
                  bg-white dark:bg-[#1f2937] border border-gray-200 dark:border-gray-700 
                  shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
                >
                  <div className="px-6 pt-6 pb-4 text-center">
                    <Image
                      src={user?.picture || "/default-avatar.png"}
                      alt="Avatar"
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded-full border-2 border-cyan-400 mx-auto mb-3"
                    />
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-1">
                      {user?.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {user?.email}
                    </p>
                  </div>

                  <div className="space-y-3 px-4 pt-4">
                    <ChatTimerSelector sessionId={sessionId} />

                    <button
                      onClick={() => setIsSettingsOpen(true)}
                      className="w-full px-4 py-2 text-sm rounded-md 
                      bg-gray-100 hover:bg-gray-200 
                      dark:bg-gray-800 dark:hover:bg-gray-700 
                      text-gray-800 dark:text-gray-200 transition cursor-pointer text-left"
                    >
                      Configuración
                    </button>

                    <button
                      onClick={handleGenerar}
                      className="w-full px-4 py-2 text-sm rounded-md 
                      bg-gray-100 hover:bg-gray-200 
                      dark:bg-gray-800 dark:hover:bg-gray-700 
                    text-gray-800 dark:text-gray-200 transition cursor-pointer text-left"
                    >
                      Generar reporte
                    </button>

                    <button
                      onClick={handleListar}
                      className="w-full px-4 py-2 text-sm rounded-md 
                    bg-gray-100 hover:bg-gray-200 
                    dark:bg-gray-800 dark:hover:bg-gray-700 
                    text-gray-800 dark:text-gray-200 transition cursor-pointer text-left"
                    >
                      Listar reporte
                    </button>

                    <button
                      onClick={handleEliminar}
                      className="w-full px-4 py-2 text-sm rounded-md 
                    bg-gray-100 hover:bg-gray-200 
                    dark:bg-gray-800 dark:hover:bg-gray-700 
                    text-gray-800 dark:text-gray-200 transition cursor-pointer text-left"
                    >
                      Eliminar reporte
                    </button>

                    <button
                      className="w-full px-4 py-2 text-sm rounded-md 
                      bg-gray-100 hover:bg-gray-200 
                      dark:bg-gray-800 dark:hover:bg-gray-700 
                      text-gray-800 dark:text-gray-200 transition cursor-pointer text-left"
                    >
                      Ver historial
                    </button>

                    <button
                      className="w-full px-4 py-2 text-sm rounded-md 
                      bg-gray-100 hover:bg-gray-200 
                      dark:bg-gray-800 dark:hover:bg-gray-700 
                      text-gray-800 dark:text-gray-200 transition cursor-pointer text-left"
                    >
                      Editar perfil
                    </button>
                  </div>

                  <div className="border-t border-gray-200 dark:border-gray-600 px-4 py-4 flex justify-center mt-4">
                    <LogoutButton />
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          )}

          {isAnonymous && (
            <div className="flex items-center gap-2">
              <span
                className="flex items-center gap-2 px-4 py-1.5 text-sm 
                text-cyan-700 dark:text-[#00B8D9] 
                bg-cyan-100/40 dark:bg-white/10 
                border border-cyan-400 rounded-full"
              >
                <InformationCircleIcon className="w-4 h-4" />
                Estás usando el modo anónimo
              </span>

              <Link href={loginUrl}>
                <button
                  className="px-4 py-1.5 text-sm font-medium rounded-full 
                  bg-[#2563eb] hover:bg-[#1d4ed8] 
                  dark:bg-cyan-500 dark:hover:bg-cyan-400 
                  text-white transition cursor-pointer"
                >
                  Iniciar sesión
                </button>
              </Link>
            </div>
          )}

          <ThemeToggleInline />
        </div>
      </motion.header>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
      <ReportsModal
        isOpen={isReportsOpen}
        onClose={() => setIsReportsOpen(false)}
        reportes={reportes}
      />
    </>
  );
}
