import axios from "axios";
import { Reporte } from "../types";

const API_BASE = "http://localhost:8000/reporte/reporte";

export const generarReporte = async (
  user_id: string
): Promise<{ reporte_id: string; contenido: string }> => {
  const res = await axios.post<{ reporte_id: string; contenido: string }>(
    `${API_BASE}/generate`,
    { user_id }
  );
  return res.data;
};

export const obtenerReportes = async (user_id: string): Promise<Reporte[]> => {
  const res = await axios.get<Reporte[]>(`${API_BASE}`, {
    params: { user_id },
  });
  return res.data;
};

export const eliminarReporte = async (
  reporte_id: string,
  user_id: string
): Promise<{ mensaje: string }> => {
  const res = await axios.delete<{ mensaje: string }>(
    `${API_BASE}/${reporte_id}`,
    {
      params: { user_id },
    }
  );
  return res.data;
};
