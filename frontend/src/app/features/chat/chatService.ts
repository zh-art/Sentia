export async function fetchChatResponse(query: string): Promise<string> {
  try {
    const response = await fetch(
      `https://free-unoficial-gpt4o-mini-api-g70n.onrender.com/chat/?query=${encodeURIComponent(
        query
      )}`,
      {
        method: "GET",
        headers: { accept: "application/json" },
      }
    );
    const data = await response.json();
    return data.results || "No response from the API";
  } catch (error) {
    console.error(error);
    return "Failed to fetch API";
  }
}

export async function updateUserTimer(userId: string, duration: number) {
  const response = await fetch(`http://localhost:8000/user/timer/${userId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(duration),
  });

  if (!response.ok) {
    throw new Error("Error actualizando el temporizador del usuario");
  }

  return response.json();
}

export async function fetchChatHistory(userId: string) {
  const response = await fetch(`http://localhost:8000/chat/historial/${userId}`);
  
  if (!response.ok) {
    throw new Error("Error al obtener el historial del chat");
  }

  return response.json();
}
