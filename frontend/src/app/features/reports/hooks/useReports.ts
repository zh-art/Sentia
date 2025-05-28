import { useState } from "react";
import {
  generarReporte,
  obtenerReportes,
  eliminarReporte,
} from "../services/reportApi";
import { Reporte } from "../types";


export const useReports = (user_id: string) => {
  const [reportes, setReportes] = useState<Reporte[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchReportes = async () => {
    try {
      setLoading(true);
      const data = await obtenerReportes(user_id);
      setReportes(data);
    } catch {
      setError("No se pudieron obtener los reportes.");
    } finally {
      setLoading(false);
    }
  };

  const crearReporte = async () => {
    try {
      setLoading(true);
      const { contenido } = await generarReporte(user_id);
      await fetchReportes();
      return contenido;
    } catch {
      setError("No se pudo generar el reporte.");
    } finally {
      setLoading(false);
    }
  };

  const borrarReporte = async (reporte_id: string) => {
    try {
      setLoading(true);
      await eliminarReporte(reporte_id, user_id);
      await fetchReportes();
    } catch {
      setError("No se pudo eliminar el reporte.");
    } finally {
      setLoading(false);
    }
  };

  return {
    reportes,
    loading,
    error,
    fetchReportes,
    crearReporte,
    borrarReporte,
  };
};
