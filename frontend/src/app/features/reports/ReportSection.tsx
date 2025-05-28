"use client";

import { useEffect } from "react";
import { useReports } from "./hooks/useReports";
import ReportList from "./components/ReportList";
import { useUser } from "@auth0/nextjs-auth0";

const ReportSection = () => {
  const { user } = useUser();
  const user_id = user?.sub || "";

  const {
    reportes,
    loading,
    error,
    fetchReportes,
    crearReporte,
    borrarReporte,
  } = useReports(user_id);

  useEffect(() => {
    if (user_id) fetchReportes();
  }, [user_id, fetchReportes]);

  const handleGenerar = async () => {
    await crearReporte();
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Reportes Semanales</h2>
      <button
        className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-2 rounded-xl shadow hover:opacity-90 transition mb-6"
        onClick={handleGenerar}
      >
        Generar Reporte
      </button>

      {loading && <p>Cargando...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <ReportList reportes={reportes} onDelete={borrarReporte} />
    </div>
  );
};

export default ReportSection;
