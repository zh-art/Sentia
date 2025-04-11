"use client";

import { useState, useEffect } from "react";
import axios from "axios";

interface ChatTimerSelectorProps {
  chatId: string;
  currentTimer: number;
  onChangeTimer: (newTimer: number) => void;
}

export default function ChatTimerSelector({
  chatId,
  currentTimer,
  onChangeTimer,
}: ChatTimerSelectorProps) {
  const [timer, setTimer] = useState<number>(currentTimer);

  useEffect(() => {
    setTimer(currentTimer);
  }, [currentTimer]);

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newTimer = parseInt(e.target.value, 10);
    setTimer(newTimer);
    onChangeTimer(newTimer);

    try {
      await axios.post("/api/chat/timer", {
        chatId,
        timer_duration: newTimer,
      });
      console.log("Temporizador actualizado correctamente.");
    } catch (error) {
      console.error("Error al actualizar el temporizador:", error);
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
        <option value={1440}>24 horas</option>
        <option value={10080}>7 días</option>
        <option value={129600}>90 días</option>
        <option value={5}>5 minutos (prueba)</option>
      </select>
    </div>
  );
}
