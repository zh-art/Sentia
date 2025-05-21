"use client";

import { useState, useEffect } from "react";
import axios from "axios";

interface ChatTimerSelectorProps {
  chatId: string;
  currentTimer: number;
  onChangeTimer: (newTimer: number) => void;
  onSendMessage: (message: string, sender?: "bot" | "user" | "system" | "error") => void;
}

export default function ChatTimerSelector({
  chatId,
  currentTimer,
  onChangeTimer,
  onSendMessage
}: ChatTimerSelectorProps) {
  const [timer, setTimer] = useState<number>(currentTimer);

  useEffect(() => {
    setTimer(currentTimer);
  }, [currentTimer]);

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newTimer = parseInt(e.target.value, 10);
    setTimer(newTimer);
    onChangeTimer(newTimer);
    const readableTimer =
      newTimer === 0 ? "desactivado" :
      newTimer === 1 ? "1 minuto" :
      newTimer === 1440 ? "24 horas" :
      newTimer === 10080 ? "7 días" :
      newTimer === 129600 ? "90 días" : `${newTimer} minutos`;
    onSendMessage(`Temporizador de eliminación de mensajes ${newTimer === 0 ? 'desactivado' : `establecido a ${readableTimer}`}.`, "system");
  
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
      await axios.put(`${backendUrl}/chat/${chatId}/timer`, 
        newTimer
      );
      console.log("Temporizador actualizado correctamente.");
    } catch (error) {
      console.error("Error al actualizar el temporizador:", error);
      // Mostrar mensaje de error en el chat
      onSendMessage("Hubo un problema al guardar el temporizador en el servidor. El cambio podría no ser persistente.", "error");
    }
  };

  return (
    <div className="flex items-center justify-center p-4 bg-gray-800 text-white">
      <label htmlFor="timer" className="mr-2">
        Borrar mensajes después de:
      </label>
      <select
        id="timer"
        value={timer}
        onChange={handleChange}
        className="bg-gray-700 text-white p-1 rounded"
      >
        <option value={0}>No borrar</option>
        <option value={1}>1 minuto (prueba)</option>
        <option value={1440}>24 horas</option>
        <option value={10080}>7 días</option>
        <option value={129600}>90 días</option>
      </select>
    </div>
  );
}
