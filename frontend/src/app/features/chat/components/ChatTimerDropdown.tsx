"use client";

import { Fragment, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
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

export default function ChatTimerDropdown({ sessionId }: ChatTimerDropdownProps) {
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
    setToastMessage(result.success
      ? `Temporizador configurado para ${userName} a ${option.label}.`
      : result.message);

    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
    setIsSaving(false);
  };

  return (
    <div className="relative">
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button
            className="min-w-[12rem] inline-flex justify-center rounded-md bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
            disabled={isSaving}
          >
            {isSaving ? "Guardando..." : "Temporizador"}
            <ChevronDownIcon className="ml-2 -mr-1 h-5 w-5 text-gray-400" />
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
          <Menu.Items className="absolute right-0 z-50 mt-2 w-full origin-top-right rounded-md bg-gray-900 border border-gray-700 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            {durationOptions.map((option) => (
              <Menu.Item key={option.value}>
                {({ active }) => (
                  <button
                    onClick={() => handleSelect(option)}
                    className={`${
                      active ? "bg-blue-500 text-white" : "text-gray-200"
                    } group flex w-full items-center rounded-md px-4 py-2 text-sm`}
                  >
                    {option.label}
                  </button>
                )}
              </Menu.Item>
            ))}
          </Menu.Items>
        </Transition>
      </Menu>

      {showToast && (
        <div className="absolute top-full mt-2 right-0 z-50 bg-green-700 text-white px-4 py-2 rounded-md shadow-lg animate-fade-in-out min-w-[12rem]">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
