"use client";

import { Fragment, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import {
  ChevronDownIcon,
  InformationCircleIcon,
} from "@heroicons/react/20/solid";
import { useUser } from "@auth0/nextjs-auth0";
import { updateTimerSetting } from "../utils/updateTimerSetting";

interface ChatTimerDropdownProps {
  sessionId: string;
}

const durationOptions = [
  { label: "Ninguno", value: 0 },
  { label: "5 minutos", value: 5 },
  { label: "24 horas", value: 1440 },
  { label: "7 días", value: 10080 },
  { label: "90 días", value: 129600 },
];

export default function ChatTimerDropdown({
  sessionId,
}: ChatTimerDropdownProps) {
  const { user, isLoading } = useUser();
  const [selectedOption, setSelectedOption] = useState(durationOptions[0]);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  if (isLoading || !user) return null;

  const handleSelect = async (option: { label: string; value: number }) => {
    setSelectedOption(option);
    setIsSaving(true);

    const result = await updateTimerSetting(sessionId, option.value);

    const userName = user?.name || user?.nickname || "Usuario";
    setToastMessage(
      result.success
        ? `Temporizador configurado para ${userName} a ${option.label}.`
        : result.message
    );

    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
    setIsSaving(false);
  };

  return (
    <Menu as="div" className="relative w-full">
      <div className="flex items-center justify-between px-2">
        <p className="text-sm font-semibold text-gray-900 dark:text-white">
          Temporizador
        </p>
        <div className="relative group">
          <InformationCircleIcon className="w-4 h-4 text-gray-400 ml-1 cursor-pointer" />
          <div className="absolute z-50 -left-48 top-1/2 -translate-y-1/2 hidden group-hover:flex bg-black text-white text-xs px-3 py-1 rounded shadow-lg w-52 transition">
            Define en cuánto tiempo se eliminará la conversación de forma
            automática.
          </div>
        </div>
      </div>

      <div className="px-2 mt-2">
        <Menu.Button
          className="w-full inline-flex justify-between items-center rounded-md bg-gray-100 dark:bg-gray-800 px-4 py-2 text-sm font-medium text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition cursor-pointer"
          disabled={isSaving}
        >
          {isSaving ? "Guardando..." : selectedOption.label}
          <ChevronDownIcon className="ml-2 h-5 w-5 text-gray-400" />
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
        <Menu.Items className="absolute right-2 mt-2 w-[calc(100%-16px)] origin-top-right rounded-md bg-white dark:bg-[#1f2937] border border-gray-200 dark:border-gray-700 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
          {durationOptions.map((option) => (
            <Menu.Item key={option.value}>
              {({ active }) => (
                <button
                  onClick={() => handleSelect(option)}
                  className={`${
                    active
                      ? "bg-blue-500 text-white"
                      : "text-gray-900 dark:text-gray-200"
                  } w-full px-4 py-2 text-sm text-left rounded-md cursor-pointer`}
                >
                  {option.label}
                </button>
              )}
            </Menu.Item>
          ))}
        </Menu.Items>
      </Transition>

      {showToast && (
        <div className="absolute top-full mt-2 right-0 z-50 bg-green-700 text-white px-4 py-2 rounded-md shadow-lg animate-fade-in-out w-full text-sm text-center">
          {toastMessage}
        </div>
      )}
    </Menu>
  );
}
