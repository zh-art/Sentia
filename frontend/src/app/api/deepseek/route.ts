import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  console.log("Llamada recibida en /api/deepseek");
   const body = await req.json();
   console.log("Payload recibido: ", body);

   
  const { user_id, prompt, type } = body;

  const chatId = user_id || "default-user";

  if (!prompt) {
    return NextResponse.json(
      { error: "No se recibió prompt válido" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(`http://localhost:8000/chat/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: chatId,
        message: prompt,
        type: type,
      }),
    });

    if (!response.ok) {
      throw new Error(`FastAPI error: ${response.status}`);
    }

    const data = await response.json();
    console.log("Respuesta desde FastAPI:", data);

    return NextResponse.json({ result: data.response });
  } catch (error) {
    console.error("Error comunicándose con FastAPI:", error);
    return NextResponse.json(
      { error: "Error interno al contactar el modelo." },
      { status: 500 }
    );
  }
}