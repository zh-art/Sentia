"use client";

import { Fragment, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { useUser } from "@auth0/nextjs-auth0/client";
import { updateUserTimer } from "./chatService";

interface ChatTimerDropdownProps {
  userId: string;
}

const durationOptions = [
  { label: "Ninguno", value: 0 },
  { label: "5 minutos", value: 5 },
  { label: "24 horas", value: 1440 },
  { label: "7 días", value: 10080 },
  { label: "90 días", value: 129600 },
];

export default function ChatTimerDropdown({ userId }: ChatTimerDropdownProps) {
  const { user, isLoading } = useUser();
  const [selectedOption, setSelectedOption] = useState(durationOptions[0]);
  const [message, setMessage] = useState<string>("");
  const [showToast, setShowToast] = useState(false);

  if (isLoading || !user) return null;

  const handleSelect = async (option: { label: string; value: number }) => {
    setSelectedOption(option);
    try {
      const result = await updateUserTimer(userId, option.value);
  
      const userName = user?.name || user?.nickname || "Usuario";
      setMessage(`Temporizador configurado para el usuario ${userName} a ${option.label}.`);
  
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    } catch (error) {
      console.error("Error actualizando el temporizador:", error);
      setMessage("Error actualizando el temporizador.");
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    }
  };
  

  return (
    <div className="relative">
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button className="min-w-[10rem] sm:min-w-[14rem] md:min-w-[18rem] lg:min-w-[24rem] max-w-full inline-flex justify-center rounded-md bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            Temporizador
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
          <Menu.Items className="absolute w-full right-0 z-50 mt-2 origin-top-right rounded-md bg-gray-900 border border-gray-700 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            {durationOptions.map((option) => (
              <Menu.Item key={option.value}>
                {({ active }) => (
                  <button
                    onClick={() => handleSelect(option)}
                    className={`${active ? "bg-blue-500 text-white" : "text-gray-200"
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
        <div className="absolute top-full mt-2 right-0 z-50 bg-green-700 text-white px-4 py-2 rounded-md shadow-lg animate-fade-in-out min-w-[10rem] sm:min-w-[14rem] md:min-w-[18rem] lg:min-w-[24rem] max-w-full">
          {message}
        </div>
      )}
    </div>
  );
}
