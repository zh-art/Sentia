import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: prompt }),
    });

    const data = await response.json();

    return NextResponse.json({ result: data.response });
  } catch (error) {
    console.error("Error comunicándose con FastAPI:", error);
    return NextResponse.json(
      { error: "Error interno al contactar el modelo." },
      { status: 500 }
    );
  }
}
