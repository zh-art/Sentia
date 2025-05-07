interface BotResponse {
  success: boolean;
  result?: string;
  error?: string;
}

export const sendBotPrompt = async (
  message: string,
  userId: string,
  isAnonymous: boolean
): Promise<BotResponse> => {
  try {
    const payload = {
      user_id: userId,
      message: message,
      type: isAnonymous ? "anonymous" : "authenticated",
    };

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/chat/generate`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      return {
        success: false,
        error: `Error HTTP: ${response.status}`,
      };
    }

    const data = await response.json();

    return {
      success: true,
      result: data.result ?? data.response ?? "No se recibió respuesta del bot",
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Error desconocido",
    };
  }
};
