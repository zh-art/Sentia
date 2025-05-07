export const updateTimerSetting = async (
    sessionId: string,
    duration: number
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/timer/${sessionId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(duration),
      });
  
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
  
      return {
        success: true,
        message: `Temporizador actualizado a ${duration} minutos.`,
      };
    } catch (error) {
      console.error("Error al actualizar temporizador:", error);
      return {
        success: false,
        message: "Error al actualizar el temporizador.",
      };
    }
  };
  