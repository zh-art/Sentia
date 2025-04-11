import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  console.log("Llamada recibida en /api/deepseek");
  const body = await req.json();
  console.log("Payload recibido: ", body);
  const {user_id, message} = body;

  try {
    const response = await fetch(`http://localhost:8000/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id, message }),
    });

    const data = await response.json();
    console.log("Respuesta desde FastAPI:",data)

    return NextResponse.json({ result: data.response });
  } catch (error) {
    console.error("Error comunicándose con FastAPI:", error);
    return NextResponse.json(
      { error: "Error interno al contactar el modelo." },
      { status: 500 }
    );
  }
}
