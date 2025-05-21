interface BotResponse {
  success: boolean;
  result?: string;
  error?: string;
}

export const sendBotPrompt = async (
  message: string,
  userId: string,
  isAnonymous: boolean,
  messageType: "normal" | "welcome" = "normal"
): Promise<BotResponse> => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/chat/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userId,
        message: message,
        type: isAnonymous ? "anonymous" : "user",
        message_type: messageType,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      return { success: false, error: data.detail || "Error al generar respuesta" };
    }

    return { success: true, result: data.response };
  } catch (error) {
    return { success: false, error: "Error de red o del servidor" };
  }
};
