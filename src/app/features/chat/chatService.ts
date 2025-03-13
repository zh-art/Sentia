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
