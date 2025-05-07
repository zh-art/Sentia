import { fetchChatHistory } from "../chatApi";

interface Message {
  id: number;
  text: string;
  sender: "bot" | "user" | "system" | "error";
}

export const synchronizeChatHistory = async (
  sessionId: string,
  setMessages: (messages: Message[]) => void
) => {
  try {
    const data = await fetchChatHistory(sessionId);

    const formattedMessages: Message[] = data.flatMap((item: any) => [
      {
        id: Date.parse(item.timestamp),
        text: item.message,
        sender: "user",
      },
      {
        id: Date.parse(item.timestamp) + 1,
        text: item.response,
        sender: "bot",
      },
    ]);

    setMessages(formattedMessages);
  } catch (error) {
    console.error("Error al sincronizar historial:", error);
  }
};
