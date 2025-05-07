"use client";

interface AnonymityAlertProps {
  hasUserStartedChat: boolean;
}

export default function AnonymityAlert({ hasUserStartedChat }: AnonymityAlertProps) {
  const alertClass = hasUserStartedChat
    ? "bg-gray-800 text-white"
    : "bg-yellow-500 text-black";

  return (
    <div className={`text-center p-2 transition-colors duration-500 ${alertClass}`}>
      ⚠️ Estás en modo anónimo. Tu historial no se guardará. ⚠️
    </div>
  );
}
