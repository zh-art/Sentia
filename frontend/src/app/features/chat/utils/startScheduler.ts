"use client";

import { getAccessToken } from "@auth0/nextjs-auth0";

export const startScheduler = async () => {
  try {
    const { accessToken } = await getAccessToken();

    if (!accessToken) {
      console.error("Token no disponible");
      return;
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/start-scheduler`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error al iniciar el scheduler: ${response.status}`);
    }

    console.log("Scheduler iniciado correctamente");
  } catch (error) {
    console.error("Fallo al iniciar el scheduler:", error);
  }
};
