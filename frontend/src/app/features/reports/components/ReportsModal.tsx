"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { Reporte } from "../types";

interface ReportsModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportes: Reporte[];
}

export default function ReportsModal({
  isOpen,
  onClose,
  reportes,
}: ReportsModalProps) {
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
                className="relative w-full max-w-2xl transform overflow-hidden rounded-xl 
                  bg-white dark:bg-[#1f2937] border border-gray-200 dark:border-gray-700 
                  p-6 text-left align-middle shadow-xl transition-all max-h-[90vh] overflow-y-auto"
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
                  📄 Historial de Reportes
                </Dialog.Title>

                {reportes.length === 0 ? (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Aún no has generado ningún reporte.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {reportes.map((reporte) => (
                      <div
                        key={reporte._id}
                        className="p-4 rounded-md border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
                      >
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                          {new Date(reporte.fecha).toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
                          {reporte.contenido}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
