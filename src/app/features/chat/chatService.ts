export async function processUserMessage(message: string) {
  console.log("Mensaje recibido:", message);
  return new Promise<{ id: number; text: string; sender: "bot" }>((resolve) => {
    setTimeout(() => {
      resolve({
        id: Date.now(),
        text: "Estoy aquí para escucharte 😊",
        sender: "bot",
      });
    }, 1000);
  });
}
