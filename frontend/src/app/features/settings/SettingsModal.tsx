"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                className="relative w-full max-w-lg transform overflow-hidden rounded-xl 
                  bg-white dark:bg-[#1f2937] border border-gray-200 dark:border-gray-700 
                  p-6 text-left align-middle shadow-xl transition-all"
              >
                <button
                  onClick={onClose}
                  className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 
                  dark:text-gray-400 dark:hover:text-white transition"
                  aria-label="Cerrar"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>

                <Dialog.Title
                  as="h3"
                  className="text-lg font-bold leading-6 text-gray-900 dark:text-white mb-4"
                >
                  ⚙️ Configuración de Usuario
                </Dialog.Title>

                <div className="space-y-4">
                  <section>
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Privacidad
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Puedes configurar la visibilidad de tus sesiones y
                      controlar el guardado de conversaciones futuras.
                    </p>
                  </section>

                  <section>
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Preferencias de chat
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Elige cómo quieres que Sentia responda: tono formal,
                      respuestas cortas o con sugerencias.
                    </p>
                  </section>

                  <section>
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Notificaciones
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Gestiona alertas de finalización de sesión o cambios de
                      actividad.
                    </p>
                  </section>

                  <section>
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Asistente IA
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Cambia el estilo de interacción de Sentia o habilita
                      sugerencias automáticas.
                    </p>
                  </section>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
